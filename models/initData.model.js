const PHONG = require("./PHONG.model");
const KHACH_THUE = require("./KHACH_THUE.model");
const CHUC_VU = require("./CHUC_VU.model");
const LOAI_PHONG = require("./LOAI_PHONG.model");
const NHA_TRO = require("./NHA_TRO.model");
const NHAN_VIEN = require("./NHAN_VIEN.model");
const THUE_PHONG = require("./THUE_PHONG.model");
const HOA_DON = require("./HOA_DON.model");
const DON_VI_TINH = require("./DON_VI_TINH.model");
const DICH_VU = require("./DICH_VU.model");
const SDDV = require("./SDDV.model");
const GHI_CHI_SO = require("./GHI_CHI_SO.model");
const CHUC_NANG = require("./CHUC_NANG.model");

module.exports.initTables = async () => {
  try {
    await KHACH_THUE.KHACH_THUE();
    await CHUC_VU.CHUC_VU();
    await LOAI_PHONG.LOAI_PHONG();
    await NHA_TRO.NHA_TRO();
    await PHONG.PHONG();
    await NHAN_VIEN.NHAN_VIEN();
    await THUE_PHONG.THUE_PHONG();
    await HOA_DON.HOA_DON();
    await DON_VI_TINH.DON_VI_TINH();
    await DICH_VU.DICH_VU();
    await SDDV.SDDV();
    await GHI_CHI_SO.GHI_CHI_SO();
    await CHUC_NANG.CHUC_NANG();
    console.log("success");
  } catch (error) {
    console.error("error", error.message);
  }
};
