module.exports.signup = (req, res) => {
  res.render("client/page/auth/signup", { pageTitle: "Trang đăng ký" });
};

module.exports.signupPost = (req, res) => {
  try {
    const { KT_EMAIL, KT_MATKHAU, KT_ReMATKHAU } = req.body;
    console.log(KT_EMAIL, KT_MATKHAU, KT_ReMATKHAU);
    if (KT_MATKHAU != KT_ReMATKHAU) {
      console.log("mat khau khong hop le");
      req.flash("error", "Thông tin không hợp lệ");
      res.redirect(req.get("Referer"));
      return;
    }
  } catch (error) {}
};
