const KHACH_THUE = require("../../models/KHACH_THUE.model");
const keycoack = require("../../server/keycoak.server");
const dayjs = require("dayjs");

module.exports.signup = (req, res) => {
  res.render("client/page/auth/signup", { pageTitle: "Trang đăng ký" });
};

module.exports.signupPost = async (req, res) => {
  try {
    const { KT_TEN, KT_EMAIL, KT_MATKHAU, KT_ReMATKHAU } = req.body;

    const email = await KHACH_THUE.findDuplication("KT_EMAIL", KT_EMAIL);
    if (email.length > 0) {
      req.flash("error", "Thông tin không hợp lệ");
      res.redirect(req.get("Referer"));
      return;
    }

    if (KT_MATKHAU != KT_ReMATKHAU) {
      req.flash("error", "Thông tin không hợp lệ");
      res.redirect(req.get("Referer"));
      return;
    }

    req.body.KT_KEYCOAK = await keycoack.createUser({
      name: KT_TEN,
      email: KT_EMAIL,
      password: KT_MATKHAU,
    });

    req.body.KT_NGAYTAO = dayjs().format("YYYY/MM/DD");

    await KHACH_THUE.INSERT(req.body);

    const token = await keycoack.login(KT_EMAIL, KT_MATKHAU);
    req.session.accesstoken = token.access_token;
    req.session.refreshtoken = token.refresh_token;
    req.session.expiresAt = Date.now() + token.expires_in * 1000;

    req.flash("success", "Đăng ký thành công");
    res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("Lỗi tạo tài khoản");
    res.redirect(req.get("Referer"));
  }
};

module.exports.signin = async (req, res) => {
  res.render("client/page/auth/signin", { pageTitle: "Trang đăng nhập" });
};

module.exports.signinPost = async (req, res) => {
  try {
    const { KT_EMAIL, KT_MATKHAU } = req.body;
    const token = await keycoack.login(KT_EMAIL, KT_MATKHAU);
    req.session.accesstoken = token.access_token;
    req.session.refreshtoken = token.refresh_token;
    req.session.expiresAt = Date.now() + token.expires_in * 1000;

    req.flash("success", "Đăng nhập thành công");
    res.redirect("/");
  } catch (error) {
    req.flash("error", "Đăng nhập thất bại");
    res.redirect(req.get("Referer"));
  }
};

module.exports.logout = async (req, res) => {
  try {
    await keycoack.logout(req.session.refreshtoken);
    req.session.destroy((err) => {
      if (err) {
        res.redirect("/");
      }
      res.clearCookie("connect.sid");

      res.redirect("/");
    });
  } catch (error) {
    req.flash("error", "Đăng xuất thất bại");
  }
};
