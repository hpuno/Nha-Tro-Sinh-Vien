const excel = require("exceljs");

module.exports.exportTenant = async (title, row) => {
  const workbook = new excel.Workbook();
  const worksheeet = workbook.addWorksheet(title);

  const columns = [
    { header: "ID", key: "KT_ID" },
    { header: "Họ và tên", key: "KT_TEN" },
    { header: "Email", key: "KT_EMAIL" },
    { header: "Số điện thoại", key: "KT_SDT" },
    { header: "Căn cước", key: "KT_CCCD" },
    { header: "Phái", key: "KT_PHAI" },
    { header: "Trạng thái", key: "KT_TRANGTHAI" },
    { header: "Ngày tạo", key: "KT_NGAYTAO" },
  ];

  worksheeet.columns = columns;

  row.forEach((item) => {
    worksheeet.addRow({
      KT_ID: item.KT_ID,
      KT_TEN: item.KT_TEN,
      KT_EMAIL: item.KT_EMAIL,
      KT_SDT: item.KT_SDT,
      KT_CCCD: item.KT_CCCD,
      KT_PHAI: item.KT_PHAI,
      KT_TRANGTHAI: item.KT_TRANGTHAI,
      KT_NGAYTAO: item.KT_NGAYTAO,
    });
  });

  const file = `public/upload/${title}.xlsx`;
  await workbook.xlsx.writeFile(file);
  return file;
};

module.exports.exportHousing = async (title, row) => {
  const workbook = new excel.Workbook();
  const worksheeet = workbook.addWorksheet(title);

  const columns = [
    { header: "ID", key: "NT_ID" },
    { header: "Nhà trọ", key: "NT_TEN" },
    { header: "Địa chỉ", key: "NT_DIACHI" },
    { header: "Mô tả", key: "NT_MOTA" },
    { header: "Trạng thái", key: "NT_TRANGTHAI" },
    { header: "Ngày tạo", key: "NT_NGAYTAO" },
  ];

  worksheeet.columns = columns;

  row.forEach((item) => {
    worksheeet.addRow({
      NT_ID: item.NT_ID,
      NT_TEN: item.NT_TEN,
      NT_DIACHI: item.NT_DIACHI,
      NT_MOTA: item.NT_MOTA,
      NT_TRANGTHAI: item.NT_TRANGTHAI,
      NT_NGAYTAO: item.NT_NGAYTAO,
    });
  });

  const file = `public/upload/${title}.xlsx`;
  await workbook.xlsx.writeFile(file);
  return file;
};

module.exports.exportEmployee = async (title, row) => {
  const workbook = new excel.Workbook();
  const worksheeet = workbook.addWorksheet(title);

  const columns = [
    { header: "ID", key: "NV_ID" },
    { header: "Họ và tên", key: "NV_TEN" },
    { header: "Email", key: "NV_EMAIL" },
    { header: "Số điện thoại", key: "NV_SDT" },
    { header: "Căn cước", key: "NV_CCCD" },
    { header: "Mã số thuế", key: "NV_MASO_THUE" },
    { header: "Phái", key: "NV_PHAI" },
    { header: "Trạng thái", key: "NV_TRANGTHAI" },
    { header: "Ngày tạo", key: "NV_NGAYTAO" },
  ];

  worksheeet.columns = columns;

  row.forEach((item) => {
    worksheeet.addRow({
      NV_ID: item.NV_ID,
      NV_TEN: item.NV_TEN,
      NV_EMAIL: item.NV_EMAIL,
      NV_SDT: item.NV_SDT,
      NV_CCCD: item.NV_CCCD,
      NV_MASO_THUE: item.NV_MASO_THUE,
      NV_PHAI: item.NV_PHAI,
      NV_TRANGTHAI: item.NV_TRANGTHAI,
      NV_NGAYTAO: item.NV_NGAYTAO,
    });
  });

  const file = `public/upload/${title}.xlsx`;
  await workbook.xlsx.writeFile(file);
  return file;
};

module.exports.exportPermission = async (title, row) => {
  const workbook = new excel.Workbook();
  const worksheeet = workbook.addWorksheet(title);

  const columns = [
    { header: "NV_TEN", key: "NV_TEN" },
    { header: "CV_TEN", key: "CV_TEN" },
    { header: "NT_TEN", key: "NT_TEN" },
  ];

  worksheeet.columns = columns;

  row.forEach((item) => {
    worksheeet.addRow({
      NV_TEN: item.NV_TEN,
      CV_TEN: item.CV_TEN,
      NT_TEN: item.NT_TEN,
    });
  });

  const file = `public/upload/${title}.xlsx`;
  await workbook.xlsx.writeFile(file);
  return file;
};
