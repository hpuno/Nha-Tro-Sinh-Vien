const dayjs = require("dayjs");
const NHA_TRO = require("../../models/NHA_TRO.model");
const filterStatusHelper = require("../../helper/filterStatus.helper");
const exportFileHelper = require("../../helper/exportFile.helper");
const fs = require("fs");

module.exports.index = async (req, res) => {
  try {
    let find = {};

    const filterStatus = filterStatusHelper.filter();

    if (req.query.status) {
      find.status = req.query.status;
      filterStatus.forEach((item) => {
        if (item.value == req.query.status) {
          filterStatus[0].selected = false;
          item.selected = true;
        }
      });
    }

    if (req.query.search) find.search = req.query.search;

    const pagination = {
      limit: 4,
      current: 1,
      offset: 0,
    };

    pagination.count = await NHA_TRO.COUNT(find);
    pagination.page = Math.ceil(
      pagination.count[0]["COUNT(*)"] / pagination.limit,
    );

    if (req.query.page) {
      pagination.current = parseInt(req.query.page);
      pagination.offset = (pagination.current - 1) * pagination.limit;
    }

    const nha_tro = await NHA_TRO.SELECT(find, pagination);

    res.render("admin/page/housing/index", {
      pageTitle: "Quản lý nhà trọ",
      nha_tro: nha_tro,
      search: req.query.search,
      pagination: pagination,
      filterStatus: filterStatus,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Truy cập thất bai");
    res.redirect("/admin/dashboard");
  }
};

module.exports.create = (req, res) => {
  res.render("admin/page/housing/create", { pageTitle: "Thêm mới nhà trọ" });
};

module.exports.createPost = async (req, res) => {
  try {
    const { NT_DIACHI, NT_MOTA } = req.body;
    if (NT_DIACHI) {
      req.body.NT_DIACHI = NT_DIACHI.trim();
    }
    if (NT_MOTA) {
      req.body.NT_MOTA = NT_MOTA.trim();
    }

    req.body.NT_NGAYTAO = dayjs().format("YYYY/MM/DD");

    await NHA_TRO.INSERT(req.body);

    req.flash("success", "Thêm mới thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Thêm mới thất bại");
    res.redirect("/admin/housing");
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { id, status } = req.params;

    await NHA_TRO.CHANGE_STATUS(id, status);

    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/housing");
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await NHA_TRO.DELETE(id);

    req.flash("success", "Xóa thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    req.flash("error", "Xóa thất bại");
    res.redirect("/admin/housing");
  }
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const [nha_tro] = await NHA_TRO.SELECT_ONE(id);

    res.render("admin/page/housing/detail", {
      pageTitle: "Thông tin chi tiết",
      nha_tro: nha_tro,
    });
  } catch (error) {
    req.flash("error", "Không thể truy cập");
    res.redirect("/admin/housing");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const [nha_tro] = await NHA_TRO.SELECT_ONE(id);
    res.render("admin/page/housing/edit", {
      pageTitle: "Chỉnh sửa thông tin",
      nha_tro: nha_tro,
    });
  } catch (error) {
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/housing");
  }
};

module.exports.edtiPatch = async (req, res) => {
  try {
    const { NT_DIACHI, NT_MOTA, NT_ANH } = req.body;
    if (NT_DIACHI) {
      req.body.NT_DIACHI = NT_DIACHI.trim();
    }
    if (NT_MOTA) {
      req.body.NT_MOTA = NT_MOTA.trim();
    }

    const id = req.params.id;
    const [nha_tro] = await NHA_TRO.SELECT_ONE(id);

    if (!NT_ANH) {
      req.body.NT_ANH = nha_tro.NT_ANH;
    }

    await NHA_TRO.UPDATE(id, req.body);

    req.flash("success", "Cập nhật thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại");
    res.redirect("/admin/housing");
  }
};

module.exports.exportFile = async (req, res) => {
  try {
    let find = {};

    if (req.query.search) find.search = req.query.search;

    if (req.query.status) find.status = req.query.status;

    const nha_tro = await NHA_TRO.SELECT_EXPORT_FILE(find);

    const exportFile = await exportFileHelper.exportHousing(
      "Danh-sach-nha-tro",
      nha_tro,
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
    req.flash("error", "Không thể xuất file");
    res.redirect("/admin/housing");
  }
};
