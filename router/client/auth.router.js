const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/auth.controller");

router.get("/signup", controller.signup);
router.post("/signup", controller.signupPost);
module.exports = router;
