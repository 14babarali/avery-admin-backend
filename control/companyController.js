const bcrypt = require("bcrypt");
const axios = require("axios");
const { tradeAPI } = require("../config/main");

const { Account, Company, Plan, Customer } = require("../models");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const { secretKey } = require("../config/key");

exports.createCompany = async (req, res) => {
  try {
    if (req.role != "Admin")
      return res.status(404).json({ message: "Unauthrized User" });

    const { name, email, password, role } = req.body;

    const exitCompany = await Company.findOne({ email });
    if (exitCompany)
      return res.status(409).json({ message: "Duplicated User" });
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await axios.post(`${tradeAPI}/createCompany`, { email, password, role });
    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      token: jwt.sign({ hashedPassword, type: "Demo" }, secretKey),
    });
    const companies = await Company.findAll();
    return res.status(200).json({ company: companies });
  } catch (error) {
    logger("error", "CompanyController", `Create Company | ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
