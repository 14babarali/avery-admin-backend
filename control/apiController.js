const bcrypt = require("bcrypt");
const axios = require("axios");
const { tradeAPI } = require("../config/main");

const { Account, Company, Plan, Customer } = require("../models");
const logger = require("../utils/logger");

exports.updateAccount = async (req, res) => {
  try {
    const { displayName, balance } = req.body;
    const account = await Account.findOne({ displayName });
    await Account.updateOne({ balance: balance }, { displayName });

    ///////////////////////**************Start Check Account With Plan****************///////////////////////////////
    if (
      (account.dayStartEquity - balance) / account.phaseInitialBalance >
      account.dailyDrawdown
    ) {
      await axios.post(`${tradeAPI}/blockUser`, { email: account.displayName });
      await Account.updateOne(
        { displayName: accountNumber },
        { breached: true, breachedReason: "DailyDrawdown" }
      );
    }
    if (
      (account.phaseInitialBalance - accountEquity) /
        account.phaseInitialBalance >
      account.totalDrawdown
    ) {
      await axios.post(`${tradeAPI}/blockUser`, { email: account.displayName });
      await Account.updateOne(
        { displayName: accountNumber },
        { breached: true, breachedReason: "TotalDrawdown" }
      );
    }
    if (
      (accountEquity - account.phaseInitialBalance) /
        account.phaseInitialBalance >
      account.totalTarget
    ) {
      await axios.post(`${tradeAPI}/blockUser`, { email: account.displayName });
      await Account.updateOne(
        { displayName: accountNumber },
        { breached: true, breachedReason: "TotalGoal" }
      );
    }
    ///////////////////////***************End Check Account With Plan*****************///////////////////////////////
    return res.status(200).json({ account });
  } catch (error) {
    logger("error", "APIController | updateAccount | ", error.message);
    return res.status(500).json({
      status: false,
      message: `Update Account Failed : ${error.message}`,
    });
  }
};

exports.getMT4Account = async (req, res) => {
  try {
    const {
      mail,
      accountNumber,
      accountBalance,
      accountEquity,
      drawdown,
      chartStartDate,
    } = req.body;

    if (
      !mail ||
      !accountNumber ||
      !accountBalance ||
      !accountEquity ||
      !drawdown ||
      !chartStartDate
    ) {
      return res.status(400).send("Missing required fields");
    }
    const customer = await Customer.findOne({ email: mail });
    const account = await Account.findOne({
      // displayName: String(accountNumber),
      customerEmail: mail,
    });
    console.log(customer,account)
    if (!customer) return res.status(500).send("Invalid customer");
    if (!account) return res.status(500).send("Invalid account");

    if (account.maxDailyLossType == "trailingDrawdown") {
      if (accountBalance > account.balance) {
        account.dayStartEquity = accountBalance;
        await Account.update(
          { dayStartEquity: accountBalance },
          { displayName: accountNumber }
        );
      }
    }
    const currentDrawdown =
      account.dayStartEquity - accountEquity > 0
        ? ((account.dayStartEquity - accountEquity) /
            account.phaseInitialBalance) *
          100
        : 0;


        account.balance=accountBalance;
        account.currentEquity=accountEquity;
        account.currentDrawdown=currentDrawdown
    // await Account.update(
    //   {
    //     balance: accountBalance,
    //     currentEquity: accountEquity,
    //     currentDrawdown: currentDrawdown,
    //   },
    //   { displayName: accountNumber }
    // );

    ///////////////////////**************Start Check Account With Plan****************///////////////////////////////
    if (currentDrawdown > account.dailyDrawdown) {
      account.breached=true;
      account.breachedReason="DailyDrawdown";
      // account.save()
      // await Account.update(
      //   { breached: true, breachedReason: "DailyDrawdown" },
      //   { displayName: accountNumber }
      // );
    }
    if (
      ((account.phaseInitialBalance - accountEquity) /
        account.phaseInitialBalance) *
        100 >
      account.totalDrawdown
    ) {
      account.breached=true;
      account.breachedReason="TotalDrawdown"
      // await Account.update(
      //   { breached: true, breachedReason: "TotalDrawdown" },
      //   { displayName: accountNumber }
      // );
    }
    if (
      ((accountEquity - account.phaseInitialBalance) /
        account.phaseInitialBalance) *
        100 >
      account.totalTarget
    ) {
      account.breached=true;
      account.breachedReason="TotalGoal"
      // await Account.update(
      //   { breached: true, breachedReason: "TotalGoal" },
      //   { displayName: accountNumber }
      // );
    }
    account.save()

    ///////////////////////***************End Check Account With Plan*****************///////////////////////////////
    return res.status(200).json("Datasend Successfully!");
  } catch (error) {
    logger("error", "API Controller", `getMt4Account | ${error.message}`);
    return res
      .status(500)
      .send(`GetMt4Account Failed with Error | ${error.message}`);
  }
};
