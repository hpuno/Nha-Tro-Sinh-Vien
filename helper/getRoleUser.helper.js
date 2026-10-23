module.exports.getRole = (locals) => {
  if (locals.permission) {
    const map = locals.permission;
    const role = map.map((item) => item.NT_ID);
    return role;
  }
  req.flash("error", "Không có quyền truy cập");
  res.redirect("/");
};
