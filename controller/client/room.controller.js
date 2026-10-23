const PHONG = require("../../models/PHONG.model");
const filterStatusHelper = require("../../helper/filterStatus.helper");

module.exports.index = async (req, res) => {
  try {
    let find = {};

    const filterHousing = await filterStatusHelper.filterHousing();

    if (req.query.housing) {
      find.housing = req.query.housing;
      filterHousing.forEach((item) => {
        if (item.value == req.query.housing) {
          filterHousing[0].selected = false;
          item.selected = true;
        }
      });
    }

    const filterPrice = filterStatusHelper.filterPrice();

    if (req.query.search) find.search = req.query.search;

    const pagination = {
      limit: 4,
      current: 1,
      offset: 0,
    };

    pagination.count = await PHONG.COUNT_CLIENT(find);
    pagination.page = Math.ceil(
      pagination.count[0]["COUNT(*)"] / pagination.limit,
    );

    if (req.query.page) {
      pagination.current = parseInt(req.query.page);
      pagination.offset = (pagination.current - 1) * pagination.limit;
    }

    const phong = await PHONG.SELECT_ACTIVE(find, pagination);

    res.render("client/page/room/index", {
      pageTitle: "Tìm phòng trọ",
      phong: phong,
      search: req.query.search,
      pagination: pagination,
      filterHousing: filterHousing,
      filterPrice: filterPrice,
    });
  } catch (error) {
    req.flash("error", "Truy cập thất bại");
    res.redirect("/");
  }
};
