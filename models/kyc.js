const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KYCSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    frontId: {
        type: String, // URL or base64 string for the captured image
        required: true,
    },
    backId: {
        type: String, // URL or base64 string for the captured image
        required: true,
    },
    faceShot: {
        type: String, // URL or base64 string for the captured image
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

const KYC = mongoose.model('KYC', KYCSchema);
module.exports = KYC;
