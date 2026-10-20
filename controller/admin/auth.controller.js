const NHAN_VIEN = require("../../models/NHAN_VIEN.model");
const keycloak = require("../../server/keycloak.server");

module.exports.signin = async (req, res) => {
  res.render("admin/page/auth/signin", { pageTitle: "Đăng nhập " });
};

module.exports.signinPost = async (req, res) => {
  try {
    const { NV_EMAIL, NV_MATKHAU } = req.body;

    const [isactive] = await NHAN_VIEN.SELECT_NV("NV_EMAIL", NV_EMAIL);

    if (!isactive) {
      req.flash("error", "Tài khoản không tồn tại");
      res.redirect("/");
      return;
    }

    const token = await keycloak.login(NV_EMAIL, NV_MATKHAU);
    req.session.accesstoken = token.access_token;
    req.session.refreshtoken = token.refresh_token;
    req.session.expiresAt = Date.now() + token.expires_in * 1000;

    req.flash("success", "Đăng nhập thành công");
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error);
    req.flash("error", "Đăng nhập thất bại");
    res.redirect("/admin/auth/signin");
  }
};

module.exports.logout = async (req, res) => {
  try {
    await keycloak.logout(req.session.refreshtoken);
    req.session.destroy((err) => {
      if (err) {
        res.redirect("/");
      }
      res.clearCookie("connect.sid");

      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Đăng xuất thất bại");
    res.redirect("/");
  }
};
