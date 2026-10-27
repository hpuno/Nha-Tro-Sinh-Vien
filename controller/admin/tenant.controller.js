const KHACH_THUE = require("../../models/KHACH_THUE.model");
const keycloak = require("../../server/keycloak.server");
const filterStatusHelper = require("../../helper/filterStatus.helper");
const dayjs = require("dayjs");
const exportFileHelper = require("../../helper/exportFile.helper");
const fs = require("fs");
const NHAN_VIEN = require("../../models/NHAN_VIEN.model");
const THUE_PHONG = require("../../models/THUE_PHONG.model");
const roleHelper = require("../../helper/getRoleUser.helper");
const NHA_TRO = require("../../models/NHA_TRO.model");
const PHONG = require("../../models/PHONG.model");
const DICH_VU = require("../../models/DICH_VU.model");

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

    pagination.count = await KHACH_THUE.COUNT(find);
    pagination.page = Math.ceil(
      pagination.count[0]["COUNT(*)"] / pagination.limit,
    );

    if (req.query.page) {
      pagination.current = parseInt(req.query.page);
      pagination.offset = (pagination.current - 1) * pagination.limit;
    }

    const role = roleHelper.getRole(res.locals);

    const khach_thue = await KHACH_THUE.SELECT(find, pagination, role);
    const thue_phong = await THUE_PHONG.SELECT_RENTAL("KT_ID");

    let rental = thue_phong.map((item) => item.KT_ID);
    res.render("admin/page/tenant/index", {
      pageTitle: "Quản lý khách thuê",
      khach_thue: khach_thue,
      search: req.query.search,
      filterStatus: filterStatus,
      pagination: pagination,
      rental: rental,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/dashboard");
  }
};

module.exports.changStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    const khach_thue = await KHACH_THUE.findByID(id);

    const id_keycloak = khach_thue[0].KT_keycloak;

    if (status == "inactive") await keycloak.changeStatus(id_keycloak, false);
    else await keycloak.changeStatus(id_keycloak, true);
    const [nhan_vien] = await NHAN_VIEN.findID(id);
    if (nhan_vien) {
      nhan_vien.NV_TRANGTHAI = status;
      await NHAN_VIEN.UPDATE(id, nhan_vien);
    }
    await KHACH_THUE.CHANGE_STATUS(id, status);

    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại");
    res.redirect(req.get("Referer"));
  }
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const khach_thue = await KHACH_THUE.findByID(id);
    await res.render("admin/page/tenant/detail", {
      pageTitle: "Thông tin chi tiết",
      khach_thue: khach_thue[0],
    });
  } catch (error) {
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/tenant");
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const khach_thue = await KHACH_THUE.findByID(id);
    const id_keycloak = khach_thue[0].KT_keycloak;
    await keycloak.deleteUser(id_keycloak);
    await KHACH_THUE.DELETE_USER(id);

    req.flash("success", "Xóa thành công");
    res.redirect("/admin/tenant");
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa thất bại");
    res.redirect("/admin/tenant");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const khach_thue = await KHACH_THUE.findByID(id);

    res.render("admin/page/tenant/edit", {
      pageTitle: "Cập nhật thông tin",
      khach_thue: khach_thue[0],
    });
  } catch (error) {
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/tenant");
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const data = req.body;
    const KT_ID = req.params.id;

    const khach_thue = await KHACH_THUE.findByID(KT_ID);
    const keycloak_id = khach_thue[0].KT_keycloak;

    const email = await KHACH_THUE.findDuplicationUpdate(
      "KT_EMAIL",
      data.KT_EMAIL,
      KT_ID,
    );
    if (email.length != 0) {
      req.flash("error", "Thông bị bị trùng");
      res.redirect(req.get("Referer"));
      return;
    }

    if (data.KT_SDT) {
      const sdt = await KHACH_THUE.findDuplicationUpdate(
        "KT_SDT",
        data.KT_SDT,
        KT_ID,
      );
      if (sdt.length != 0) {
        req.flash("error", "Thông bị bị trùng");
        res.redirect(req.get("Referer"));
        return;
      }
    }

    if (data.KT_CCCD) {
      const cccd = await KHACH_THUE.findDuplicationUpdate(
        "KT_CCCD",
        data.KT_CCCD,
        KT_ID,
      );
      if (cccd.length != 0) {
        req.flash("error", "Thông bị bị trùng");
        res.redirect(req.get("Referer"));
        return;
      }
    }

    if (data.KT_MATKHAU_New) {
      await keycloak.resetPassword(keycloak_id, data.KT_MATKHAU_New);
    }
    if (!data.KT_ANH) data.KT_ANH = khach_thue[0].KT_ANH;

    if (khach_thue[0].KT_TRANGTHAI != data.KT_TRANGTHAI) {
      if (data.KT_TRANGTHAI == "inactive")
        await keycloak.changeStatus(keycloak_id, false);
      else await keycloak.changeStatus(keycloak_id, true);
    }

    if (data.KT_DIACHI) {
      data.KT_DIACHI = data.KT_DIACHI.trim();
    }

    await KHACH_THUE.UPDATE(KT_ID, data);

    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/tenant");
  }
};

