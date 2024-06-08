const express = require("express");
const authRouter = express.Router();

const urlEncodedParser = express.urlencoded({extended: false});

const authController = require("../controllers/authController.js");

authRouter.post("/sendCode", urlEncodedParser, authController.sendVerificationCode);
authRouter.post("/checkCode", urlEncodedParser, authController.checkCode);

authRouter.post("/family/invite/send", authController.sendInvataionToFamily);
authRouter.get("/family/invite/accept", authController.addToFamily);

module.exports = authRouter;