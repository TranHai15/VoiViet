import axios from "axios";
import { showNotification } from "../func/index.js";
import { jwtDecode } from "jwt-decode";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BACKEND}`,
  headers: {
    "Content-Type": "application/json"
  }
});

//  chức năng lấy ra các thông tin user
const getDataLocalStorage = () => {
  const activeUser = JSON.parse(localStorage.getItem("active"));
  const accessToken = activeUser?.dataLogin?.accessToken;
  const refreshToken = activeUser?.dataLogin?.refreshToken;
  const phong_ban_id = activeUser?.dataLogin?.dataUser?.phong_ban_id;
  const decoded = jwtDecode(accessToken);
  const { role_id } = decoded;
  const id = activeUser?.dataLogin?.dataUser?.id;
  const dataUser = activeUser?.dataLogin?.dataUser;
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
    phong_ban_id: phong_ban_id,
    id: id,
    dataUser: dataUser,
    role_id: role_id
  };
};
const logout = async (id) => {
  const res = await axiosClient.post("/auth/logout", { id: id });
  if (res.status === 200 || res.status == 201) {
    const data = {
      data: {
        dataUser: "",
        refreshToken: "",
        accessToken: ""
      },
      isLogin: false
    };
    localStorage.setItem("active", JSON.stringify(data));
  } else {
    showNotification("Đăng  Xuat Không thành công!", "error");
  }
};
const loadHome = async (message, type = "error") => {
  const data = getDataLocalStorage();
  const id = data?.id;
  await logout(id);
  showNotification(message, type);
  localStorage.removeItem("active");
  setTimeout(() => {
    window.location.href = "/login";
  }, 3000);
};

const refreshAccessToken = async () => {
  // Lay du lieu tu localStorage
  const data = getDataLocalStorage();
  // kiem ra xem ton tai khong
  if (!data.id || !data.refreshToken) {
    console.error("ID or refreshToken is missing in localStorage");
    return null;
  }
  try {
    // console.log("cap lai token");
    const response = await axiosClient.post("/auth/refresh", {
      id: data.id,
      refreshToken: data.refreshToken
    });
    if (response.status !== 200) {
      console.error(`Failed to refresh token: ${response.statusText}`);
      return null;
    }
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Cập nhật lại dữ liệu trong localStorage
    const updatedUserData = {
      isLogin: true,
      dataLogin: {
        dataUser: data.dataUser,
        accessToken: accessToken,
        refreshToken: newRefreshToken
      }
    };
    localStorage.setItem("active", JSON.stringify(updatedUserData));

    return { accessToken, newRefreshToken }; // Trả về cả accessToken và refreshToken mới
  } catch (error) {
    if (error.response.data.code === "REFRESH_TOKEN_EXPIRED") {
      // loadHome("Vui Lòng Đăng Nhập Lại");
      // alert("hihi");
      // return null;
    }
    return null;
  }
};

// Interceptor để thêm accessToken vào header
axiosClient.interceptors.request.use(
  function (config) {
    // Kiểm tra xem URL có phải là /login, /register, hoặc /reftoken không bỏ qua nếu là các url này
    if (
      config.url !== "auth/login" &&
      config.url !== "auth/register" &&
      config.url !== "auth/refresh"
    ) {
      const data = getDataLocalStorage();
      // console.log("🚀 ~ data:", data);
      // Kiểm tra nếu không có accessToken, chuyển hướng đến trang login hoặc xử lý lỗi
      if (!data.accessToken) {
        showNotification(
          "Phiên đã hết hạn, vui lòng đăng nhập lại. 1",
          "error"
        );
        // loadHome();
        return Promise.reject("No access token found, please log in.");
      }

      // Nếu có accessToken, thêm vào header Authorization
      config.headers["Authorization"] = `Bearer ${data?.accessToken}`;
      config.headers["MS"] = data.id;
      //  Tạo đối tượng để gửi dữ liệu mỗi lần gửi lên
      // const user = {
      //   a: data.id,
      //   b: data.phong_ban_id,
      //   c: data.role_id
      // };
      // if (["post", "put", "patch"].includes(config.method.toLowerCase())) {
      //   console.log({ ...config.data });
      //   config.data = { ...config.data, data: user };
      // }
    }
    return config;
  },
  function (error) {
    // Xử lý lỗi request
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
axiosClient.interceptors.response.use(
  function (response) {
    // Xử lý dữ liệu phản hồi nếu cần
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    // Kiểm tra nếu lỗi là do token hết hạn (errorCode: TOKEN_EXPIRED)
    try {
      if (
        error.response.status === 401 &&
        error.response.data?.errorCode === "TOKEN_EXPIRED" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const res = await refreshAccessToken();
        if (!res || !res.accessToken) {
          originalRequest._retry = false;
          showNotification(
            "Phiên đã hết hạn, vui lòng đăng nhập lại.",
            "error"
          );
          // Gọi hàm loadHome để đăng xuất và chuyển hướng (hoặc gọi logout trực tiếp)
          await loadHome("Phiên đã hết hạn, vui lòng đăng nhập lại.", "error");
          return Promise.reject(error);
        }
        if (res.accessToken) {
          // Nếu có accessToken mới, cập nhật lại header và gọi lại request cũ
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${res.accessToken}`;
          return axiosClient(originalRequest); // Gọi lại request ban đầu với accessToken mới
        } else {
          // Nếu không có token mới, chuyển hướng đến login
          // alert("Token đã hết hạn, vui lòng đăng nhập lại.");
          showNotification(
            "Phiên đã hết hạn, vui lòng đăng nhập lại.5",
            "error"
          );
          // Gọi hàm loadHome để đăng xuất và chuyển hướng (hoặc gọi logout trực tiếp)
          // await loadHome("Phiên đã hết hạn, vui lòng đăng nhập lại.", "error");
          return Promise.reject(error);
        }
      }

      // Nếu không phải lỗi token hết hạn, tiếp tục xử lý bình thường
      return Promise.reject(error);
    } catch (error) {
      console.log(error);
      // showNotification("Phiên đã hết hạn, vui lòng đăng nhập lại.3", "error");
    }
  }
);

export default axiosClient;
