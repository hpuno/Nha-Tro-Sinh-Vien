const KHACH_THUE = require("../../models/KHACH_THUE.model");
const keycoack = require("../../server/keycoak.server");
const dayjs = require("dayjs");
const sendMailHelper = require("../../helper/sendMail.helper");
const OTP = require("../../models/OTP.model");

module.exports.signup = (req, res) => {
  res.render("client/page/auth/signup", { pageTitle: "Trang đăng ký" });
};

module.exports.otp = async (req, res) => {
  try {
    const { KT_EMAIL, KT_MATKHAU, KT_ReMATKHAU } = req.body;
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
    const otp_old = await OTP.findOne({ email: req.body.KT_EMAIL });
    if (otp_old) {
      req.flash("error", "Vui lòng đợi 5 phút để tiếp tục");
      res.redirect("/");
      return;
    }
    const otp = new OTP({ email: req.body.KT_EMAIL });
    await otp.save();

    const html = `<p>Mã OTP của bạn là: <strong>${otp.code}</strong></p>`;
    sendMailHelper.sendMail(html, KT_EMAIL);

    res.render("client/page/auth/otp", {
      pageTitle: "Xác thực OTP",
      data: req.body,
    });
  } catch (error) {
    req.flash("Lỗi");
    res.redirect("/");
  }
};

module.exports.signupPost = async (req, res) => {
  try {
    const { KT_TEN, KT_EMAIL, KT_MATKHAU, KT_OTP } = req.body;

    const otp = await OTP.findOne({ email: KT_EMAIL });
    console.log(KT_OTP);
    if (KT_OTP != otp.code) {
      req.flash("error", "Mã OTP không hợp lệ");
      res.redirect("/auth/otp");
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
    res.redirect("/auth/signup");
  }
};

module.exports.signin = async (req, res) => {
  res.render("client/page/auth/signin", { pageTitle: "Trang đăng nhập" });
};

module.exports.signinPost = async (req, res) => {
  try {
    const { KT_EMAIL, KT_MATKHAU } = req.body;

    const isactive = await KHACH_THUE.SELECT_KT("KT_EMAIL", KT_EMAIL);

    if (isactive[0].KT_TRANGTHAI === "inactive") {
      req.flash("error", "Tài khoản đã bị khóa");
      res.redirect("/");
      return;
    }

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
    console.log(error);
    req.flash("error", "Đăng xuất thất bại");
    res.redirect("/");
  }
};
