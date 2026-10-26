const dayjs = require("dayjs");
const PHONG = require("../../models/PHONG.model");
const KHACH_THUE = require("../../models/KHACH_THUE.model");
const THUE_PHONG = require("../../models/THUE_PHONG.model");

module.exports.index = async (req, res) => {
  try {
    const id = req.params.id;
    const [phong] = await PHONG.findByID(id);
    const khach_thue = res.locals.khach_thue;

    const TP_NGAYTHUE = dayjs().format("YYYY-MM-DD");
    res.render("client/page/rental/index", {
      pageTitle: "Đăng ký thuê phòng",
      phong: phong,
      khach_thue: khach_thue,
      TP_NGAYTHUE: TP_NGAYTHUE,
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
    await THUE_PHONG.INSERT(req.body, khach_thue.KT_ID, P_ID);

    req.flash("error", "Thuê phòng thành công");
    res.redirect("/rental/detail");
  } catch (error) {
    console.log();
    req.flash("error", "Thuê phòng thất bại");
    res.redirect(req.get("Referer"));
  }
};
