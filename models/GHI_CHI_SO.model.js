const db = require("../config/database");

module.exports.GHI_CHI_SO = async () => {
  let q = `
    CREATE TABLE IF NOT EXISTS GHI_CHI_SO (
    GCS_THANGNAM DATE NOT NULL,
    GCS_DIEN DECIMAL(10, 2) CHECK(GCS_DIEN >= 0) NOT NULL,
    GCS_NUOC DECIMAL(10, 2) CHECK(GCS_NUOC >= 0) NOT NULL,
    GCS_ANH_DIEN LONGTEXT,
    GCS_ANH_NUOC LONGTEXT,

    NV_ID INT NOT NULL,
    TP_ID INT NOT NULL,

    PRIMARY KEY (GCS_THANGNAM, TP_ID),
    
    CONSTRAINT NV_GCS FOREIGN KEY (NV_ID) REFERENCES NHAN_VIEN(NV_ID),
    CONSTRAINT TP_GCS FOREIGN KEY (TP_ID) REFERENCES THUE_PHONG(TP_ID)
    )`;
  try {
    await db.query(q);
    console.log("Tao bang GHI_CHI_SO thanh cong");
  } catch (error) {
    console.log("Tao bang GHI_CHI_SO that bai");
  }
};
