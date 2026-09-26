const db = require("../config/database");

module.exports.PHONG = async () => {
  let q = `
  CREATE TABLE IF NOT EXISTS PHONG (
  P_ID INT AUTO_INCREMENT PRIMARY KEY,
  P_TEN VARCHAR(255) NOT NULL,
  P_SL INT CHECK(P_SL > 0) NOT NULL,
  P_GIA INT CHECK(P_GIA > 0) NOT NULL,
  P_DIENTICH DECIMAL(5, 2) CHECK(P_DIENTICH > 0) NOT NULL,
  P_TRANGTHAI VARCHAR(50) DEFAULT 'active',
  P_MOTA LONGTEXT,
  P_ANH LONGTEXT,
  P_NGAYTAO DATE,

  LP_ID INT NOT NULL,
  NT_ID INT NOT NULL,

  CONSTRAINT PHONG_LP FOREIGN KEY (LP_ID) REFERENCES LOAI_PHONG(LP_ID),
  CONSTRAINT PHONG_NT FOREIGN KEY (NT_ID) REFERENCES NHA_TRO(NT_ID)
  ) `;
  try {
    await db.query(q);
    console.log("Tao bang PHONG thanh cong");
  } catch (error) {
    console.log("Tao bang PHONG that bai", error);
  }
};
