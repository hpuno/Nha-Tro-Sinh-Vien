const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/user.controller");
const multer = require("multer");
const storageHelper = require("../../helper/storage.helper");
const upload = multer({ storage: storageHelper.storageHelper() });
const uploadCloud = require("../../middleware/uploadCloud.middlaware");
const removeUpload = require("../../middleware/removeUpload.middleware");
const validation = require("../../validation/info.validation");

router.get("/info", controller.info);
router.get("/edit", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("KT_ANH"),
  validation.infoValidation,
  uploadCloud.khach_thue,
  removeUpload.removeImage,
  controller.editPatch,
);
router.get("/reset-password", controller.resetPassword);
router.put("/reset-password", controller.resetPasswordPut);
module.exports = router;
