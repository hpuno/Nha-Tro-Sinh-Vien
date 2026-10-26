module.exports.rental = (req, res, next) => {
  if (
    !req.body.KT_TEN ||
    !req.body.KT_SDT ||
    !req.body.KT_CCCD ||
    !req.body.TP_NGAYTHUE ||
    !req.body.TP_NGAY_KETTHUC
  ) {
    req.flash("error", "Thông tin không hợp lệ");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};
