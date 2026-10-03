const cloudinary = require("cloudinary").v2;

module.exports.khach_thue = async (req, res, next) => {
  if (req.file) {
    const img = req.file.path;
    const result = await cloudinary.uploader.upload(img);
    req.body.KT_ANH = result.url;
  }
  next();
};
