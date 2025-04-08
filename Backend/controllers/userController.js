import User from "../models/User.js";
import axios from "axios";
import { setupSocket, getSocketIO } from "../socket.js"; // Import file Socket.io

// Quản lý người dùng
const dataUser = {
  getAllUsers: async (req, res) => {
    try {
      const { id, role_id } = req.body;
      if (id == 0) {
        if (!!id) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy người dùng." });
        }
      } else {
        if (!id) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy người dùng." });
        }
      }

      const dataAllUser = await User.getUsers(id, role_id);

      if (!dataAllUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
      return res.status(200).json(dataAllUser);
    } catch (error) {
      return res.status(500).json("Lỗi truy vấn dataUser");
    }
  },
  getAllFreeUsers: async (req, res) => {
    try {
      const dataAllUser = await User.getAllFreeUsers();

      if (!dataAllUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
      return res.status(200).json(dataAllUser);
    } catch (error) {
      return res.status(500).json("Lỗi truy vấn dataUser");
    }
  },
  Whersers: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
      const dataAllUser = await User.Whersers(id);

      if (!dataAllUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
      return res.status(200).json(dataAllUser);
    } catch (error) {
      return res.status(500).json("Lỗi truy vấn dataUser");
    }
  },
  Department: async (req, res) => {
    try {
      const dataAllUser = await User.getDepartment();

      if (!dataAllUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
      return res.status(200).json(dataAllUser);
    } catch (error) {
      return res.status(500).json("Lỗi truy vấn dataUser");
    }
  },
  Departments: async (req, res) => {
    try {
      const { name } = req.body;
      console.log("🚀 ~ Departments: ~ name:", name);
      if (!name) {
        return res.status(404).json({ message: "Vui long nhap name" });
      }
      const dataAllUser = await User.getDepartments(name);

      if (!dataAllUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
      return res.status(200).json(dataAllUser);
    } catch (error) {
      return res.status(500).json("Lỗi truy vấn dataUser");
    }
  },
  deleteDepartments: async (req, res) => {
    try {
      const id = req.params;
      console.log("🚀 ~ Departments: ~ name:", id);
      if (!id.id) {
        return res.status(404).json({ message: "Vui long nhap id" });
      }
      const dataAllUser = await User.deleteDepartments(id?.id);

      if (!dataAllUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
      return res.status(200).json(dataAllUser);
    } catch (error) {
      return res.status(500).json("Lỗi truy vấn dataUser");
    }
  },
  updateDepartments: async (req, res) => {
    try {
      const { id, name } = req.body;

      if (!id || !name) {
        return res.status(404).json({ message: "Vui long nhap id" });
      }
      const dataAllUser = await User.updateDepartments(id, name);

      if (!dataAllUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }
      return res.status(200).json(dataAllUser);
    } catch (error) {
      return res.status(500).json("Lỗi truy vấn dataUser");
    }
  },
  getAllNotification: async (req, res) => {
    try {
      const idUser = req.body.id;
      if (!idUser) {
        return res.status(400).json("ID người dùng là bắt buộc."); // Kiểm tra ID
      }

      const Notification = await User.getNotification(idUser);
      return res.status(200).json({ Notification });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi lay lich su chat", error: error.message });
    }
  },

  // Xóa người dùng
  deleteUser: async (req, res) => {
    try {
      const idUser = req.params.id; // Lấy id từ req.params thay vì req.body
      console.log("xóa người dùng ở controller");
      if (!idUser) {
        return res.status(400).json("ID người dùng là bắt buộc."); // Kiểm tra ID
      }
      const userName = await User.getName(idUser);
      // console.log("🚀 ~ deleteUser: ~ userName:", userName.username);
      const deleteCount = await User.delete(idUser); // Gọi hàm delete

      if (deleteCount > 0) {
        const io = getSocketIO();
        io.emit(userName.username, {
          status: true,
          type: true,
          message: "Tài khoản Bị xóa"
        });
        console.log("🚀 ~ deleteUser: ~ deleteCount:", deleteCount);
        return res
          .status(200)
          .json({ message: "Xóa thành công", deletedCount: deleteCount });
      } else {
        return res.status(404).json("Không tìm thấy người dùng để xóa.");
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi xóa người dùng", error: error.message });
    }
  },
  getAllChat: async (req, res) => {
    try {
      const idUser = req.body.id;
      // console.log(idUser);
      if (!idUser) {
        return res.status(400).json("ID người dùng là bắt buộc."); // Kiểm tra ID
      }

      const getChat = await User.getAllChat(idUser);
      // console.log("message: Lay thành công");
      return res.status(200).json({ getChat });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi lay lich su chat", error: error.message });
    }
  },
  getAllNof: async (req, res) => {
    try {
      const { id } = req.body;
      if (id == 0) {
        if (!!id) {
          return res.status(400).json("ID người dùng là bắt buộc."); // Kiểm tra ID
        }
      } else {
        if (!id) {
          return res.status(400).json("ID người dùng là bắt buộc."); // Kiểm tra ID
        }
      }
      const getChat = await User.getAllNoffition(id);
      // console.log("message: Lay thành công");
      return res.status(200).json({ getChat });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi lay lich su chat chi tiet",
        error: error.message
      });
    }
  },
  getAllNofID: async (req, res) => {
    try {
      const getChat = await User.getAllNoffitionID();
      // console.log("message: Lay thành công");
      return res.status(200).json({ getChat });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi lay lich su chat chi tiet",
        error: error.message
      });
    }
  },
  updateNofi: async (id, update_at) => {
    try {
      const idUser = id;
      console.log(idUser);
      if (!idUser) {
        return res.status(400).json("ID người dùng là bắt buộc."); // Kiểm tra ID
      }

      await User.updateNotifi(idUser, update_at);
    } catch (error) {
      console.log(error);
      // return res
      //   .status(500)
      //   .json({ message: "Lỗi lay lich su chat", error: error.message });
    }
  },
  getAllChatAdmin: async (req, res) => {
    try {
      const idUser = req.params.id;

      console.log(idUser);
      if (!idUser) {
        return res.status(400).json("ID chat là bắt buộc."); // Kiểm tra ID
      }

      const getChat = await User.getAllChatByIdChat_id(idUser);
      // console.log("message: Lay thành công");
      return res.status(200).json({ getChat });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi lay lich su chat chi tiet",
        error: error.message
      });
    }
  },
  getOneChat: async (req, res) => {
    try {
      const idUser = req.params.id; // Lấy id từ req.params thay vì req.body
      // console.log(idUser);
      if (!idUser) {
        return res.status(400).json("ID người dùng là bắt buộc."); // Kiểm tra ID
      }

      const getChat = await User.getAllChat(idUser);
      // console.log("message: Lay thành công");
      return res.status(200).json({ getChat });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Lỗi lay lich su chat", error: error.message });
    }
  },

  insertMessageChat: async (req, res) => {
    try {
      console.log("🚀 ~ insertMessageChat: ~ req.body:", req.body);
      const { room, message, id } = req.body;
      console.log("🚀 ~ insertMessageChat: ~ message:", message);
      const role = message.role;
      const title = message.content;
      const now = new Date();
      console.log({ role: role, title: title, room: room });
      // Kiểm tra phòng có tồn tại không
      const roomExists = await User.checkRoomExists(room);

      if (roomExists) {
        // Nếu phòng tồn tại, thêm tin nhắn vào bảng chi tiết
        const insertOneChat = await User.inssertOnechat(room, role, title, now);
        return res.status(200).json({
          success: true,
          message: "Đã thêm tin nhắn vào phòng hiện có",
          data: insertOneChat,
          title: title
        });
      } else {
        // Nếu phòng chưa tồn tại, tạo phòng mới và thêm tin nhắn
        const createRoom = await User.insertMessage(room, id, title, now); // Đảm bảo hàm insertMessage được định nghĩa
        if (createRoom) {
          const insertOneChat = await User.inssertOnechat(
            room,
            role,
            title,
            now
          );

          return res.status(200).json({
            success: true,
            message: "Phòng mới đã được tạo và tin nhắn đã được thêm",
            data: insertOneChat,
            title: title
          });
        } else {
          return res.status(500).json({
            success: false,
            message: "Không thể tạo phòng mới"
          });
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Lỗi lấy lịch sử chat",
        error: error.message
      });
    }
  },
  getAllChatByIdRoom: async (req, res) => {
    try {
      const idUser = req.body.id;
      console.log(idUser);
      if (!idUser) {
        return res.status(400).json("ID chat là bắt buộc."); // Kiểm tra ID
      }

      const getChat = await User.getAllChatByIdChat_id(idUser);
      // console.log("message: Lay thành công");
      return res.status(200).json({ getChat });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi lay lich su chat chi tiet",
        error: error.message
      });
    }
  },
  addNof: async (req, res) => {
    try {
      const { tasks, user_id } = req.body;
      console.log("🚀 ~ addNof: ~ tasks:", tasks);
      console.log("🚀 ~ addNof: ~ user_id:", user_id);

      // Kiểm tra dữ liệu đầu vào
      if (!tasks) {
        return res.status(400).json({ message: "Dữ liệu là bắt buộc." });
      }

      // // Chèn thông báo vào database và nhận mảng username
      const getChat = await User.insertNof(tasks, user_id);
      console.log("🚀 ~ addNof: ~ getChat:", getChat);

      // Loại bỏ các giá trị trùng lặp
      const uniqueUsernames = [...new Set(getChat)];
      console.log("✅ Danh sách username duy nhất:", uniqueUsernames);

      const io = getSocketIO();

      uniqueUsernames.forEach((username) => {
        // console.log("🚀 ~ uniqueUsernames.forEach ~ username:", username);
        io.emit(username, {
          status: true,
          type: false,
          message: "Cập nhật thông báo mới"
        });
      });

      res
        .status(200)
        .json({ success: true, message: "Thêm thông báo thành công." });

      // Gửi sự kiện qua Socket.IO cho tất cả người dùng đang kết nối
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi thêm thông báo", error: error.message });
    }
  }
};

export default dataUser;
