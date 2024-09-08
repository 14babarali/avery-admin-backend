const mongoose = require("mongoose");
const config = require("../config/main");

mongoose
  .connect(config.database.uri)
  .then(() => {
    console.log(`Database connection successfully.`);
  })
  .catch((err) => {
    console.log(`Database connection failed: ${err}`);
  });

const db = {};

db.mongoose = mongoose;
db.Company = require("./company");
db.Customer = require("./customer");
db.Account = require("./account");
db.Plan = require("./plan");
db.KYC = require("./kyc");
db.Template = require("./template");
db.SmtpConfig = require("./smtpConfig");
db.Order = require("./order");

db.sync = async () => {
  // Migrate (clear collections and add initial data if necessary)
  // await db.Company.migrate();
  // await db.Customer.migrate();
  // await db.Account.migrate();
  // await db.Plan.migrate();
};

module.exports = db;
