const filterHelper = require("../../helper/filterStatus.helper");
const DICH_VU = require("../../models/DICH_VU.model");
const dayjs = require("dayjs");

module.exports.index = async (req, res) => {
  try {
    const dich_vu = await DICH_VU.SELECT();

    res.render("admin/page/service/index", {
      pageTitle: "Quản lý dịch vụ",
      dich_vu: dich_vu,
    });
  } catch (error) {
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/dashboard");
  }
};

module.exports.create = (req, res) => {
  try {
    const filterPriceService = filterHelper.filterPriceService();

    res.render("admin/page/service/create", {
      pageTitle: "Thêm mới dịch vụ",
      filterPriceService: filterPriceService,
    });
  } catch (error) {
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/service");
  }
};

module.exports.createPost = async (req, res) => {
  try {
    req.body.DV_NGAYTAO = dayjs().format("YYYY/MM/DD");
    await DICH_VU.INSERT(req.body);

    req.flash("success", "Thêm mới thành công");
    res.redirect("/admin/service");
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm mới thất bại");
    res.redirect("/admin/service");
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const service = ["Điện", "Nước", "Lấy rác"];

    const [dich_vu] = await DICH_VU.FindById("DV_ID", id);
    if (service.includes(dich_vu.DV_TEN)) {
      req.flash("error", "Dữ liệu này không thể xóa");
      res.redirect("/admin/service");
      return;
    }

    await DICH_VU.DELETE(id);

    req.flash("success", "Xóa thành công");
    res.redirect("/admin/service");
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa thất bại");
    res.redirect("/admin/service");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const [dich_vu] = await DICH_VU.FindById("DV_ID", id);
    const filterPriceService = filterHelper.filterPriceService();

    res.render("admin/page/service/edit", {
      pageTitle: "Chỉnh sửa thông tin",
      dich_vu: dich_vu,
      filterPriceService: filterPriceService,
    });
  } catch (error) {
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/service");
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await DICH_VU.UPDATE(id, req.body);

    req.flash("success", "Cập nhật thành công");
    res.redirect("/admin/service");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/service");
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { status, id } = req.params;

    await DICH_VU.CHANGE_STATUS(id, status);

    req.flash("success", "Cập nhật thành công");
    res.redirect("/admin/service");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/service");
  }
};
