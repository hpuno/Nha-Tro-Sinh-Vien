const dayjs = require("dayjs");
const CHUC_VU = require("../../models/CHUC_VU.model");
const NHAN_VIEN = require("../../models/NHAN_VIEN.model");
const NHA_TRO = require("../../models/NHA_TRO.model");
const PHAN_CONG = require("../../models/PHAN_CONG.model");
const exportFileHelper = require("../../helper/exportFile.helper");
const fs = require("fs");

module.exports.index = async (req, res) => {
  try {
    let find = {};

    if (req.query.search) find.search = req.query.search;

    const pagination = {
      limit: 4,
      current: 1,
      offset: 0,
    };

    pagination.count = await NHAN_VIEN.COUNT(find);
    pagination.page = Math.ceil(
      pagination.count[0]["COUNT(*)"] / pagination.limit,
    );

    if (req.query.page) {
      pagination.current = parseInt(req.query.page);
      pagination.offset = (pagination.current - 1) * pagination.limit;
    }

    const nhan_vien = await PHAN_CONG.SELECT_PERMISSION(find, pagination);
    const chuc_vu = await CHUC_VU.SELECT_ACTIVE();

    res.render("admin/page/role/index", {
      pageTitle: "Quản lý chức vụ",
      chuc_vu: chuc_vu,
      nhan_vien: nhan_vien,
      pagination: pagination,
      search: req.query.search,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/dashboard");
  }
};

module.exports.create = (req, res) => {
  res.render("admin/page/role/create", { pageTitle: "Thêm mới chức vụ" });
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const [chuc_vu] = await CHUC_VU.FindByID(id);

    res.render("admin/page/role/detail", {
      pageTitle: "Thông tin chi tiết",
      chuc_vu: chuc_vu,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/role");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const [chuc_vu] = await CHUC_VU.FindByID(id);

    res.render("admin/page/role/edit", {
      pageTitle: "Chỉnh sửa thông tin",
      chuc_vu: chuc_vu,
    });
  } catch (error) {
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/role");
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const CV_ID = req.params.id;

    await CHUC_VU.UPDATE(CV_ID, req.body);
    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Cập nhật thấy bại");
    res.redirect("/admin/role");
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const [role] = await PHAN_CONG.FindByRole(id);

    if (role.CV_ID) await PHAN_CONG.DELETE_ROLE(role.CV_ID);

    await CHUC_VU.DELETE(id);

    req.flash("success", "Xóa thành công");
    res.redirect("/admin/role");
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa thất bại");
    res.redirect("/admin/role");
  }
};

module.exports.createPost = async (req, res) => {
  try {
    req.body.CV_NGAYTAO = dayjs().format("YYYY/MM/DD");
    const [level] = await CHUC_VU.COUNT_LEVEL();

    req.body.CV_LEVEL = level["COUNT(*)"] + 1;

    await CHUC_VU.INSERT(req.body);

    req.flash("success", "Thêm mới thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm mới thất bại");
    res.redirect("/admin/role");
  }
};

module.exports.permission = async (req, res) => {
  try {
    const id = req.params.id;
    const [nhan_vien] = await NHAN_VIEN.findID(id);
    const chuc_vu = await CHUC_VU.SELECT_ACTIVE();
    const nha_tro = await NHA_TRO.SELECT_ACTIVE();
    const phan_cong = await PHAN_CONG.FindByID(id);

    nha_tro.forEach((item) => {
      phan_cong.forEach((element) => {
        if (item.NT_ID == element.NT_ID) item.selected = true;
      });
    });

    res.render("admin/page/role/permission", {
      pageTitle: "Phân quyền",
      nhan_vien: nhan_vien,
      chuc_vu: chuc_vu,
      nha_tro: nha_tro,
      phan_cong: phan_cong,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/role");
  }
};

module.exports.permissionPatch = async (req, res) => {
  try {
    const idUser = req.params.id;

    const { CV_ID, NT_ID } = req.body;

    await PHAN_CONG.DELETE_PERMISSION(idUser);

    for (let idHousing of NT_ID)
      await PHAN_CONG.PERMISSION(idUser, idHousing, CV_ID);

    req.flash("success", "Phân quyền thành công");
    res.redirect("/admin/role");
  } catch (error) {
    console.log(error);
    req.flash("error", "Phân quyền thất bại");
    res.redirect("/admin/role");
  }
};

module.exports.permissionDetail = async (req, res) => {
  try {
    const id = req.params.id;

    const [nhan_vien] = await NHAN_VIEN.findID(id);
    const [chuc_vu] = await PHAN_CONG.SELECT_ROLE(id);
    const nha_tro = await PHAN_CONG.SELECT_HOUSING(id);

    res.render("admin/page/role/permission-detail", {
      pageTitle: "Thông tin chi tiết",
      nhan_vien: nhan_vien,
      chuc_vu: chuc_vu,
      nha_tro: nha_tro,
    });
  } catch (error) {
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/role");
  }
};

module.exports.exportFile = async (req, res) => {
  try {
    let find = {};

    if (req.query.search) find.search = req.query.search;

    if (req.query.status) find.status = req.query.status;

    const phan_cong = await PHAN_CONG.SELECT_EXPORT_FILE(find);

    const exportFile = await exportFileHelper.exportPermission(
      "Danh-sach-phan-cong",
      phan_cong,
    );

    res.download(exportFile, (err) => {
      if (!err)
        fs.unlink(exportFile, (err) => {
          if (err) console.log(err);
        });
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Tải xuống thất bại");
    res.redirect("/admin/role");
  }
};
