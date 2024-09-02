const { Company } = require("../models");

exports.adminmiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token.length) {
      console.log("no token");
      res.status(401).json({ state: "No Token! Please Login Again!" });
      return;
    }
    const company = await Company.findOne({ token });
    if (!company) {
      console.log("no company");
      res.status(401).json({ state: "No Vailed Token! Please Login Again!" });
      return;
    }
    req.role = company.role;
    next();
  } catch (error) {
    console.log(error);
  }
};
