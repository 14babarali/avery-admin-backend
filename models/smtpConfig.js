const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const smtpConfigSchema = new Schema({
    fromEmail: { 
        type: String, 
        required: true 
    },
    apiKey: { 
        type: String,
    },
    smtpPassword: { type: String, required: true },
    smtpServer: { type: String, required: true },
    smtpPort: { type: Number, required: true },
    supportEmail: { type: String, required: true },
    startTls: { type: Number, required: true },
    tls: { type: Number, required: true },
    smtpUsername: { type: String, required: true }
}, { timestamps: true });

const SmtpConfig = mongoose.model('SmtpConfig', smtpConfigSchema);

module.exports = SmtpConfig;
