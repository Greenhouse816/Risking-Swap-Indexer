import mongoose from "mongoose";

const MetadataSchema = new mongoose.Schema({
    address: { require: true, unique: true, type: String },
    collection_type: {
        type: String,
        default: "ERC721"
    },
    tokens: [
        {
            owner: {
                type: String,
                require: true
            },
            nftId: {
                type: String,
                require: true
            },
            amount: {
                type: String,
                default: "0"
            },
            nftUri: {
                type: String,
                default: ""
            },
            nftName: {
                type: String,
                default: ""
            },
        },
    ]
});

const Metadada = mongoose.model("metadata", MetadataSchema);

export default Metadada;
