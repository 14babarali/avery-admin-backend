const { Customer, Company, KYC } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secretKey } = require("../config/key");
const logger = require("../utils/logger");
const { upload } = require('../config/cloudinary');


exports.createCustomer = async (req, res) => {
  try {
    const {
      email,
      active,
      firstName,
      middleName,
      lastName,
      nickName,
      birthday,
      language,
      phone,
      agreementID,
      agreementIP,
      agreementLegalName,
      agreementTs,
      country,
      state,
      city,
      zip,
      addressLine1,
      addressLine2,
      addressLine3,
      status,
    } = req.body;
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, secretKey);
    const originCompany = await Company.findOne({ id: decodedToken.id });
    const companyEmail = originCompany.email;
    let password;
    if (req.body.password) {
      password = req.body.password;
    } else {
      password = "123456";
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdAt = Date.now();
    const customer = await Customer.create({
      email: email,
      companyEmail: companyEmail,
      password: hashedPassword,
      active: active,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      nickName: nickName,
      birthday: birthday,
      accounts: 0,
      orders: 0,
      referrals: 0,
      language: language,
      phone: phone,
      exteranlID1: 0,
      exteranlID2: 0,
      agreementID: agreementID,
      agreementIP: agreementIP,
      agreementLegalName: agreementLegalName,
      agreementTs: agreementTs,
      country: country,
      state: state,
      city: city,
      zip: zip,
      addressLine1: addressLine1,
      status: status,
      addressLine2: addressLine2,
      addressLine3: addressLine3,
      createdAt: createdAt,
    });
    return res.status(200).send({ message: "created successfully" });
  } catch (error) {
    logger("error", "CustomerController", `CreateCustomer | ${error.message}`);
    return res.status(500).send({
      message: `An error occurred while creating user | ${error.message}`,
    });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const token = req.headers.authorization || "";
    const decodedToken = jwt.verify(token, secretKey);
    const originCompany = await Company.findOne({ id: decodedToken.id });
    let customers;
    if (originCompany.role == "Admin") {
      customers = await Customer.find();
    } else {
      customers = await Customer.find({ companyEmail: originCompany.email });
    }
    return res.status(200).send({ customers: customers });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error occurred while deleting the customer." });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const {
      email,
      password,
      active,
      firstName,
      middleName,
      lastName,
      nickName,
      birthday,
      accounts,
      orders,
      referrals,
      language,
      phone,
      agreementID,
      agreementIP,
      agreementLegalName,
      agreementTs,
      country,
      state,
      city,
      zip,
      addressLine1,
      addressLine2,
      addressLine3,
      customerId,
    } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const updatedAt = Date.now();
    await Customer.updateOne(
      { id: customerId },
      {
        email: email,
        password: hashedPassword,
        active: active,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        nickName: nickName,
        birthday: birthday,
        accounts: accounts,
        orders: orders,
        referrals: referrals,
        language: language,
        phone: phone,
        agreementID: agreementID,
        agreementIP: agreementIP,
        agreementLegalName: agreementLegalName,
        agreementTs: agreementTs,
        country: country,
        state: state,
        city: city,
        zip: zip,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        addressLine3: addressLine3,
        updatedAt: updatedAt,
      }
    );

    res.status(200).json({ messages: "Update Successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error occurred while deleting the customer." });
  }
};




// for get all sky submissions for admin
exports.getKYCSubmissions = async (req, res) => {
  try {
    const kycs = await KYC.find()
      .populate("customer", "firstName lastName email")
      .exec();

    res.status(200).json({ kycs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching KYC submissions", error });
  }
};



exports.deleteCustomer = async (req, res) => {
  const { customerId } = req.body;
  try {
    const user = await Customer.findOne({ id: customerId });
    if (!user) {
      return res.status(404).send({ message: "Cannot find the Customer" });
    }
    await Customer.destroy({ id: customerId });
    return res.status(200).send({ message: "Successfully deleted" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "An error occurred while deleting the customer." });
  }
};


//added to create kyc for customers 
exports.kyc = async (req, res) => {
  try {
    const { name, addressLine1, addressLine2, city, province, zipCode, country, phoneNumber } = req.body;

    // Check if all required files are uploaded
    if (!req.files || !req.files.frontId || !req.files.backId || !req.files.faceShot) {
      return res.status(400).send({ message: 'Please upload all required images.' });
    }

    // Upload images to Cloudinary
    const frontIdResult = await upload(req.files.frontId.tempFilePath, 'kyc/frontId');
    const backIdResult = await upload(req.files.backId.tempFilePath, 'kyc/backId');
    const faceShotResult = await upload(req.files.faceShot.tempFilePath, 'kyc/faceShot');

    // Save KYC data to MongoDB
    const newKYC = new KYC({
      name,
      addressLine1,
      addressLine2,
      city,
      province,
      zipCode,
      country,
      phoneNumber,
      frontId: frontIdResult.secure_url,
      backId: backIdResult.secure_url,
      faceShot: faceShotResult.secure_url,
    });

    await newKYC.save();

    res.status(200).send({ message: 'KYC data submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error. Please try again later.' });
  }
};

