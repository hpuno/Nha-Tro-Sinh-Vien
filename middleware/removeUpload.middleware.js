const fs = require("fs");

module.exports.removeImage = (req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.log(err);
    });
  }
  next();
};
