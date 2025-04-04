// Import express và sử dụng Router
import express from "express";
const router = express.Router(); // Tạo đối tượng router

// Import middlewares
import middlewares from "../middlewares/authenticateToken.js";

// Import file controller/userController
import dataUser from "../controllers/userController.js";

// Lấy toàn bộ người dùng
router.get("/", dataUser.getAllFreeUsers);
router.post("/", middlewares.verifyTokenAdmin, dataUser.getAllUsers);
router.post("/where", middlewares.verifyTokenAdmin, dataUser.Whersers);

router.get("/department", middlewares.verifyTokenAdmin, dataUser.Department);
router.post("/department", middlewares.verifyTokenAdmin, dataUser.Departments);
router.delete(
  "/department/:id",
  middlewares.verifyTokenAdmin,
  dataUser.deleteDepartments
);
router.post(
  "/departments",
  middlewares.verifyTokenAdmin,
  dataUser.updateDepartments
);
//  lấy toàn bộ thông báo
router.post(
  "/notifications",
  middlewares.verifyToken,
  dataUser.getAllNotification
);

// Lấy lịch sử chat của người dùng
router.post("/chat/", middlewares.verifyToken, dataUser.getAllChat);
router.post("/nof/", middlewares.verifyToken, dataUser.getAllNof);
router.post("/nofID/", middlewares.verifyToken, dataUser.getAllNofID);
router.get("/oneData/:id", middlewares.verifyToken, dataUser.getOneChat);
router.post(
  "/historyChat",
  middlewares.verifyToken,
  dataUser.getAllChatByIdRoom
);

//
router.post("/addNof", dataUser.addNof);

// Thêm dữ liệu vào database
router.post("/send/", middlewares.verifyToken, dataUser.insertMessageChat);

// Xóa người dùng
router.delete("/delete/:id", middlewares.verifyToken, dataUser.deleteUser);

// Điều hướng bất đăng nhập
// router.get("/lichsu", middlewares.verifyToken);

export default router;
