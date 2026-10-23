const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/room.controller");
const multer = require("multer");
const storageHelper = require("../../helper/storage.helper");
const upload = multer({ storage: storageHelper.storageHelper() });
const uploadCloud = require("../../middleware/uploadCloud.middlaware");
const removeCloud = require("../../middleware/removeUpload.middleware");
const validation = require("../../validation/room.validation");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("P_ANH"),
  validation.room,
  uploadCloud.room,
  removeCloud.removeImage,
  controller.createPost,
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.delete);
router.get("/detail/:id", controller.detail);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("P_ANH"),
  validation.room,
  uploadCloud.room,
  removeCloud.removeImage,
  controller.editPatch,
);
router.get("/export-file", controller.exportFile);
module.exports = router;
