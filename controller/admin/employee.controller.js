const dayjs = require("dayjs");
const NHA_TRO = require("../../models/NHA_TRO.model");
const CHUC_VU = require("../../models/CHUC_VU.model");
const NHAN_VIEN = require("../../models/NHAN_VIEN.model");
const keycloak = require("../../server/keycloak.server");
const filterStatusHelper = require("../../helper/filterStatus.helper");
const PHAN_CONG = require("../../models/PHAN_CONG.model");
const exportFileHelper = require("../../helper/exportFile.helper");
const KHACH_THUE = require("../../models/KHACH_THUE.model");
const fs = require("fs");

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

    pagination.count = await NHAN_VIEN.COUNT(find);
    pagination.page = Math.ceil(
      pagination.count[0]["COUNT(*)"] / pagination.limit,
    );

    if (req.query.page) {
      pagination.current = parseInt(req.query.page);
      pagination.offset = (pagination.current - 1) * pagination.limit;
    }

    const chuc_vu = await CHUC_VU.SELECT();
    const nhan_vien = await NHAN_VIEN.SELECT(find, pagination);

    res.render("admin/page/employee/index", {
      pageTitle: "Quản lý nhân viên",
      nhan_vien: nhan_vien,
      filterStatus: filterStatus,
      search: req.query.search,
      pagination: pagination,
      chuc_vu: chuc_vu,
    });
  } catch (error) {
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/dashboard");
  }
};

