import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  address: { require: true, unique: true, type: String },
  name: { require: true, type: String },
  logo: { type: String },
  banner: { type: String },
  totalSupply: { type: Number },
  price: {
    type: Number,
    default: 0,
  },
});

const Collection = mongoose.model("collections", CollectionSchema);

export default Collection;

