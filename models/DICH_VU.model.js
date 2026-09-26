const db = require("../config/database");

module.exports.DICH_VU = async () => {
  let q = `
    CREATE TABLE IF NOT EXISTS DICH_VU (
    DV_ID INT AUTO_INCREMENT PRIMARY KEY,
    DV_TEN VARCHAR(255) NOT NULL,
    DV_GIA INT CHECK(DV_GIA > 0) NOT NULL,

    DVT_ID INT NOT NULL,
    CONSTRAINT DVT_DV FOREIGN KEY (DVT_ID) REFERENCES DON_VI_TINH(DVT_ID)
    )
    `;
  try {
    await db.query(q);
    console.log("Tao bang DICH_VU thanh cong");
  } catch (error) {
    console.log("Tao bang DICH_VU that bai");
  }
};
