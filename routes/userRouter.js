const express = require('express');
const router = express.Router();
const { usermiddleware } = require('../middleware/usermiddleware');
const userController = require("../control/userController")


router.post("/auth", userController.login);

router.get("/getAccounts", usermiddleware, userController.getAccounts)
router.post("/getProfit", usermiddleware, userController.getProfit)
router.post("/updatePassword", usermiddleware, userController.updatePassword)
router.post("/getUserInfo", usermiddleware, userController.getUserInfo)
router.post("/submit-agreement", usermiddleware, userController.submitAgreement)
//submit kyc endpoint
router.post("/submit-kyc", usermiddleware, userController.kyc )

module.exports = router;