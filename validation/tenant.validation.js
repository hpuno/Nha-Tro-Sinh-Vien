module.exports.tenant = (req, res, next) => {
  if (
    !req.body.KT_EMAIL ||
    !req.body.KT_TRANGTHAI ||
    !req.body.KT_MATKHAU ||
    !req.body.KT_Re_MATKHAU ||
    !req.body.KT_TEN ||
    !req.body.KT_SDT
  ) {
    req.flash("error", "Thông tin không hợp lệ");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};
