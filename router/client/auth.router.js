const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/auth.controller");
const validation = require("../../validation/auth.validation");

router.get("/signup", controller.signup);
router.get("/signin", controller.signin);
router.post("/signup", validation.signup, controller.otp);
router.post("/otp", controller.signupPost);
router.post("/signin", validation.signin, controller.signinPost);
router.get("/logout", controller.logout);

module.exports = router;
