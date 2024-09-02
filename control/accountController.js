const bcrypt = require("bcrypt");
const axios = require("axios");
const { tradeAPI } = require("../config/main");
const { Account, Company, Plan, Customer } = require("../models");
const logger = require("../utils/logger");

exports.createAccount = async (req, res) => {
  try {
    const token = req.headers.authorization || "";
    const company = await Company.findOne({ token });
    if (!company) {
      return res.status(401).json({
        status: false,
        message: "Invalid authorization token.",
      });
    }
    const { customerEmail, planName, tradeSystem } = req.body;
    const customer = await Customer.findOne({ email: customerEmail });
    if (!customer) {
      return res.status(404).json({
        status: false,
        message: "Customer not found.",
      });
    }

    const plan = await Plan.findOne({ name: planName });
    if (!plan) {
      return res.status(404).json({
        status: false,
        message: "Plan not found.",
      });
    }
    if (!(tradeSystem == "LaserTrade" || tradeSystem == "MT4")) {
      return res.status(404).json({
        status: false,
        message: `TradeSystem not found`,
      });
    }
    const displayName =
      tradeSystem == "LaserTrade" ? new Date().getTime() : req.body.displayName;
    const accountUser =
      tradeSystem == "LaserTrade" ? customer.nickName : req.body.accountUser;
    const accountPassword =
      tradeSystem == "LaserTrade"
        ? customer.password
        : req.body.accountPassword;
    const phase1 = JSON.parse(plan.phases)[0];
    if (tradeSystem == "LaserTrade") {
      await axios.post(`${tradeAPI}/createUser`, {
        name: customer.nickName,
        email: displayName,
        balance: plan.initialBalance,
        companyEmail: customer.companyEmail,
        type: "Phase1",
        password: customer.password,
        leverage: plan.leverage,
      });
    }

    const account = await Account.create({
      displayName: displayName,
      customerEmail,
      companyEmail: customer.companyEmail,
      plan: planName,
      balance: phase1.initialBalance,
      currentEquity: phase1.initialBalance,
      currentDrawdown: 0,
      leverage: phase1.initialLeverage,
      type: "Phase1",
      dailyDrawdown: phase1.maxDailyLoss,
      totalDrawdown: phase1.maxLoss,
      totalTarget: phase1.profitTarget,
      profitShare: phase1.profitSplitBroker,
      drawDownType: phase1.maxDailyLossType,
      allow: true,
      breached: false,
      tradeSystem,
      dayStartEquity: phase1.initialBalance,
      phaseInitialBalance: phase1.initialBalance,
      accountUser,
      accountPassword,
    });

    const accounts =
      company.role === "Admin"
        ? await Account.find()
        : await Account.find({ companyEmail: company.email });

    return res.status(200).json({
      status: true,
      accounts: accounts,
    });
  } catch (error) {
    logger("error", "AccountController | CreateAccount | ", error.message);
    return res.status(500).json({
      status: false,
      message: `Create Account Failed : ${error.message}`,
    });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const token = req.headers.authorization || "";
    const company = await Company.findOne({ token });
    if (company.role == "Admin") {
      const accounts = await Account.find();
      return res.status(200).json({ accounts });
    } else {
      const accounts = await Account.find({
        companyEmail: company.email,
      });
      return res.status(200).json({ accounts });
    }
  } catch (error) {
    logger("error", "AccountController", `Get Accounts | ${error.message}`);
    res.status(500).json({ message: `Get Accounts Failed | ${error.message}` });
  }
};

exports.resetDailyDrawdown = async (req, res) => {
  try {
    const { displayName } = req.body;
    const account = await Account.findOne({ displayName: displayName });
    await Account.update({
      breachedReason: "none",
      breached: false,
      dayStartEquity: account.balance,
    });
    res.status(200).json({ message: "Reset DailyDrawdown Successfully" });
  } catch (error) {
    logger(
      "error",
      "AccountController",
      `Reset DailyDrawdown | ${error.message}`
    );
    res
      .status(500)
      .json({ message: `Reset DailyDrawdown Failed | ${error.message}` });
  }
};

exports.upgradeAccount = async (req, res) => {
  try {
    const { displayName } = req.body;
    const account = await Account.findOne({
      displayName: displayName,
    });
    if (account.breachedReason == "TotalGoal") {
      const plan = await Plan.findOne({ name: account.plan });
      if (account.type == "Phase1") {
        const phase2 = JSON.parse(plan.phases)[1];
        if (!phase2)
          return res
            .status(500)
            .json("You are already Pass all Phases of this plan");
        await Account.update({
          balance: phase2.initialBalance,
          currentEquity: phase2.initialBalance,
          currentDrawdown: 0,
          leverage: phase2.initialLeverage,
          type: "Phase2",
          dailyDrawdown: phase2.maxDailyLoss,
          totalDrawdown: phase2.maxLoss,
          totalTarget: phase2.profitTarget,
          profitShare: phase2.profitSplitBroker,
          allow: true,
          breached: false,
          dayStartEquity: phase2.initialBalance,
          phaseInitialBalance: phase2.initialBalance,
        });
      }
    }
  } catch (error) {
    logger("error", "AccountController", `Upgrade Account | ${error.message}`);
  }
};

exports.deleteAccount = async (req, res) => {
  const { accountId } = req.body;
  try {
    const account = await Account.findOne({ id: accountId });
    if (!account) {
      return res.status(404).send({ message: "Cannot find the Account" });
    }
    await Account.destroy({ id: accountId });
    return res.status(200).send({ message: "Successfully deleted" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error occurred while deleting the customer." });
  }
};
