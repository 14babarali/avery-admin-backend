const { Company, Customer } = require("../models");

exports.usermiddleware = async (req, res, next) => {
  const token = req.headers.authorization || "";
  if (token == "") {
    res.status(401).json({ state: "No Token! Please Login Again!" });
    return;
  }
  const user = await Customer.findOne({ token });
  if (!user) {
    res.status(401).json({ state: "No Vailed Token! Please Login Again!" });
    return;
  }
  req.userID = user.id;
  next();
};
