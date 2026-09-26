const db = require("../config/database");

module.exports.SDDV = async () => {
  let q = `
    CREATE TABLE IF NOT EXISTS SDDV (
    SDDV_THANGNAM DATE,
    P_ID INT NOT NULL,
    DV_ID INT NOT NULL,
    SDDV_SL INT CHECK(SDDV_SL > 0),
    SDDV_TRANGTHAI VARCHAR(50) DEFAULT "active",

    PRIMARY KEY(SDDV_THANGNAM, P_ID, DV_ID),

    CONSTRAINT SDDV_PHONG FOREIGN KEY (P_ID) REFERENCES PHONG(P_ID),
    CONSTRAINT SDDV_DV FOREIGN KEY(DV_ID) REFERENCES DICH_VU(DV_ID)
    )`;
  try {
    await db.query(q);
    console.log("Tao bang SDDV thanh cong");
  } catch (error) {
    console.log("Tao bang SDDV that bai");
  }
};
