// utils/emailTrigger.js
const Mailgun = require('mailgun.js');
const formData = require('form-data');
const { SmtpConfig, Template } = require("../models");

async function sendEmail(templateName, to, variables = {}) {
    try {
        const smtpSettings = await SmtpConfig.findOne();
        if (!smtpSettings) {
            throw new Error("SMTP configuration not found");
        }

        if (!smtpSettings.apiKey) {
            throw new Error("API key is not set");
        }

        if (!smtpSettings.smtpServer) {
            throw new Error("Mailgun domain is not set");
        }

        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({
            username: 'api',
            key: smtpSettings.apiKey 
        });

        const template = await Template.findOne({ name: templateName });
        if (!template) {
            throw new Error(`Email template ${templateName} not found`);
        }

        if (!template.subject) {
            throw new Error("Email subject is not set");
        }

        if (!template.body) {
            throw new Error("Email body is not set");
        }

        // Extract the domain part from the 'fromEmail'
        const fromEmail = smtpSettings.fromEmail;
        const domain = fromEmail.split('@')[1];  // Extract domain from the email
        const newFromEmail = `nowtrade@${domain}`;  // Construct the new "from" email

        const data = {
            from: newFromEmail,  // Use the constructed "from" email address
            to,  // Recipient
            subject: template.subject,
            html: replaceTemplateVars(template.body, variables),
        };

        if (!data.from) {
            throw new Error("From email is not set");
        }

        const response = await mg.messages.create(smtpSettings.smtpServer, data);
        return response;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
}


// Helper function to replace template variables
function replaceTemplateVars(template, variables) {
    return template.replace(/{{(.*?)}}/g, (_, varName) => variables[varName.trim()] || "");
}

module.exports = { sendEmail };
