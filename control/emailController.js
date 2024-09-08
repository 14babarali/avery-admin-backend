// controllers/emailController.js
const {Template, SmtpConfig} = require("../models");


// Get SMTP Configuration
exports.getSmtpConfig = async (req, res) => {
    try {
        const smtpConfig = await SmtpConfig.findOne();
        res.json(smtpConfig);
    } catch (error) {
        res.status(500).json({ message: "Error fetching SMTP configuration" });
    }
};

// Update SMTP Configuration
exports.updateSmtpConfig = async (req, res) => {
    try {
        const updatedConfig = await SmtpConfig.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(updatedConfig);
    } catch (error) {
        res.status(500).json({ message: "Error updating SMTP configuration" });
    }
};

// Get all email templates
exports.getTemplates = async (req, res) => {
    try {
        const templates = await Template.find();
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: "Error fetching email templates" });
    }
};

// Create or Update an email template
exports.upsertTemplate = async (req, res) => {
    try {
        const { name, subject, body, trigger } = req.body;
        const template = await Template.findOneAndUpdate(
            { name },
            { subject, body, trigger },
            { new: true, upsert: true }
        );
        res.json(template);
    } catch (error) {
        res.status(500).json({ message: "Error creating or updating email template" });
    }
};

// Delete an email template
exports.deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        await Template.findByIdAndDelete(id);
        res.json({ message: "Template deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting email template" });
    }
};
