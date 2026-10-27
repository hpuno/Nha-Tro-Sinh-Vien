const PHONG = require("../../models/PHONG.model");
const filterStatusHelper = require("../../helper/filterStatus.helper");

module.exports.index = async (req, res) => {
  try {
    let find = {};

    // filter-housing
    const filterHousing = await filterStatusHelper.filterHousing();

    const housing = req.query.housing ? [].concat(req.query.housing) : [];

    if (housing.length > 0) {
      find.housing = housing;
      filterHousing.forEach((item) => {
        item.checked = housing.includes(String(item.value));
      });
    }

    // filter-price
    const filterPrice = filterStatusHelper.filterPrice();
    if (req.query.price) {
      const price = req.query.price;
      const [min, max] = price.split("-").map(Number);
      find.max = max * 1_000_000;
      find.min = min * 1_000_000;

      filterPrice.forEach((item) => {
        item.checked = item.value == price;
      });
    }
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
    console.log(error);
    req.flash("error", "Truy cập thất bại");
    res.redirect("/");
  }
};
