const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

// 미들웨어
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 설정 (배포 + 로컬 둘 다 허용)
const allowedOrigins = [
  process.env.FRONT_ORIGIN,   // 배포된 프론트 주소 (예: vercel.app)
  "http://localhost:5173"     // 로컬 개발
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS 차단됨: " + origin));
    }
  },
  credentials: true
}));

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("연결 성공");
  })
  .catch((error) => console.log("연결 실패", error));

// 라우트
const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api/auth", userRoutes);
app.use("/api/contact", contactRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Hello Express");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
