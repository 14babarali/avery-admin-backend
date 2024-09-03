const express = require('express');
const router = express.Router();
const authController = require('../control/authController');

// Route to register a new company
router.post("/register", authController.register);

// Route to login a company
router.post("/login", authController.login);

module.exports = router;