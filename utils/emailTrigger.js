//utils/emailTrigger
const mailgun = require("mailgun-js");
const { smtpConfig, emailTemplate } = require("../models");

async function sendEmail(templateName, to, variables = {}) {
    // Fetch SMTP configuration from the database
    const smtpSettings = await smtpConfig.findOne();
    
    if (!smtpSettings) {
        throw new Error("SMTP configuration not found");
    }

    // Initialize Mailgun with the SMTP configuration from the database
    const mg = mailgun({
        apiKey: smtpSettings.smtpPassword, // Using smtpPassword as the API key
        domain: smtpSettings.smtpServer,   // Using the SMTP server as the domain
    });

    // Fetch the email template by name
    const template = await emailTemplate.findOne({ name: templateName });

    if (!template) {
        throw new Error("Template not found");
    }

    // Prepare the email data with the template and variables
    const data = {
        from: smtpSettings.fromEmail, // Dynamic "from" email
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
