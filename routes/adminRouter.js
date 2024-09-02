const express = require('express');
const router = express.Router();
const adminController = require('../control/adminController');

router.post('/smtp-config', adminController.savesmtpConfig);

module.exports = router;
