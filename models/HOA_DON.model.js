const db = require("../config/database");

module.exports.HOA_DON = async () => {
  let q = `
    CREATE TABLE IF NOT EXISTS HOA_DON (
    HD_ID INT AUTO_INCREMENT PRIMARY KEY,
    HD_TONGTIEN INT CHECK(HD_TONGTIEN > 0) NOT NULL,
    HD_KHAUTRU INT CHECK(HD_KHAUTRU > 0) NOT NULL,
    HD_NGAYLAP DATE,
    HD_TRANGTHAI VARCHAR(50) DEFAULT "Unpaid",
    
    NV_ID INT NOT NULL,
    CONSTRAINT HD_NV FOREIGN KEY (NV_ID) REFERENCES NHAN_VIEN(NV_ID)
    )
    `;
  try {
    await db.query(q);
    console.log("Tao bang HOA_DON thanh cong");
  } catch (error) {
    console.log("Tao bang HOA_DON that bai");
  }
};
