const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const smtpConfigSchema = new Schema({
    fromEmail: { 
        type: String, 
        default: process.env.FROM_EMAIL,  
        required: true 
    },
    smtpPassword: { 
        type: String, 
        default: process.env.SMTP_PASSWORD,  
        required: true 
    },
    smtpServer: { 
        type: String, 
        default: process.env.SMTP_SERVER,  
        required: true 
    },
    smtpPort: { 
        type: Number, 
        default: process.env.SMTP_PORT || 587,  
        required: true 
    },
    supportEmail: { 
        type: String, 
        default: process.env.SUPPORT_EMAIL,  
        required: true 
    },
    startTls: { 
        type: Boolean, 
        default: process.env.START_TLS === 'true'  
    },
    tls: { 
        type: Boolean, 
        default: process.env.TLS === 'true'  
    },
    smtpUsername: { 
        type: String, 
        default: process.env.SMTP_USERNAME,  
        required: true 
    }
}, { timestamps: true });

const SmtpConfig = mongoose.model('SmtpConfig', smtpConfigSchema);

module.exports = SmtpConfig;
