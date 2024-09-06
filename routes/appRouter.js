const express = require('express');
const router = express.Router();
const customerController = require("../control/customerController")
const authControl = require("../control/authController");
const accountController = require("../control/accountController");
const companyController = require("../control/companyController");
const planController = require("../control/planController");
const { adminmiddleware } = require('../middleware/adminmiddleware');

const app = express();

// Define a GET route for the root path
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the server' });
});

router.post("/login", authControl.login);

app.post('/webhooks/woocommerce', (req, res) => {
    console.log(req.body);
    res.status(200).send('Webhook received!');
  });

//submit kyc endpoint
router.post("/submit-kyc", customerController.kyc )

router.post("/createCompany", adminmiddleware, companyController.createCompany)

router.get("/getCustomers", adminmiddleware, customerController.getCustomers);
// get all kyc submissions
router.get("/kyc-submissions", adminmiddleware , customerController.getKYCSubmissions);
router.post("/createCustomer",  customerController.createCustomer);
router.post("/updateCustomer", adminmiddleware, customerController.updateCustomer);
router.post("/deleteCustomer", adminmiddleware, customerController.deleteCustomer);

router.get("/getAccounts", adminmiddleware, accountController.getAccounts);
router.post("/createAccount", adminmiddleware, accountController.createAccount);
router.post("/deleteAccount", adminmiddleware, accountController.deleteAccount);

router.get("/getPlans", adminmiddleware, planController.getPlans);
router.post("/createPlan", adminmiddleware, planController.createPlan);
router.post("/updatePlan", adminmiddleware, planController.updatePlan);
router.post("/deletePlan", adminmiddleware, planController.deletePlan);

module.exports = router;