module.exports.create = async (req, res) => {
  try {
    const chuc_vu = await CHUC_VU.SELECT();
    res.render("admin/page/employee/create", {
      pageTitle: "Thêm mới nhân viên",
      chuc_vu: chuc_vu,
    });
  } catch (error) {
    req.flash("error", "Thêm mới thất bại");
    res.redirect("/admin/employee");
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const { NV_TEN, NV_EMAIL, NV_MATKHAU, NV_ReMATKHAU, NV_CCCD, NV_SDT } =
      req.body;

    if (NV_MATKHAU != NV_ReMATKHAU) {
      req.flash("error", "Thông tin không hợp lệ");
      res.redirect("/admin/employee");
      return;
    }

    const email = await NHAN_VIEN.findDuplication("NV_EMAIL", NV_EMAIL);
    if (email.length != 0) {
      req.flash("error", "Email đã tồn tại");
      res.redirect(req.get("Referer"));
      return;
    }

    if (NV_CCCD) {
      const cccd = await NHAN_VIEN.findDuplication("NV_CCCD", NV_CCCD);
      if (cccd.length != 0) {
        req.flash("error", "Căn cước đã tồn tại");
        res.redirect(req.get("Referer"));
        return;
      }
    }

    if (NV_SDT) {
      const sdt = await NHAN_VIEN.findDuplication("NV_SDT", NV_SDT);
      if (sdt.length != 0) {
        req.flash("error", "Số điện thoại đã tồn tại");
        res.redirect(req.get("Referer"));
        return;
      }
    }

    // keycloak
    const [user] = await keycloak.checkUsername(NV_EMAIL);

    if (user) {
      await keycloak.setRole(user.id, "ADMIN");
      req.body.NV_keycloak = user.id;
    } else {
      req.body.NV_keycloak = await keycloak.createUser(
        {
          name: NV_TEN,
          email: NV_EMAIL,
          password: NV_MATKHAU,
        },
        "ADMIN",
      );
    }

    // sql
    if (req.body.NV_DIACHI) {
      req.body.NV_DIACHI = req.body.NV_DIACHI.trim();
    }

    req.body.NV_NGAYTAO = dayjs().format("YYYY/MM/DD");

    await NHAN_VIEN.INSERT(req.body);

    req.flash("success", "Thêm mới thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm mới thất bại");
    res.redirect("/admin/employee");
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { status, id } = req.params;

    const [nhan_vien] = await NHAN_VIEN.findID(id);
    const id_keycloak = nhan_vien.NV_keycloak;

    if (status == "inactive") await keycloak.changeStatus(id_keycloak, false);
    else await keycloak.changeStatus(id_keycloak, true);
    const [khach_thue] = await KHACH_THUE.findByID(id);
    if (khach_thue) {
      khach_thue.KT_TRANGTHAI = status;
      await KHACH_THUE.UPDATE(id, khach_thue);
    }
    await NHAN_VIEN.CHANGE_STATUS(id, status);
    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/employee");
  }
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const [nhan_vien] = await NHAN_VIEN.findID(id);
    const [chuc_vu] = await PHAN_CONG.SELECT_ROLE(id);
    const nha_tro = await PHAN_CONG.SELECT_HOUSING(id);

    res.render("admin/page/employee/detail", {
      pageTitle: "Thông tin chi tiết",
      nhan_vien: nhan_vien,
      chuc_vu: chuc_vu,
      nha_tro: nha_tro,
    });
  } catch (error) {
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/employee");
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const phan_cong = await PHAN_CONG.FindByID(id);
    if (phan_cong.length > 0) {
      await PHAN_CONG.DELETE_PERMISSION(id);
    }

    await NHAN_VIEN.DELETE(id);

    req.flash("success", "Xóa thành công");
    res.redirect("/admin/employee");
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa thất bại");
    res.redirect("/admin/employee");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const [nhan_vien] = await NHAN_VIEN.findID(id);

    res.render("admin/page/employee/edit", {
      pageTitle: "Chỉnh sửa thông tin",
      nhan_vien: nhan_vien,
    });
  } catch (error) {
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/employee");
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const data = req.body;
    const NV_ID = req.params.id;

    const [nhan_vien] = await NHAN_VIEN.findID(NV_ID);
    const keycloak_id = nhan_vien.NV_keycloak;

    const email = await NHAN_VIEN.findDuplicationUpdate(
      "NV_EMAIL",
      data.NV_EMAIL,
      NV_ID,
    );
    if (email.length != 0) {
      req.flash("error", "Thông bị bị trùng");
      res.redirect(req.get("Referer"));
      return;
    }

    if (data.NV_SDT) {
      const sdt = await NHAN_VIEN.findDuplicationUpdate(
        "NV_SDT",
        data.NV_SDT,
        NV_ID,
      );
      if (sdt.length != 0) {
        req.flash("error", "Thông bị bị trùng");
        res.redirect(req.get("Referer"));
        return;
      }
    }

    if (data.NV_CCCD) {
      const cccd = await NHAN_VIEN.findDuplicationUpdate(
        "NV_CCCD",
        data.NV_CCCD,
        NV_ID,
      );
      if (cccd.length != 0) {
        req.flash("error", "Thông bị bị trùng");
        res.redirect(req.get("Referer"));
        return;
      }
    }

    if (data.NV_MATKHAU) {
      await keycloak.resetPassword(keycloak_id, data.NV_MATKHAU);
    }
    if (!data.NV_ANH) data.NV_ANH = nhan_vien.NV_ANH;

    if (nhan_vien.NV_TRANGTHAI != data.NV_TRANGTHAI) {
      if (data.NV_TRANGTHAI == "inactive")
        await keycloak.changeStatus(keycloak_id, false);
      else await keycloak.changeStatus(keycloak_id, true);
    }

    if (data.NV_DIACHI) {
      data.NV_DIACHI = data.NV_DIACHI.trim();
    }

    await NHAN_VIEN.UPDATE(NV_ID, data);

    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/employee");
  }
};

module.exports.exportFile = async (req, res) => {
  try {
    let find = {};

    if (req.query.search) find.search = req.query.search;

    if (req.query.status) find.status = req.query.status;

    const nhan_vien = await NHAN_VIEN.SELECT_EXPORT_FILE(find);

    const exportFile = await exportFileHelper.exportEmployee(
      "Danh-sacnh-nhan-vien",
      nhan_vien,
    );

    res.download(exportFile, (err) => {
      if (!err) {
        fs.unlink(exportFile, (err) => {
          if (err) console.log(err);
        });
      }
    });
  } catch (error) {
    console.log(error);
    req.flash("Tải xuống thất bại");
    res.redirect("/admin/employee");
  }
};
