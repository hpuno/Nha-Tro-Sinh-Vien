const db = require("../config/database");

module.exports.CHUC_NANG = async () => {
  let q = `
    CREATE TABLE IF NOT EXISTS CHUC_NANG (
    NV_ID INT NOT NULL,
    CV_ID INT NOT NULL,

    PRIMARY KEY (NV_ID, CV_ID),

    CN_TEN VARCHAR(255) NOT NULL,

    CONSTRAINT NV_CN FOREIGN KEY (NV_ID) REFERENCES NHAN_VIEN(NV_ID),
    CONSTRAINT CV_CN FOREIGN KEY (CV_ID) REFERENCES CHUC_VU(CV_ID)
    )
    `;
  try {
    await db.query(q);
    console.log("Tao bang CHUC_NANG thanh cong");
  } catch (error) {
    console.log("Tao bang CHUC_NANG that bai");
  }
};
