const dayjs = require("dayjs");
const PHONG = require("../../models/PHONG.model");
const KHACH_THUE = require("../../models/KHACH_THUE.model");
const THUE_PHONG = require("../../models/THUE_PHONG.model");
const DICH_VU = require("../../models/DICH_VU.model");
const filterHelper = require("../../helper/filterStatus.helper");
const SDDV = require("../../models/SDDV.model");

module.exports.index = async (req, res) => {
  try {
    const id = req.params.id;
    const [phong] = await PHONG.findByID(id);
    const khach_thue = res.locals.khach_thue;
    const dich_vu = await DICH_VU.SELECT();

    const priceService = {
      nuoc: dich_vu.find((item) => item.DV_TEN === "Nước")?.DV_GIA,
      dien: dich_vu.find((item) => item.DV_TEN === "Điện")?.DV_GIA,
      rac: dich_vu.find((item) => item.DV_TEN === "Lấy rác")?.DV_GIA,
    };

    const TP_NGAYTHUE = dayjs().format("YYYY-MM-DD");
    res.render("client/page/rental/index", {
      pageTitle: "Đăng ký thuê phòng",
      phong: phong,
      khach_thue: khach_thue,
      TP_NGAYTHUE: TP_NGAYTHUE,
      priceService: priceService,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Truy cập thất bại");
    res.redirect("/");
  }
};

module.exports.rental = async (req, res) => {
  try {
    const { KT_TEN, KT_CCCD, KT_SDT } = req.body;
    const P_ID = req.params.id;

    // cap nhat thong tin thue
    const khach_thue = res.locals.khach_thue;

    if (!khach_thue.KT_CCCD) {
      const cccd = await KHACH_THUE.findDuplicationUpdate("KT_CCCD", KT_CCCD);

      if (cccd.length != 0) {
        req.flash("error", "Căn cước đã tồn tại");
        res.redirect(req.get("Referer"));
        return;
      } else await KHACH_THUE.UPDATE_ONE(khach_thue.KT_ID, "KT_CCCD", KT_CCCD);
    }
    if (!khach_thue.KT_SDT) {
      const sdt = await KHACH_THUE.findDuplicationUpdate("KT_SDT", KT_SDT);

      if (sdt.length != 0) {
        req.flash("error", "Số điện thoại đã tồn tại");
        res.redirect(req.get("Referer"));
        return;
      } else await KHACH_THUE.UPDATE_ONE(khach_thue.KT_ID, "KT_SDT", KT_SDT);
    }

    if (KT_TEN) await KHACH_THUE.UPDATE_ONE(khach_thue.KT_ID, "KT_TEN", KT_TEN);
    // thue phong

    // giá dịch vụ
    const dich_vu = await DICH_VU.SELECT();
    req.body.TP_GIANUOC = dich_vu.find(
      (item) => item.DV_TEN === "Nước",
    )?.DV_GIA;
    req.body.TP_GIADIEN = dich_vu.find(
      (item) => item.DV_TEN === "Điện",
    )?.DV_GIA;
    req.body.TP_GIARAC = dich_vu.find(
      (item) => item.DV_TEN === "Lấy rác",
    )?.DV_GIA;

    // giá phòng
    const [phong] = await PHONG.findByID(P_ID);

    req.body.TP_GIA = phong.P_GIA;

    await THUE_PHONG.INSERT(req.body, khach_thue.KT_ID, P_ID);

    req.flash("success", "Thuê phòng thành công");
    res.redirect("/rental/detail");
  } catch (error) {
    console.log(error);
    req.flash("error", "Thuê phòng thất bại");
    res.redirect(req.get("Referer"));
  }
};

module.exports.detail = async (req, res) => {
  try {
    const id = res.locals.khach_thue.KT_ID;
    const thue_phong = await THUE_PHONG.SELECT_RENTAL("KT_ID", id);
    res.render("client/page/rental/detail", {
      pageTitle: "Thuê phòng",
      thue_phong: thue_phong,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Truy cập thất bại");
    res.redirect("/");
  }
};

module.exports.detailId = async (req, res) => {
  try {
    const id = req.params.id;
    let dich_vu = [];

    const [thue_phong] = await THUE_PHONG.SELECT_RENTAL("TP_ID", id);

    let sddv = await SDDV.SELECT_ACTIVE("DV_ID", "P_ID", thue_phong.P_ID);
    sddv = sddv.map((item) => item.DV_ID);

    if (sddv.length > 0) {
      dich_vu = await DICH_VU.findMany("DV_ID", sddv);
    }

    res.render("client/page/rental/detail-id", {
      pageTitle: "Thông tin chi tiết",
      thue_phong: thue_phong,
      dich_vu: dich_vu,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Truy cập thất bại");
    res.redirect("/admin/rental");
  }
};

module.exports.service = async (req, res) => {
  try {
    const idRoom = req.params.id;

    let find = {};

    if (req.query.search) find.search = req.query.search;

    const filterService = filterHelper.filterService();
    if (req.query.status) {
      find.status = req.query.status;
      find.idRoom = idRoom;
      filterService.forEach((item) => {
        if (item.value == req.query.status) {
          filterService[0].selected = false;
          item.selected = true;
        }
      });
    }

    const pagination = {
      limit: 4,
      current: 1,
      offset: 0,
    };

    pagination.count = await DICH_VU.COUNT(find);
    pagination.page = Math.ceil(
      pagination.count[0]["COUNT(*)"] / pagination.limit,
    );

    if (req.query.page) {
      pagination.current = parseInt(req.query.page);
      pagination.offset = (pagination.current - 1) * pagination.limit;
    }

    const dich_vu = await DICH_VU.SELECT_SERVICE(find, pagination);
    let sddv = await SDDV.SELECT_ACTIVE("DV_ID", "P_ID", idRoom);

    if (sddv.length > 0) sddv = sddv.map((item) => item.DV_ID);

    res.render("client/page/rental/service", {
      pageTitle: "Đăng ký dịch vụ",
      filterService: filterService,
      dich_vu: dich_vu,
      pagination: pagination,
      search: req.query.search,
      sddv: sddv,
      idRoom: idRoom,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Truy cập thất bại");
    res.redirect("/");
  }
};

module.exports.serviceSignup = async (req, res) => {
  try {
    const P_ID = req.params["id_room"];
    const DV_ID = req.params["id_service"];
    const SDDV_THANGNAM = dayjs().format("YYYY-MM-DD");

    await SDDV.SIGNUP(SDDV_THANGNAM, P_ID, DV_ID);

    req.flash("success", "Đăng ký thành công");
    res.redirect(req.get("Referer"));
  } catch (error) {
    console.log(error);
    req.flash("error", "Đăng ký thất bại");
    res.redirect(req.get("Referer"));
  }
};
