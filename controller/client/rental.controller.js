const dayjs = require("dayjs");
const PHONG = require("../../models/PHONG.model");
const KHACH_THUE = require("../../models/KHACH_THUE.model");
const THUE_PHONG = require("../../models/THUE_PHONG.model");
const DICH_VU = require("../../models/DICH_VU.model");

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
    const { KT_CCCD, KT_SDT } = req.body;
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
    console.log(phong);
    req.body.TP_GIA = phong.P_GIA;

    await THUE_PHONG.INSERT(req.body, khach_thue.KT_ID, P_ID);

    req.flash("error", "Thuê phòng thành công");
    res.redirect("/rental/detail");
  } catch (error) {
    console.log(error);
    req.flash("error", "Thuê phòng thất bại");
    res.redirect(req.get("Referer"));
  }
};
