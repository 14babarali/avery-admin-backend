const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const AccountSchema = new Schema(
  {
    kyc: {
      type: mongoose.Schema.Types.ObjectId,  //Added to reference kyc schema
      ref: "KYC",
      default: null,
    },
    displayName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0.0,
    },
    currentEquity: {
      type: Number,
      required: true,
      default: 0.0,
    },
    currentDrawdown: {
      type: Number,
      required: true,
      default: 0.0,
    },
    leverage: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Phase1", "Phase2", "Live"],
      required: true,
    },
    dailyDrawdown: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalDrawdown: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalTarget: {
      type: Number,
      required: true,
      default: 0.0,
    },
    profitShare: {
      type: Number,
      required: true,
      default: 0.0,
    },
    allow: {
      type: Boolean,
      required: true,
      default: true,
    },
    blockReason: {
      type: String,
      default: null,
    },
    breached: {
      type: Boolean,
      required: true,
      default: false,
    },
    breachedReason: {
      type: String,
      enum: ["DailyDrawdown", "TotalDrawdown", "TotalGoal", "None"],
      required: true,
      default: "None",
    },
    tradeSystem: {
      type: String,
      enum: ["MT4", "LaserTrade"],
      required: true,
    },
    dayStartEquity: {
      type: Number,
      required: true,
      default: 0.0,
    },
    phaseInitialBalance: {
      type: Number,
      required: true,
      default: 0.0,
    },
    accountUser: {
      type: String,
      required: true,
    },
    accountPassword: {
      type: String,
      required: true,
    },
    kycStatus: {
      type: String,
      enum: ["Not Submitted", "Pending", "Approved", "Denied"],
      default: "Not Submitted",
      required: true,
  },
  },
  {
    collection: "accounts",
    timestamps: true,
  }
);

// Method to clear all records (equivalent to migrate function in Sequelize)
AccountSchema.statics.migrate = async function () {
  await this.deleteMany({});
};

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
