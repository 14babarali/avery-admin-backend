// utils/emailTrigger.js
const mailgun = require("mailgun-js");
const { SmtpConfig, Template } = require("../models");

async function sendEmail(templateName, to, variables = {}) {
    try {
        const smtpSettings = await SmtpConfig.findOne();
        if (!smtpSettings) {
            throw new Error("SMTP configuration not found");
        }

        if (!smtpSettings.smtpPassword || !smtpSettings.smtpServer) {
            throw new Error("SMTP configuration is incomplete");
        }

        const mg = mailgun({
            apiKey: smtpSettings.smtpPassword, 
            domain: smtpSettings.smtpServer,
        });

        const template = await Template.findOne({ name: templateName });
        if (!template) {
            throw new Error("Email template not found");
        }

        if (!template.subject) {
            throw new Error("Email template subject is empty");
        }

        const data = {
            from: smtpSettings.fromEmail,
            to,
            subject: template.subject,
            html: replaceTemplateVars(template.body, variables),
        };

        if (!data.from) {
            throw new Error("SMTP configuration from email is empty");
        }

        return mg.messages().send(data);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
}


function replaceTemplateVars(template, variables) {
    return template.replace(/{{(.*?)}}/g, (_, varName) => variables[varName.trim()] || "");
}

module.exports = { sendEmail };
