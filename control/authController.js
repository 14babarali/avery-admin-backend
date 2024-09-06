const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const { Company } = require("../models");
const jwt = require("jsonwebtoken");
const secretKey = "tradeSecretKey";

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email: email });
    if (customer) {
      const result = await bcrypt.compare(password, customer.password);
      if (result) {
        // Generate a token
        const token = jwt.sign({ _id: customer._id }, secretKey, { expiresIn: "1h" });
        // Return the token and a success message
        return res.status(200).json({ state: true, token: token });
      } else {
        return res.status(404).json({ state: false, message: "Invalid Customer" });
      }
    } else {
      return res.status(404).json({ state: false, message: "Invalid Customer" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ state: false, message: "An error occurred during authentication." });
  }
};

exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new company (user)
    const company = await Company.create({ email, username, password: hashedPassword });
    // Generate a token
    const token = jwt.sign({ _id: company._id }, secretKey, { expiresIn: "1h" });
    // Return the token and a success message
    return res.status(201).json({ state: true, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ state: false, message: "An error occurred during registration." });
  }
};
