const express = require("express");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Cho phép frontend gọi API

// Serve static frontend (public/)
app.use(express.static(path.join(__dirname, "public")));

let faqData = [];

// ---- Hàm load FAQ ----
function loadFAQ() {
  try {
    const filePath = path.join(__dirname, "faq.xlsx");
    if (!fs.existsSync(filePath)) {
      console.warn("⚠️ File faq.xlsx không tồn tại. Chạy không có dữ liệu FAQ.");
      faqData = [];
      return;
    }
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    faqData = xlsx.utils.sheet_to_json(sheet);
    console.log(`✅ Đã load ${faqData.length} FAQ từ ${filePath}`);
  } catch (err) {
    console.error("❌ Lỗi load faq.xlsx:", err.message);
    faqData = [];
  }
}
loadFAQ();

// ---- API test ----
app.get("/ping", (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
});

// ---- API lấy toàn bộ FAQ ----
app.get("/faq", (req, res) => {
  res.json(faqData);
});

// ---- API tìm kiếm ----
app.get("/faq/search", (req, res) => {
  const keyword = (req.query.q || "").toLowerCase();
  if (!keyword) return res.status(400).json({ error: "Thiếu query ?q=" });

  const results = faqData.filter(
    item => item.question && item.question.toLowerCase().includes(keyword)
  );

  res.json({ keyword, results });
});

// ---- API reload FAQ ----
app.get("/faq/reload", (req, res) => {
  loadFAQ();
  res.json({ message: "FAQ reloaded", count: faqData.length });
});

// ---- API cho chatbox ----
app.post("/ask", (req, res) => {
  const question = (req.body.question || "").toLowerCase();
  if (!question) return res.json({ answer: "❌ Bạn chưa nhập câu hỏi." });

  const match = faqData.find(
    item => item.question && question.includes(item.question.toLowerCase())
  );

  if (match) {
    res.json({ answer: match.answer });
  } else {
    res.json({ answer: "🤖 Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này." });
  }
});

// ---- Start server ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});