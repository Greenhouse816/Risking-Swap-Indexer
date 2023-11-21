import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import multer from "multer";
import mongoose from "mongoose";
import cron from "node-cron";
import Web3 from "web3";
import axios from "axios";
import { RISKING_ABI, RISKING_ADDRESS, ERC721_ABI } from "./config/index.js";
import Risk from "./models/Risk.js";
import Temp from "./models/Temp.js";
import Collection from "./models/Collection.js";
import Metadata from "./models/Metadata.js";

try {
  dotenv.config();
} catch (error) {
  console.error("Error loading environment variables:", error);
  process.exit(1);
}
console.log(process.env.MORALIS_API_KEY)
const app = express();

app.use(helmet());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOrigin = {
  allowedOrigins: ["http://localhost:5173, https://dev.risking.io, 192.168.109.84:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOrigin));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fieldNameSize: 100, // increase limits as per your requirement
    fieldSize: 4096 * 4096,
  },
});

const connectToMongo = async () => {
  const mongoUri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

await connectToMongo();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

const url = `https://eth-goerli.g.alchemy.com/v2/${process.env.CONTRACT_ALCHEMY_API_KEY}`;
const web3 = new Web3(url);
const riskingContract = new web3.eth.Contract(RISKING_ABI, RISKING_ADDRESS);

const getTokenURI = async (tokenAddress, tokenId) => {
  try {
    const contract = new web3.eth.Contract(ERC721_ABI, tokenAddress);
    const tokenURI = await contract.methods.tokenURI(tokenId).call();
    return { isError: false, tokenURI };
  } catch (e) {
    console.log(e);
    return { isError: true, tokenURI: "" };
  }
};

const getNftDatabyCollection = async () => {
  try {
    const collections = await Collection.find({});
    console.log("addresses", collections)
    const metaData = await Promise.all(collections.map(async (collection) => {
      let nextCursor = "start";
      let nftMetadata = [];
      while (nextCursor) {
        const moralisReuestOption = {
          method: "Get",
          url: `https://deep-index.moralis.io/api/v2.2/nft/${collection.address}/owners`,
          params: {
            chain: "goerli",
            format: "decimal",
            limit: "100",
            cursor: nextCursor === "start" ? "" : nextCursor,
          },
          headers: {
            accept: "application/json",
            "X-API-Key": process.env.MORALIS_API_KEY,
          },
        };

        const response = await axios.request(moralisReuestOption);
        nftMetadata = nftMetadata.concat(response.data.result);
        nextCursor = response.data.cursor;
      }
      console.log("getting new METADATA ...");
      const newMeta = nftMetadata.map((data) => {
        let tokenUri = JSON.parse(data.metadata)?.image || "";
        tokenUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
        tokenUri = tokenUri.replace("nftstorage.link", "ipfs.io");
        return {
            owner: data.owner_of,
            nftId: data.token_id,
            nftAmount: data.contract_type === "ERC721" ? "0" : data.amount,
            nftUri: tokenUri,
            nftName: data.metadata?.name ? data.metadata.name : collection.name 
          }
      })
      console.log(newMeta)
      await Metadata.findOneAndUpdate(
        {
        address: collection.address,
       },
       {
        contract_type: nftMetadata[0].contract_type,
        tokens: newMeta
       },
       {
        upsert: true,
        new: true
       })
    }))
  } catch (error) {
    console.log(error)
  }
}

cron.schedule("*/5 * * * *", async () => {
  await getNftDatabyCollection();
  console.log("Updating Risking status...");
  const allRisks = await riskingContract.methods.getAllRisks().call();
  try {
    await Promise.all(
      allRisks
        .filter((risk) => risk.participants.length !== 0)
        .map(async (risk) => {
          const participants = await Promise.all(
            risk.participants.map(async (p) => {
              const nftTokens = await Promise.all(
                p.nftTokens.map(async (t) => {
                  const metadata = await getTokenURI(
                    t.nftAddress,
                    Number(t.nftId)
                  );
                  if (!metadata.isError && metadata.tokenURI) {
                    let metadataUri = metadata.tokenURI;
                    metadataUri = metadataUri.replace(
                      "nftstorage.link/ipfs",
                      "ipfs.io/ipfs"
                    );
                    if (metadataUri.includes(".ipfs.nftstorage.link")) {
                      const str = metadataUri.split(".ipfs.nftstorage.link");
                      const cid = str[0].split("//")[1];
                      metadataUri = "https://ipfs.io/ipfs/" + cid + str[1];
                    }
                    try {
                      const response = await axios.get(metadataUri);
                      const nftName = ((await response.data?.name) ?? "")
                        .split("#")[0]
                        .trim();
                      let nftUri = await response.data?.image;
                      nftUri = nftUri.replace(
                        "ipfs://",
                        "https://ipfs.io/ipfs/"
                      );
                      nftUri = nftUri.replace("nftstorage.link", "ipfs.io");
                      return {
                        nftAddress: t.nftAddress,
                        nftId: t.nftId.toString(),
                        nftAmount: (t.nftAmount ?? "0").toString(),
                        nftName: nftName,
                        nftUri: nftUri,
                      };
                    } catch (e) {
                      console.log(e);
                      return {
                        nftAddress: t.nftAddress,
                        nftId: t.nftId.toString(),
                        nftAmount: (t.nftAmount ?? "0").toString(),
                        nftName: "",
                        nftUri: "",
                      };
                    }
                  } else
                    return {
                      nftAddress: t.nftAddress,
                      nftId: t.nftId,
                      nftAmount: "",
                      nftName: "",
                      nftUri: "",
                    };
                })
              );

              return {
                owner: p.owner,
                etherValue: p.etherValue.toString(),
                nftTokens,
              };
            })
          );

          await Risk.findOneAndUpdate(
            { riskId: risk.id.toString() },
            {
              author: risk.author,
              registeredTime: risk.registeredTime.toString(),
              endedTime: risk.endedTime.toString(),
              state: risk.state,
              participants,
              playerId: risk.playerId.toString(),
              winner: risk.winner,
              randomResult: risk.randomResult,
            },
            {
              upsert: true,
              new: true,
            }
          );
        })
    );
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Finished Risk updating.");
  }

  console.log("Updating Temp status...");
  const allTemps = await riskingContract.methods.getAllTemps().call();
  try {
    await Promise.all(
      allTemps
        .map(async (temp) => {
          const nftTokens = await Promise.all(
            temp.deposit.nftTokens.map(async (nft) => {
              const metadata = await getTokenURI(
                nft.nftAddress,
                Number(nft.nftId)
              );
              if (!metadata.isError && metadata.tokenURI) {
                let metadataUri = metadata.tokenURI;
                metadataUri = metadataUri.replace(
                  "nftstorage.link/ipfs",
                  "ipfs.io/ipfs"
                );
                if (metadataUri.includes(".ipfs.nftstorage.link")) {
                  const str = metadataUri.split(".ipfs.nftstorage.link");
                  const cid = str[0].split("//")[1];
                  metadataUri = "https://ipfs.io/ipfs/" + cid + str[1];
                }
                try {
                  const response = await axios.get(metadataUri);
                  const nftName = ((await response.data?.name) ?? "")
                    .split("#")[0]
                    .trim();
                  let nftUri = await response.data?.image;
                  nftUri = nftUri.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  );
                  nftUri = nftUri.replace("nftstorage.link", "ipfs.io");
                  return {
                    nftAddress: nft.nftAddress,
                    nftId: nft.nftId.toString(),
                    nftAmount: (nft.nftAmount ?? "0").toString(),
                    nftName: nftName,
                    nftUri: nftUri,
                  };
                } catch (e) {
                  console.log(e);
                  return {
                    nftAddress: nft.nftAddress,
                    nftId: nft.nftId.toString(),
                    nftAmount: (nft.nftAmount ?? "0").toString(),
                    nftName: "",
                    nftUri: "",
                  };
                }
              } else
                return {
                  nftAddress: nft.nftAddress,
                  nftId: nft.nftId,
                  nftAmount: "",
                  nftName: "",
                  nftUri: "",
                };
            })
          );

          await Temp.findOneAndUpdate(
            { tempId: temp.id.toString() },
            {
              state: temp.state,
              deposits: {
                owner: temp.deposit.owner,
                etherValue: temp.deposit.etherValue.toString(),
                nftTokens: nftTokens
              },
            },
            {
              upsert: true,
              new: true,
            }
          );
        })
    );
  } catch (e) {
    console.log(e);
  } finally {
    console.log("Finished Temp updating.");
  }

});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

