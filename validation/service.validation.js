module.exports.service = (req, res, next) => {
  if (
    !req.body.DV_TEN ||
    !req.body.DV_GIA ||
    !req.body.DV_DVT ||
    !req.body.DV_TRANGTHAI
  ) {
    console.log(req.body);
    req.flash("error", "Thông tin không hợp lệ");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};
