module.exports.index = (req, res) => {
  try {
    res.render("admin/page/room/index", { pageTitle: "Quản lý phòng trọ" });
  } catch (error) {
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/dashboard");
  }
};
