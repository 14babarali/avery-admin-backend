// utils/emailTrigger.js
const mailgun = require("mailgun-js");
const { SmtpConfig, Template } = require("../models");

async function sendEmail(templateName, to, variables = {}) {
    // Fetch SMTP configuration from the database
    const smtpSettings = await SmtpConfig.findOne();
    
    if (!smtpSettings) {
        throw new Error("SMTP configuration not found");
    }

    // Initialize Mailgun with the API key and domain from the configuration
    const mg = mailgun({
        apiKey: smtpSettings.smtpPassword, 
        domain: smtpSettings.smtpServer,   
    });

    // Fetch the email template by name
    const template = await Template.findOne({ name: templateName });

    if (!template) {
        throw new Error("Email template not found");
    }

    // Prepare the email data with the template and variables
    const data = {
        from: smtpSettings.fromEmail,
        to,
        subject: template.subject,
        html: replaceTemplateVars(template.body, variables),
    };

    // Send the email using Mailgun
    return mg.messages().send(data);
}

function replaceTemplateVars(template, variables) {
    return template.replace(/{{(.*?)}}/g, (_, varName) => variables[varName.trim()] || "");
}

module.exports = { sendEmail };
