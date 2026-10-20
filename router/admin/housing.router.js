const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/housing.controller");
const multer = require("multer");
const storageHelper = require("../../helper/storage.helper");
const upload = multer({ storage: storageHelper.storageHelper() });
const uploadCloud = require("../../middleware/uploadCloud.middlaware");
const removeUpload = require("../../middleware/removeUpload.middleware");
const housingValidation = require("../../validation/housing.validation");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("NT_ANH"),
  housingValidation.housing,
  uploadCloud.housing,
  removeUpload.removeImage,
  controller.createPost,
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.delete);
router.get("/detail/:id", controller.detail);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("NT_ANH"),
  housingValidation.housing,
  uploadCloud.housing,
  removeUpload.removeImage,
  controller.edtiPatch,
);
router.get("/export-file", controller.exportFile);

module.exports = router;
