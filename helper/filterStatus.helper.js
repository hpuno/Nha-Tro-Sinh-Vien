const NHA_TRO = require("../models/NHA_TRO.model");
const dayjs = require("dayjs");

module.exports.filter = () => {
  const filterStatus = [
    { value: "", name: "Tất cả", selected: true },
    { value: "active", name: "Hoạt động", selected: false },
    { value: "inactive", name: "Dừng hoạt động", selected: false },
  ];

  return filterStatus;
};

module.exports.filterHousing = async () => {
  const nha_tro = await NHA_TRO.SELECT_ACTIVE();

  const filterHousing = [];

  nha_tro.forEach((item) => {
    filterHousing.push({
      value: item.NT_ID,
      name: item.NT_TEN,
      checked: false,
    });
  });

  return filterHousing;
};

module.exports.filterPrice = () => {
  const filterPrice = [
    { value: "0.1-1", name: "Dưới 1 triệu", checked: false },
    { value: "1-2", name: "Từ 1 - 2 triệu", checked: false },
    { value: "2-3", name: "Từ 2 - 3 triệu", checked: false },
    { value: "3-4", name: "Từ 3 - 4 triệu", checked: false },
    { value: "5-100", name: "Trên 5 triệu", checked: false },
  ];

  return filterPrice;
};

module.exports.filterPriceService = () => {
  const filterPriceService = [
    { value: "m3", name: "m³", checked: false },
    { value: "phong", name: "Phòng", checked: false },
    { value: "kwh", name: "Kwh", checked: false },
  ];

  return filterPriceService;
};

module.exports.filterRental = () => {
  const filterStatus = [
    { value: "", name: "Tất cả", selected: true },
    { value: "active", name: "Hoạt động", selected: false },
    { value: "inactive", name: "Dừng hoạt động", selected: false },
    { value: "confirm", name: "Chưa xác nhận", selected: false },
  ];

  return filterStatus;
};

module.exports.filterService = () => {
  const filterService = [
    { value: "", name: "Tất cả", selected: true },
    { value: "registered", name: "Đăng ký", selected: false },
    { value: "unregistered", name: "Chưa đăng ký", selected: false },
  ];

  return filterService;
};

module.exports.filterMounthYear = () => {
  let filterMounthYear = [{ value: "", name: "Tất cả", selected: true }];

  const year = dayjs().year();

  for (let i = 1; i <= 12; i++) {
    let my = dayjs(`${year}-${i}`).format("MM/YYYY");

    filterMounthYear.push({
      value: my,
      name: my,
      selected: false,
    });
  }

  return filterMounthYear;
};
