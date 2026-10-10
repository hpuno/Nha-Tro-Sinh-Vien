const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/tenant.controller");
const multer = require("multer");
const storageHelper = require("../../helper/storage.helper");
const upload = multer({ storage: storageHelper.storageHelper() });
const uploadCloud = require("../../middleware/uploadCloud.middlaware");
const removeCloud = require("../../middleware/removeUpload.middleware");
const infoValidation = require("../../validation/info.validation");
const tenantValidation = require("../../validation/tenant.validation");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changStatus);
router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.delete);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("KT_ANH"),
  infoValidation.infoValidation,
  uploadCloud.khach_thue,
  removeCloud.removeImage,
  controller.editPatch,
);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("KT_ANH"),
  tenantValidation.tenant,
  uploadCloud.khach_thue,
  removeCloud.removeImage,
  controller.createPost,
);

router.get("/export-file", controller.exportFile);
module.exports = router;
