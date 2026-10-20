const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/employee.controller");
const multer = require("multer");
const storageHelper = require("../../helper/storage.helper");
const upload = multer({ storage: storageHelper.storageHelper() });
const validation = require("../../validation/employee.validation");
const uploadCloud = require("../../middleware/uploadCloud.middlaware");
const removeCloud = require("../../middleware/removeUpload.middleware");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("NV_ANH"),
  validation.employee,
  uploadCloud.employee,
  removeCloud.removeImage,
  controller.createPost,
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.delete);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", upload.single("NV_ANH"), controller.editPatch);
router.get("/export-file", controller.exportFile);
module.exports = router;
