module.exports.room = (req, res, next) => {
  if (
    !req.body.P_TEN ||
    !req.body.P_SL ||
    !req.body.P_GIA ||
    !req.body.NT_ID ||
    !req.body.P_DIENTICH ||
    !req.body.P_TRANGTHAI
  ) {
    req.flash("error", "Thông tin không hợp lệ");
    res.redirect(req.get("Referer"));
    return;
  }
  next();
};
