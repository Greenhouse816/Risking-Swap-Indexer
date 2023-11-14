import mongoose from "mongoose";

const RiskSchema = new mongoose.Schema({
  riskId: {
    require: true,
    unique: true,
    type: String,
  },
  author: {
    require: true,
    type: String,
  },
  registeredTime: {
    require: true,
    type: String,
  },
  endedTime: {
    require: true,
    type: String,
  },
  state: {
    require: true,
    type: Number,
  },
  participants: [
    {
      owner: {
        require: true,
        type: String,
      },
      etherValue: {
        require: true,
        type: String,
      },
      nftTokens: [
        {
          nftAddress: {
            require: true,
            type: String,
          },
          nftId: {
            require: true,
            type: String,
          },
          nftAmount: {
            require: true,
            type: String,
          },
          nftName: {
            require: true,
            type: String,
          },
          nftUri: {
            require: true,
            type: String,
          },
        },
      ],
    },
  ],
  playerId: {
    require: true,
    type: String,
  },
  winner: {
    require: true,
    type: String,
  },
  randomResult: {
    randomNumber: {
      required: true,
      type: String,
    },
    nomalizedRandomNumber: {
      required: true,
      type: String,
    },
  },
});

const Risk = mongoose.model("risks", RiskSchema);

export default Risk;

