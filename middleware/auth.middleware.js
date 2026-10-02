const keycoack = require("../server/keycoak.server");
const KHACH_THUE = require("../models/KHACH_THUE.model");

module.exports.authClient = async (req, res, next) => {
  const access_token = req.session.accesstoken;
  if (access_token) {
    const token = await keycoack.statusToken(access_token);

    if (token.active) {
      const keycoak_id = token.sub;
      const khach_thue = await KHACH_THUE.SELECT_KT("KT_KEYCOAK", keycoak_id);

      res.locals.khach_thue = khach_thue[0];
    }
  }

  next();
};

module.exports.authClientPrivate = async (req, res, next) => {
  try {
    const access_token = req.session.accesstoken;

    if (!access_token) {
      req.flash("error", "Đăng nhập để tiếp tục");
      return res.redirect("/auth/signin");
    }

    let token = await keycoack.statusToken(access_token);

    if (!token || !token.active) {
      const refresh_token = req.session.refreshtoken;

      if (!refresh_token) {
        req.flash("error", "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        return res.redirect("/auth/signin");
      }

      try {
        const token_new = await keycoack.refreshToken(refresh_token);

        req.session.accesstoken = token_new.access_token;
        req.session.refreshtoken = token_new.refresh_token;
        req.session.expiresAt = Date.now() + token_new.expires_in * 1000;

        token = await keycoack.statusToken(req.session.accesstoken);

        if (!token || !token.active) {
          req.flash("error", "Phiên đăng nhập không hợp lệ");
          return res.redirect("/auth/signin");
        }
      } catch (refreshError) {
        req.flash("error", "Phiên làm việc hết hạn, vui lòng đăng nhập lại");
        return res.redirect("/auth/signin");
      }
    }

    const keycoak_id = token.sub;
    const khach_thue = await KHACH_THUE.SELECT_KT("KT_KEYCOAK", keycoak_id);

    res.locals.khach_thue = khach_thue[0];

    return next();
  } catch (globalError) {
    console.error("Lỗi Middleware authClient:", globalError);
    req.flash("error", "Có lỗi hệ thống xảy ra, vui lòng thử lại!");
    return res.redirect("/auth/signin");
  }
};
