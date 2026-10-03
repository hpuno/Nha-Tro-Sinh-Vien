const { khach_thue } = require("../../middleware/uploadCloud.middlaware");
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

    await KHACH_THUE.UPDATE(KT_ID, data);
    req.flash("success", "Cập nhật thành công");
    res.redirect("/user/info");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại");
    res.redirect(req.get("Referer"));
  }
};
