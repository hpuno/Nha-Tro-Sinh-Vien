const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/rental.controller");
const rentalValidation = require("../../validation/rental.validation");

router.get("/detail", controller.detail);
router.get("/detail/:id", controller.detailId);
router.get("/:id", controller.index);
router.post("/:id", rentalValidation.rental, controller.rental);
router.get("/service/:id", controller.service);
router.post("/service-signup/:id_room/:id_service", controller.serviceSignup);
module.exports = router;
