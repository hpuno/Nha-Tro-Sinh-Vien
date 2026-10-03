const keycoak = require("../../server/keycoak.server");
const KHACH_THUE = require("../../models/KHACH_THUE.model");

module.exports.info = async (req, res) => {
  res.render("client/page/user/info", { pageTitle: "Thông tin cá nhân" });
};

module.exports.edit = async (req, res) => {
  res.render("client/page/user/edit", { pageTitle: "Chỉnh sửa thông tin" });
};

module.exports.editPatch = async (req, res) => {
  try {
    const data = req.body;
    const KT_ID = parseInt(req.params.id);

    const email = await KHACH_THUE.findDuplicationUpdate(
      "KT_EMAIL",
      data.KT_EMAIL,
      KT_ID,
    );
    if (email.length != 0) {
      req.flash("error", "Thông bị bị trùng");
      res.redirect(req.get("Referer"));
      return;
    }

    if (data.KT_SDT) {
      const sdt = await KHACH_THUE.findDuplicationUpdate(
        "KT_SDT",
        data.KT_SDT,
        KT_ID,
      );
      if (sdt.length != 0) {
        req.flash("error", "Thông bị bị trùng");
        res.redirect(req.get("Referer"));
        return;
      }
    }

    if (data.KT_CCCD) {
      const cccd = await KHACH_THUE.findDuplicationUpdate(
        "KT_CCCD",
        data.KT_CCCD,
        KT_ID,
      );
      if (cccd.length != 0) {
        req.flash("error", "Thông bị bị trùng");
        res.redirect(req.get("Referer"));
        return;
      }
    }

    if (!req.body.KT_ANH) {
      req.body.KT_ANH = res.locals.khach_thue.KT_ANH;
    }

    await KHACH_THUE.UPDATE(KT_ID, data);
    req.flash("success", "Cập nhật thành công");
    res.redirect("/user/info");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại");
    res.redirect(req.get("Referer"));
  }
};

module.exports.resetPassword = async (req, res) => {
  res.render("client/page/user/resetPassword", { pageTitle: "Đổi mật khẩu" });
};

module.exports.resetPasswordPut = async (req, res) => {
  try {
    const { KT_NewPassword, KT_ReNewPassword } = req.body;

    if (KT_NewPassword != KT_ReNewPassword) {
      req.flash("error", "Mật khẩu không khớp");
      res.redirect(req.get("Referer"));
      return;
    }

    const id_user = res.locals.khach_thue.KT_KEYCOAK;
    console.log(id_user);
    await keycoak.resetPassword(id_user, KT_NewPassword);
    req.flash("success", "Đổi mật khẩu thành công");
    res.redirect("/user/info");
  } catch (error) {
    console.log(error);
    req.flash("error", "Đổi mật khẩu thất bại");
    res.redirect("/user/info");
  }
};
