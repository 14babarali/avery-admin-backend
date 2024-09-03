const { Account, Company, Plan, Customer, KYC } = require("../models");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "tradeSecretKey";




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Customer.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) return res.status(404).json({ message: "Invalid Password" });

    const payload = { id: user.id, password: user.password };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
    user.token=token;
    user.save()
    // await Customer.update({ id: user.id }, { token: token });
    return res.status(200).json({ token });
  } catch (error) {
    logger("error", "UserController", `Login | ${error.message}`);
    return res.status(500).json({ message: "Login Failed" });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const user = await Customer.findById(req.userID);
    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }
    const accounts = await Account.find({ customerEmail: user.email });
    return res.status(200).json({ accounts });
  } catch (error) {
    logger("error", "UserController", `GetAccounts | ${error.message}`);
    return res.status(500).json({ message: "GetAccounts Failed" });
  }
};

exports.getProfit = async (req, res) => {
  try {
    const user = await Customer.findById(req.userID);
    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }
    if (!req.body.displayName)
      return res.status(200).json({ profit: 0, initialbalance: 0 });

    const account = await Account.findOne({
      customerEmail: user.email,
      displayName: req.body.displayName,
    });
    if (!account) return res.status(200).json({ profit: 0, initialbalance: 0 });
    const plan = await Plan.findOne({ name: account.plan });
    const profit = account.phaseInitialBalance - account.balance;
    return res
      .status(200)
      .json({ profit, initialbalance: account.phaseInitialBalances });
  } catch (error) {
    logger("error", "UserController", `GetProfit | ${error.message}`);
    return res.status(500).json({ message: "GetProfit Failed" });
  }
};

//Add payout to user

exports.payout = async (req, res) => {
  try {
      const account = await Account.findOne({ accountUser: req.user._id });

      if (!account) {
          return res.status(404).json({ message: "Account not found" });
      }

      if (account.payoutRequested) {
          return res.status(400).json({ message: "Payout already requested" });
      }

      // Implement your business logic to check if rules allow payout

      account.payoutRequested = true;
      account.payoutRequestDate = new Date();
      await account.save();

      res.status(200).json({ message: "Payout request submitted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error requesting payout", error });
  }
};

//Added function for users to submit agreement

exports.submitAgreement = async (req, res) => {
  try {
      const customer = await Customer.findById(req.user._id);

      if (!customer) {
          return res.status(404).json({ message: "Customer not found" });
      }

      customer.agreementSigned = true;
      customer.agreementID = req.body.agreementID;
      customer.agreementIP = req.ip;
      customer.agreementTs = new Date();
      await customer.save();

      res.status(200).json({ message: "User agreement submitted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error submitting agreement", error });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const user = await Customer.findById(req.userID);
    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }
    const { oldPassword, newPassword } = req.body;
    const result = await bcrypt.compare(oldPassword, user.password);
    if (!result)
      return res.status(404).json({ message: "Incorrect Old Password" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateUser = await Customer.update(
      { id: user.id },
      { password: hashedPassword }
    );
    return res.status(200).json({ updateUser });
  } catch (error) {
    logger("error", "UserController", `UpdatePassword | ${error.message}`);
    return res.status(500).json({ message: "Update Password Failed" });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await Customer.findById(req.userID);
    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    logger("error", "UserController", `UpdatePassword | ${error.message}`);
    return res.status(500).json({ message: "Update Password Failed" });
  }
};




