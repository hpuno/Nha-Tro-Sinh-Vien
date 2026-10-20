module.exports.filter = () => {
  const filterStatus = [
    { value: "", name: "Tất cả", selected: true },
    { value: "active", name: "Hoạt động", selected: false },
    { value: "inactive", name: "Dừng hoạt động", selected: false },
  ];

  return filterStatus;
};
