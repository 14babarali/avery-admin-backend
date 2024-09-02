const express = require('express');
const router = express.Router();
const apiController = require("../control/apiController");
const { thirdPartymiddleware } = require('../middleware/thirdPartymiddleware');
const userRouter = require("./userRouter")

const app = express();

router.use("/users", userRouter )

router.post("/updateAccount", thirdPartymiddleware, apiController.updateAccount);
router.post("/getData", apiController.getMT4Account)


module.exports = router;