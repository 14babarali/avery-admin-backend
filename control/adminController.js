const { smtpConfig } = require('../models');

exports.savesmtpConfig = async (req, res) => {
    try {
        const { fromEmail, smtpPassword, smtpServer, smtpPort, supportEmail, startTls, tls, smtpUsername } = req.body;

        let config = await smtpConfig.findOne();
        if (config) {
            config.fromEmail = fromEmail;
            config.smtpPassword = smtpPassword;
            config.smtpServer = smtpServer;
            config.smtpPort = smtpPort;
            config.supportEmail = supportEmail;
            config.startTls = startTls;
            config.tls = tls;
            config.smtpUsername = smtpUsername;
        } else {
            config = new smtpConfig({
                fromEmail,
                smtpPassword,
                smtpServer,
                smtpPort,
                supportEmail,
                startTls,
                tls,
                smtpUsername
            });
        }

        await config.save();
        res.status(200).json({ message: 'SMTP configuration saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving SMTP configuration', error });
    }
};
