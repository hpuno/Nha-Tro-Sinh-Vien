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
