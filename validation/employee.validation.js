module.exports.employee = (req, res, next) => {
  if (
    !req.body.NV_EMAIL ||
    !req.body.NV_TRANGTHAI ||
    !req.body.NV_MATKHAU ||
    !req.body.NV_ReMATKHAU ||
    !req.body.NV_TEN ||
    !req.body.NV_SDT
  ) {
    req.flash("error", "Thông tin không hợp lệ");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};
