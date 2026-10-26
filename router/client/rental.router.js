const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/rental.controller");
const rentalValidation = require("../../validation/rental.validation");

router.get("/:id", controller.index);
router.post("/:id", rentalValidation.rental, controller.rental);
module.exports = router;
