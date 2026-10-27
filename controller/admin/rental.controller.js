const THUE_PHONG = require("../../models/THUE_PHONG.model");
const NHA_TRO = require("../../models/NHA_TRO.model");
const PHONG = require("../../models/PHONG.model");
const DICH_VU = require("../../models/DICH_VU.model");
const roleHelper = require("../../helper/getRoleUser.helper");
const filterStatusHelper = require("../../helper/filterStatus.helper");

module.exports.index = async (req, res) => {
  try {
    let find = {};

    if (req.query.search) find.search = req.query.search;

    const filterRental = filterStatusHelper.filterRental();
    if (req.query.status) {
      find.status = req.query.status;
      filterRental.forEach((item) => {
        if (item.value == req.query.status) {
          filterRental[0].selected = false;
          item.selected = true;
        }
      });
    }

    const pagination = {
      limit: 4,
      current: 1,
      offset: 0,
    };

    const role = roleHelper.getRole(res.locals);

    pagination.count = await THUE_PHONG.COUNT(find, role);
    pagination.page = Math.ceil(
      pagination.count[0]["COUNT(*)"] / pagination.limit,
    );

    if (req.query.page) {
      pagination.current = parseInt(req.query.page);
      pagination.offset = (pagination.current - 1) * pagination.limit;
    }

    const thue_phong = await THUE_PHONG.SELECT(find, pagination, role);

    res.render("admin/page/rental/index", {
      pageTitle: "Quản lý thuê phòng",
      search: req.query.search,
      pagination: pagination,
      thue_phong: thue_phong,
      filterRental: filterRental,
    });
  } catch (error) {
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/rental");
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { status, id } = req.params;

    await THUE_PHONG.CHANGE_STATUS(id, status);

    req.flash("success", "Cập nhật thành công");
    res.redirect("/admin/rental");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/rental");
  }
};
