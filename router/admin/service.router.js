const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/service.controller");
const validation = require("../../validation/service.validation");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", validation.service, controller.createPost);
router.delete("/delete/:id", controller.delete);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete(
  "/delete/use-serivce/:idRoom/:idService/:mouth_year",
  controller.deleteUseService,
);
router.get("/create-use-service", controller.createUseService);
router.post("/create-use-service", controller.createUseServicePost);
module.exports = router;
