const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const { Company } = require("../models");
const jwt = require("jsonwebtoken");
const secretKey = "tradeSecretKey";

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ email: email });
    if (company) {
      const result = await bcrypt.compare(password, company.password);
      if (result) {
        const payload = { _id: company._id, password: company.password };
        const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
        await Company.findByIdAndUpdate(company._id, { token });
        return res.status(200).json({ state: true, token: token });
      } else {
        return res
          .status(404)
          .json({ state: false, message: "Invalid Company" });
      }
    } else {
      return res.status(404).json({ state: false, message: "Invalid Company" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      state: false,
      message: "An error occurred during authentication.",
    });
  }
};



// Register controller
exports.register = async (req, res) => {
  const { displayName, email, password, companyEmail, plan } = req.body;
  try {
    // Check if the company already exists
    const existingCompany = await Company.findOne({ email: email });
    if (existingCompany) {
      return res.status(400).json({ state: false, message: "Company already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new company
    const newCompany = new Company({
      displayName,
      email,
      password: hashedPassword,
      companyEmail,
      plan
    });

    // Save the company to the database
    await newCompany.save();

    // Generate a token
    const payload = { _id: newCompany._id, email: newCompany.email };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    // Send a response with the token
    res.status(201).json({ state: true, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ state: false, message: "Registration Failed" });
  }
};