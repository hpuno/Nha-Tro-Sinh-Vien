module.exports.index = (req, res) => {
  try {
    res.render("admin/page/tenant/index", { pageTitle: "Quản lý khách thuê" });
  } catch (error) {
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/dashboard");
  }
};
