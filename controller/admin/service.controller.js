const filterHelper = require("../../helper/filterStatus.helper");
const DICH_VU = require("../../models/DICH_VU.model");
const dayjs = require("dayjs");
const SDDV = require("../../models/SDDV.model");
const roleHelper = require("../../helper/getRoleUser.helper");
const THUE_PHONG = require("../../models/THUE_PHONG.model");

module.exports.index = async (req, res) => {
  try {
    let find = {};

    const dich_vu = await DICH_VU.SELECT();

    const role = roleHelper.getRole(res.locals);

    if (req.query.search) find.search = req.query.search;

    const filterMounthYear = filterHelper.filterMounthYear();
    if (req.query.status) {
      find.status = req.query.status;
      filterMounthYear.forEach((item) => {
        if (item.value == req.query.status) {
          filterMounthYear[0].selected = false;
          item.selected = true;
        }
      });
    }

    const pagination = {
      limit: 5,
      current: 1,
      offset: 0,
    };

    pagination.count = await SDDV.COUNT(find, role);
    pagination.page = Math.ceil(
      pagination.count[0]["COUNT(*)"] / pagination.limit,
    );

    if (req.query.page) {
      pagination.current = parseInt(req.query.page);
      pagination.offset = (pagination.current - 1) * pagination.limit;
    }

    const sddv = await SDDV.SELECT(find, pagination, role);
    console.log(find);
    res.render("admin/page/service/index", {
      pageTitle: "Quản lý dịch vụ",
      dich_vu: dich_vu,
      sddv: sddv,
      search: req.query.search,
      pagination: pagination,
      filterMounthYear: filterMounthYear,
    });
  } catch (error) {
    console.log(error);
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

module.exports.deleteUseService = async (req, res) => {
  try {
    const { idRoom, idService, mouth_year } = req.params;

    await SDDV.DELETE_USE_SERVICE(idRoom, idService, mouth_year);

    req.flash("success", "Xóa thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa thất bại");
    res.redirect("/admin/service");
  }
};

module.exports.createUseService = async (req, res) => {
  try {
    let sddv = [];
    let idRoom = "";
    const role = roleHelper.getRole(res.locals);
    const thue_phong = await THUE_PHONG.SELECT_ACTIVE(role);

    if (req.query.idRoom) {
      idRoom = req.query.idRoom;
      sddv = await DICH_VU.SELECT_USE_SERVICE(idRoom);
    }

    res.render("admin/page/service/use-service", {
      pageTitle: "Đăng ký dịch vụ",
      thue_phong: thue_phong,
      idRoom: idRoom,
      sddv: sddv,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/dashboard");
  }
};

module.exports.createUseServicePost = async (req, res) => {
  try {
    const { P_ID, DV_ID } = req.body;
    const SDDV_THANGNAM = dayjs().format("YYYY-MM-DD");

    for (let i of DV_ID) await SDDV.SIGNUP(SDDV_THANGNAM, P_ID, i);

    req.flash("success", "Tạo mới thành công");
    res.redirect("/admin/service");
  } catch (error) {
    console.log(error);
    req.flash("error", "Tạo mới thất bại");
    res.redirect("/admin/service");
  }
};
