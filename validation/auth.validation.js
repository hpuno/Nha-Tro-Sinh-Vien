module.exports.signup = (req, res, next) => {
  if (
    !req.body.KT_TEN ||
    !req.body.KT_EMAIL ||
    !req.body.KT_MATKHAU ||
    !req.body.KT_ReMATKHAU
  ) {
    req.flash("error", "Vui lòng nhập đầy đủ thông tin");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};

module.exports.signin = (req, res, next) => {
  if (!req.body.KT_EMAIL || !req.body.KT_MATKHAU) {
    req.flash("error", "Vui lòng nhập đầy đủ thông tin");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};
