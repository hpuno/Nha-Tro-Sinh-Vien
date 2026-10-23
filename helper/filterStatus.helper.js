const NHA_TRO = require("../models/NHA_TRO.model");

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
    { value: "0-1", name: "Dưới 1 triệu", selected: false },
    { value: "1-2", name: "Từ 1 - 2 triệu", selected: false },
    { value: "2-3", name: "Từ 2 - 3 triệu", selected: false },
    { value: "3-4", name: "Từ 3 - 4 triệu", selected: false },
    { value: "5-100", name: "Trên 5 triệu", selected: false },
  ];

  return filterPrice;
};
