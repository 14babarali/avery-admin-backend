const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const TemplateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    trigger: {
        type: String,
        enum: ["Signup", "KYCApproved", "PayoutRequest", "Custom"],
        required: true,
    },
}, {
    collection: "email_templates",
    timestamps: true,
});

const Template = mongoose.model("Template", TemplateSchema);
module.exports = Template;
