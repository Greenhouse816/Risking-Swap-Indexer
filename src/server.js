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
import { RISKING_ABI, RISKING_ADDRESS } from "./config/index.js";
import Risk from "./models/Risk.js";

try {
  dotenv.config();
} catch (error) {
  console.error("Error loading environment variables:", error);
  process.exit(1);
}

const app = express();

app.use(helmet());

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOrigin = {
  allowedOrigins: ["http://localhost:5173, https://dev.risking.io"],
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

cron.schedule("* * * * *", async () => {
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
    console.log("Finished updating.");
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

