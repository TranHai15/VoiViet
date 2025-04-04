// # Cấu hình xác thực bằng Google OAuth2 và JWT

import axios from "axios";

// check xem co ketnoi dc vs backend hay ko

const checkWithAi = async () => {
  try {
    // const res = await axios.post(`${process.env.URL__AI}/ai`);
    const res = await axios.get(
      "https://c0a5-2405-4802-184a-f4b0-e4ca-f494-9dfc-3c2a.ngrok-free.app/upload"
    );
    // console.log("🚀 ~ checkWithAi ~ res:", res);
    // console.log("ket noi database", res.status);
    if (res.status == 200 || res.status == 201) {
      console.log("Ket noi thanh  cong okeokeo eok");
      return true;
    } else {
      console.log("Ket noi that bai");
      //   console.log("ket noi database", res.status);
      return false;
    }
  } catch (error) {
    // console.log(error);
    if (error.status == 200) {
      console.log("Ket noi thanhc ong catct");
      return true;
    } else {
      console.log("Ket noi that bai catch");
      return false;
    }
  }
};

export default checkWithAi;
