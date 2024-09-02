const bcrypt = require("bcrypt");
const axios = require("axios");
const { tradeAPI } = require("../config/main");

const { Account, Company, Plan, Customer } = require("../models");
const logger = require("../utils/logger");

exports.createPlan = async (req, res) => {
  try {
    const { planName, planPrice, phases } = req.body;
    const exitPlan = await Plan.findOne({ name: planName });
    if (exitPlan) {
      return res.status(409).json({ message: "Duplicated plan name" });
    }
    if (!planName || !planPrice)
      return res
        .status(500)
        .json({ message: "Invalid value planName && planPrice" });
    for (const phase of phases) {
      const {
        phaseName,
        fundedPhase,
        initialBalance,
        initialLeverage,
        tradingPeriod,
        minTradingDays,
        maxDailyLoss,
        maxDailyLossType,
        maxLoss,
        profitTarget,
        profitSplitBroker,
      } = phase;
      if (
        !phaseName ||
        !initialBalance ||
        !initialLeverage ||
        !maxDailyLoss ||
        !maxDailyLossType ||
        !maxLoss ||
        !profitTarget ||
        !profitSplitBroker
      ) {
        return res.status(500).json({ message: "Invalid value" });
      }
    }
    const data_phases = JSON.stringify(phases);
    const plan = await Plan.create({
      name: planName,
      price: planPrice,
      phases: data_phases,
    });
    return res.status(200).send({ message: "Created successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error occured when create plan" });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const planAll = await Plan.find();
    const plans = planAll.map((plan) => {
      return {
        planID: plan.id,
        planName: plan.name,
        planPrice: plan.price,
        phases: JSON.parse(plan.phases),
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
      };
    });
    return res.status(200).json({ plans });
  } catch (error) {
    logger("error", "PlanController", `Get Plans | ${error.message}`);
    res.status(500).json({ message: `Get Plans Failed | ${error.message}` });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { planID, planName, planPrice, phases } = req.body;
    const plan = await Plan.findOne({ id: planID });
    if (!plan) {
      return res.send(404).send({ message: "Cannot find plan" });
    }
    await Plan.update(
      { id: planID },
      { name: planName, price: planPrice, phases: JSON.stringify(phases) }
    );
    return res.status(200).json({ message: "update plan successfully" });
  } catch (error) {
    logger("error", "PlanController", `Upgrade Plan | ${error.message}`);
    return res
      .status(200)
      .send({ message: "An error occured when update plan" });
  }
};

exports.deletePlan = async (req, res) => {
  const { planID } = req.body;
  try {
    const plan = await Plan.findOne({ id: planID });
    if (!plan) {
      return res.status(404).send({ message: "Cannot find the Plan" });
    }
    await Plan.destroy({ id: planID });
    return res.status(200).send({ message: "Successfully deleted" });
  } catch (error) {
    logger("error", "PlanController", `Delete Plan | ${error.message}`);
    return res
      .status(500)
      .send({ message: "An error occurred while deleting the Plan." });
  }
};
