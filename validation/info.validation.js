module.exports.infoValidation = (req, res, next) => {
  if (!req.body.KT_EMAIL) {
    req.flash("error", "Thông tin không hợp lệ");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};
