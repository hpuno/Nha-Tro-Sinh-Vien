module.exports.index = (req, res) => {
  try {
    res.render("admin/page/housing/index", { pageTitle: "Quản lý nhà trọ" });
  } catch (error) {
    req.flash("error", "Truy cập thất bai");
    res.redirect("/admin/dashboard");
  }
};

module.exports.create = (req, res) => {
  res.render("admin/page/housing/create", { pageTitle: "Thêm mới nhà trọ" });
};
