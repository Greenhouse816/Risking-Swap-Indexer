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
import axiosInstance from "./config/axios.js";

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


const getNftDatabyCollection = async () => {
  try {
    const collections = await Collection.find({});

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
            "x-api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjAwOTgzM2NmLWEwMmItNGE2MS05ZDI4LTBjODY3MTY2NTU0MCIsIm9yZ0lkIjoiMzU0MjM4IiwidXNlcklkIjoiMjg4MzYxIiwidHlwZUlkIjoiMDFjMmU4YTUtZWQyMS00MWQ0LTgxMzQtMzQ3YjVhOGQwOTE1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDA2NzI3ODUsImV4cCI6NDg1NjQzMjc4NX0.ytZlBZIGctHYSmNahbKK8J2OEbvVfmiEYpyg9CtU_zY",
            // "X-API-Key": process.env.MORALIS_API_KEY2,
          },
        };

        const response = await axiosInstance.request(moralisReuestOption);
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
    console.log("|||||||||||||||||-----metadata updating error-----||||||||||||||||||||", error)
  }
}


await getNftDatabyCollection();

cron.schedule("*/2 * * * *", async () => {
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
                  try {
                    const metadata = await Metadata.findOne({
                      address: t[0].toLowerCase(),
                      tokens: {
                        $elemMatch:
                        {
                          nftId: t[1]
                        }
                      }
                    },
                      {
                        'tokens.$': 1 // This is a projection to return only the matching token
                      })
                    return {
                      nftAddress: t[0].toLowerCase(),
                      nftId: t[1].toString(),
                      nftAmount: (t.nftAmount ?? "0").toString(),
                      nftName: metadata.tokens[0].nftName,
                      nftUri: metadata.tokens[0].nftUri,
                    };
                  } catch (e) {
                    return {
                      nftAddress: t[0].toLowerCase(),
                      nftId: t[1].toString(),
                      nftAmount: (t.nftAmount ?? "0").toString(),
                      nftName: "",
                      nftUri: "",
                    };
                  }
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
    console.log("|||||||||||||||||-----Risk updating error-----||||||||||||||||||||", e);
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
              try {
                const metadata = await Metadata.findOne({
                  address: nft[0].toLowerCase(),
                  tokens: {
                    $elemMatch:
                    {
                      nftId: nft[1]
                    }
                  }
                },
                  {
                    'tokens.$': 1 // This is a projection to return only the matching token
                  })
                return {
                  nftAddress: nft[0].toLowerCase(),
                  nftId: nft[1].toString(),
                  nftAmount: (nft.nftAmount ?? "0").toString(),
                  nftName: metadata.tokens[0].nftName,
                  nftUri: metadata.tokens[0].nftUri,
                };
              } catch (e) {
                return {
                  nftAddress: nft[0].toLowerCase(),
                  nftId: nft[1].toString(),
                  nftAmount: (nft.nftAmount ?? "0").toString(),
                  nftName: "",
                  nftUri: "",
                };
              }
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
    console.log("|||||||||||||||||-----Temp updating error-----||||||||||||||||||||", e);
  } finally {
    console.log("Finished Temp updating.");
  }

});

cron.schedule("0 * * * *", async () => {
  console.log("updating metadata...")
  await getNftDatabyCollection();
  console.log("updating metadata finished.");
})



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

