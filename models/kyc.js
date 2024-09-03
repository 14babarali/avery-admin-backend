const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KYCSchema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    idDocument: {
        type: String, // I suggest file URL to come from cloudinary
        required: true,
    },
    proofOfAddress: {
        type: String, // I suggest file URL to come from cloudinary
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Denied"],
        default: "Pending",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    collection: "kyc",
    timestamps: true,
});

const KYC = mongoose.model("KYC", KYCSchema);
module.exports = KYC;
