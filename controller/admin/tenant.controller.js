const KHACH_THUE = require("../../models/KHACH_THUE.model");

module.exports.index = async (req, res) => {
  try {
    const khach_thue = await KHACH_THUE.SELECT();

    res.render("admin/page/tenant/index", {
      pageTitle: "Quản lý khách thuê",
      khach_thue: khach_thue,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/dashboard");
  }
};
