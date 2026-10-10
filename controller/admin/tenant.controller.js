const KHACH_THUE = require("../../models/KHACH_THUE.model");
const keycoak = require("../../server/keycoak.server");
const filterStatusHelper = require("../../helper/filterStatus.helper");
const dayjs = require("dayjs");
const exportFileHelper = require("../../helper/exportFile.helper");
const fs = require("fs");

module.exports.index = async (req, res) => {
  try {
    let find = {};
    const filterStatus = filterStatusHelper.filterTenant();

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

    const khach_thue = await KHACH_THUE.SELECT(find, pagination);

    res.render("admin/page/tenant/index", {
      pageTitle: "Quản lý khách thuê",
      khach_thue: khach_thue,
      search: req.query.search,
      filterStatus: filterStatus,
      pagination: pagination,
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

    const id_keycoak = khach_thue[0].KT_KEYCOAK;

    if (status == "inactive") await keycoak.changeStatus(id_keycoak, false);
    else await keycoak.changeStatus(id_keycoak, true);
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
    const id_keycoak = khach_thue[0].KT_KEYCOAK;
    await keycoak.deleteUser(id_keycoak);
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
    const keycoak_id = khach_thue[0].KT_KEYCOAK;

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
      await keycoak.resetPassword(keycoak_id, data.KT_MATKHAU_New);
    }
    if (!data.KT_ANH) data.KT_ANH = khach_thue[0].KT_ANH;

    if (khach_thue[0].KT_TRANGTHAI != data.KT_TRANGTHAI) {
      if (data.KT_TRANGTHAI == "inactive")
        await keycoak.changeStatus(keycoak_id, false);
      else await keycoak.changeStatus(keycoak_id, true);
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

    // keycoak
    req.body.KT_KEYCOAK = await keycoak.createUser({
      name: KT_TEN,
      email: KT_EMAIL,
      password: KT_MATKHAU,
    });

    // sql
    if (req.body.KT_DIACHI) {
      req.body.KT_DIACHI = req.body.KT_DIACHI.trim();
    }

    req.body.KT_NGAYTAO = dayjs().format("YYYY/MM/DD");
    console.log(req.body);
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
