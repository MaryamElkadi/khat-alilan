import express from "express";
import multer from "multer";
import path from "path";

const app = express();

// إعداد مكان تخزين الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // نخزن الصور هنا
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // اسم الصورة = timestamp + الامتداد
  },
});

const upload = multer({ storage });

// نسمح بقراءة الصور مباشرة من /uploads
app.use("/uploads", express.static("public/uploads"));

// API لرفع صورة
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // الرابط اللي يتخزن في DB
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// شغل السيرفر
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