module.exports.create = (req, res) => {
  res.render("admin/page/tenant/create", { pageTitle: "Thêm mới khách thuê" });
};

module.exports.createPost = async (req, res) => {
  try {
    const { KT_TEN, KT_EMAIL, KT_MATKHAU, KT_Re_MATKHAU, KT_CCCD, KT_SDT } =
      req.body;
    if (KT_MATKHAU != KT_Re_MATKHAU) {
      req.flash("error", "Mật khẩu không khớp");
      res.redirect(req.get("Referer"));
      return;
    }
    const email = await KHACH_THUE.findDuplication("KT_EMAIL", KT_EMAIL);
    if (email.length != 0) {
      req.flash("error", "Email đã tồn tại");
      res.redirect(req.get("Referer"));
      return;
    }

    if (KT_CCCD) {
      const cccd = await KHACH_THUE.findDuplication("KT_CCCD", KT_CCCD);
      if (cccd.length != 0) {
        req.flash("error", "Căn cước đã tồn tại");
        res.redirect(req.get("Referer"));
        return;
      }
    }

    if (KT_SDT) {
      const sdt = await KHACH_THUE.findDuplication("KT_SDT", KT_SDT);
      if (sdt.length != 0) {
        req.flash("error", "Số điện thoại đã tồn tại");
        res.redirect(req.get("Referer"));
        return;
      }
    }

    //keycloak
    const [user] = await keycloak.checkUsername(KT_EMAIL);

    if (user) {
      await keycloak.setRole(user.id, "KHACH_THUE");
      req.body.KT_keycloak = user.id;
    } else {
      req.body.KT_keycloak = await keycloak.createUser(
        {
          name: KT_TEN,
          email: KT_EMAIL,
          password: KT_MATKHAU,
        },
        "KHACH_THUE",
      );
    }

    // sql
    if (req.body.KT_DIACHI) {
      req.body.KT_DIACHI = req.body.KT_DIACHI.trim();
    }

    req.body.KT_NGAYTAO = dayjs().format("YYYY/MM/DD");

    await KHACH_THUE.INSERT_ADMIN(req.body);

    req.flash("success", "Thêm mới thành công");
    res.redirect("/admin/tenant");
  } catch (error) {
    console.log(error);
    req.flash("error", "Truy cập thất bại");
    res.redirect(req.get("Referer"));
  }
};

module.exports.exportFile = async (req, res) => {
  try {
    let find = {};

    if (req.query.search) find.search = req.query.search;

    if (req.query.status) find.status = req.query.status;

    const khach_thue = await KHACH_THUE.SELECT_EXPORT_FILE(find);

    const exportFile = await exportFileHelper.exportTenant(
      "Danh-sach-khach-thue",
      khach_thue,
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
    req.flash("error", "không thể xuất file");
    res.redirect(req.get("Referer"));
  }
};

module.exports.rental = async (req, res) => {
  try {
    let phong = [];
    let housing = [];
    let room = [];
    let idRoom = "";
    let idHousing = "";
    const idUser = req.params.id;

    const dich_vu = await DICH_VU.SELECT();

    const priceService = {
      nuoc: dich_vu.find((item) => item.DV_TEN === "Nước")?.DV_GIA,
      dien: dich_vu.find((item) => item.DV_TEN === "Điện")?.DV_GIA,
      rac: dich_vu.find((item) => item.DV_TEN === "Lấy rác")?.DV_GIA,
    };

    if (req.query.idHousing) {
      idHousing = req.query.idHousing;
      housing = await NHA_TRO.SELECT_ONE(idHousing);
      phong = await PHONG.SELECT_RENTAL(idHousing);
    }

    if (req.query.idRoom) {
      idRoom = req.query.idRoom;
      room = await PHONG.findByID(idRoom);
    }

    const role = roleHelper.getRole(res.locals);

    const nha_tro = await NHA_TRO.SELECT_RENTAL(role);

    const [khach_thue] = await KHACH_THUE.findByID(idUser);
    const TP_NGAYTHUE = dayjs().format("YYYY-MM-DD");

    res.render("admin/page/tenant/rental", {
      pageTitle: "Thêm mới thuê phòng",
      nha_tro: nha_tro,
      housing: housing[0],
      phong: phong,
      room: room[0],
      priceService: priceService,
      idHousing: idHousing,
      idRoom: idRoom,
      khach_thue: khach_thue,
      TP_NGAYTHUE: TP_NGAYTHUE,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Thuê phòng thất bại");
    res.redirect("/admin/tenant");
  }
};
