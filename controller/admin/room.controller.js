const NHA_TRO = require("../../models/NHA_TRO.model");
const PHONG = require("../../models/PHONG.model");
const dayjs = require("dayjs");
const filterStatusHelper = require("../../helper/filterStatus.helper");
const roleHelper = require("../../helper/getRoleUser.helper");
const exportFileHelper = require("../../helper/exportFile.helper");
const fs = require("fs");
const THUE_PHONG = require("../../models/THUE_PHONG.model");

module.exports.index = async (req, res) => {
  try {
    let find = {};
    const filterStatus = filterStatusHelper.filter();

    if (req.query.search) find.search = req.query.search;

    if (req.query.status) {
      find.status = req.query.status;
      filterStatus.forEach((item) => {
        if (item.value == req.query.status) {
          filterStatus[0].selected = false;
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

    pagination.count = await PHONG.COUNT(find, role);
    pagination.page = Math.ceil(
      pagination.count[0]["COUNT(*)"] / pagination.limit,
    );

    if (req.query.page) {
      pagination.current = parseInt(req.query.page);
      pagination.offset = (pagination.current - 1) * pagination.limit;
    }

    const phong = await PHONG.SELECT(find, pagination, role);
    const thue_phong = await THUE_PHONG.SELECT_RENTAL("P_ID");

    const rental = thue_phong.map((item) => item.P_ID);

    res.render("admin/page/room/index", {
      pageTitle: "Quản lý phòng trọ",
      search: req.query.search,
      filterStatus: filterStatus,
      pagination: pagination,
      phong: phong,
      rental: rental,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/dashboard");
  }
};

module.exports.create = async (req, res) => {
  try {
    const nha_tro = await NHA_TRO.SELECT_ACTIVE();

    res.render("admin/page/room/create", {
      pageTitle: "Quản lý phòng trọ",
      nha_tro: nha_tro,
    });
  } catch (error) {
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/room");
  }
};

module.exports.createPost = async (req, res) => {
  try {
    req.body.P_NGAYTAO = dayjs().format("YYYY/MM/DD");
    await PHONG.INSERT(req.body);
    req.flash("success", "Thêm mới thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm mới thất bại");
    res.redirect("/admin/room");
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    await PHONG.CHANGE_STATUS(id, status);

    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/room");
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const thue_phong = await THUE_PHONG.findByID("P_ID", id);

    if (thue_phong.length > 0) {
      req.flash("error", "Không thể xóa phòng, vì còn khách đang thuê");
      res.redirect("/admin/room");
      return;
    }
    await PHONG.DELETE(id);

    req.flash("success", "Xóa thành công");
    res.redirect("/admin/room");
  } catch (error) {
    req.flash("error", "Xóa thất bại");
    res.redirect("/admin/room");
  }
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const [phong] = await PHONG.findByID(id);
    res.render("admin/page/room/detail", {
      pageTitle: "Thông tin chi tiết",
      phong: phong,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/room");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const [phong] = await PHONG.findByID(id);
    const nha_tro = await NHA_TRO.SELECT_ACTIVE();

    res.render("admin/page/room/edit", {
      pageTitle: "Chỉnh sửa thông tin",
      phong: phong,
      nha_tro: nha_tro,
    });
  } catch (error) {
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/room");
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const [phong] = await PHONG.findByID(id);
    console.log(phong);
    if (!req.body.P_ANH) req.body.P_ANH = phong.P_ANH;

    await PHONG.UPDATE(id, req.body);

    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/room");
  }
};

module.exports.exportFile = async (req, res) => {
  try {
    let find = {};

    if (req.query.search) find.search = req.query.search;

    if (req.query.status) find.status = req.query.status;

    const role = roleHelper.getRole(res.locals);

    const phong = await PHONG.SELECT_EXPORT_FILE(find, role);

    const exportFile = await exportFileHelper.exportRoom(
      "Danh-sach-phong-tro",
      phong,
    );

    res.download(exportFile, (err) => {
      if (!err) {
        fs.unlink(exportFile, (err) => {
          if (err) console.log(err);
        });
      }
    });
  } catch (error) {
    req.flash("error", "Tải thất bại");
    res.redirect("/admin/room");
  }
};
