import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { setupSocket } from "./socket.js"; // Import file Socket.io

dotenv.config(); // Đọc biến môi trường từ .env

const app = express();
const server = createServer(app); // Tạo HTTP server để dùng chung cho Express và

setupSocket(server); // Thiết lập WebSocket

// Xác định đường dẫn thư mục gốc
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware hỗ trợ CORS, Cookie, JSON
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Cung cấp tệp tĩnh (hình ảnh, tệp tải lên)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import và sử dụng các Router

// liên quan đến tài khoản
import authRouter from "./routes/authRoutes.js";
//  Liên quan đến thông tin người dùng client
import userRouter from "./routes/userRouter.js";
// Liên quan đến người dùng admin
import dataRouter from "./routes/dataRoutes.js";
// Liên quan đến file Admin
import fileRouter from "./routes/fileRouter.js";

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/api", dataRouter);
app.use("/file", fileRouter);

// Route kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
