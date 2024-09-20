const express = require('express');
const router = express.Router();
const customerController = require("../control/customerController")
const authControl = require("../control/authController");
const orderController = require("../control/orderController")
const accountController = require("../control/accountController");
const companyController = require("../control/companyController");
const planController = require("../control/planController");
const { adminmiddleware } = require('../middleware/adminmiddleware');
const emailController = require("../control/emailController");
const agreementController = require("../control/agreementController");

const app = express();

// Define a GET route for the root path
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the server' });
});

// Webhook endpoint to receive WooCommerce order updates
router.post('/webhooks/woocommerce', orderController.webhook );
  router.get('/orders', orderController.getOrders);
  router.patch('/:order_id/status', orderController.updateStatus);
  // Define the route for updating an order using email

// router.put('/:id/approve', orderController.approveOrder);

  



router.post("/login", authControl.login);





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


// SMTP Config routes
router.get("/smtp-config", emailController.getSmtpConfig);
router.put("/smtp-config", emailController.updateSmtpConfig);

// Email Template routes
router.get("/templates", emailController.getTemplates);
router.post("/template", emailController.upsertTemplate);
router.delete("/template/:id", emailController.deleteTemplate);

// POST request to create a new agreement
router.post('/agreement',  agreementController.createAgreement);

module.exports = router;