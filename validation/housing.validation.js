module.exports.housing = (req, res, next) => {
  if (!req.body.NT_TEN || req.body.NT_DIACHI.trim() == "    ") {
    req.flash("error", "Thông tin không hợp lệ");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};
