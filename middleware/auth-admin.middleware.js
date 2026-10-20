const NHAN_VIEN = require("../models/NHAN_VIEN.model");
const PHAN_CONG = require("../models/PHAN_CONG.model");
const keycloak = require("../server/keycloak.server");

module.exports.authAdminPrivate = async (req, res, next) => {
  try {
    const access_token = req.session.accesstoken;

    if (!access_token) {
      req.flash("error", "Đăng nhập để tiếp tục");
      return res.redirect("/admin/auth/signin");
    }

    let token = await keycloak.statusToken(access_token);

    if (!token || !token.active) {
      const userRoles = token.realm_access.roles || [];

      if (!userRoles.includes("ADMIN")) {
        req.flash("error", "Bạn không có quyền truy cập");
        return res.redirect("/");
      }

      const refresh_token = req.session.refreshtoken;

      if (!refresh_token) {
        req.flash("error", "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        return res.redirect("/auth/signin");
      }

      try {
        const token_new = await keycloak.refreshToken(refresh_token);

        req.session.accesstoken = token_new.access_token;
        req.session.refreshtoken = token_new.refresh_token;
        req.session.expiresAt = Date.now() + token_new.expires_in * 1000;

        token = await keycloak.statusToken(req.session.accesstoken);

        if (!token || !token.active) {
          req.flash("error", "Phiên đăng nhập không hợp lệ");
          return res.redirect("/auth/signin");
        }
      } catch (refreshError) {
        req.flash("error", "Phiên làm việc hết hạn, vui lòng đăng nhập lại");
        return res.redirect("/auth/signin");
      }
    }

    const keycloak_id = token.sub;
    const [nhan_vien] = await NHAN_VIEN.SELECT_NV("NV_keycloak", keycloak_id);
    const [phan_cong] = await PHAN_CONG.SELECT_ROLE(nhan_vien.NV_ID);

    res.locals.nhan_vien = nhan_vien;
    res.locals.phan_cong = phan_cong;

    return next();
  } catch (globalError) {
    console.error(globalError);
    req.flash("error", "Có lỗi hệ thống xảy ra, vui lòng thử lại!");
    return res.redirect("/admin/auth/signin");
  }
};
