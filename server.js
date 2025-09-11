const express = require("express");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

const app = express();
app.use(express.json());

// ---- Load FAQ từ file Excel ----
let faqData = [];

function loadFAQ() {
  try {
    const filePath = path.join(__dirname, "faq.xlsx");

    if (!fs.existsSync(filePath)) {
      console.warn("⚠️  File faq.xlsx không tồn tại. Server sẽ chạy mà không có dữ liệu FAQ.");
      faqData = [];
      return;
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    faqData = xlsx.utils.sheet_to_json(sheet);

    console.log(`✅ Đã load ${faqData.length} FAQ từ ${filePath}`);
  } catch (err) {
    console.error("❌ Lỗi khi load faq.xlsx:", err.message);
    faqData = [];
  }
}

// Gọi khi khởi động
loadFAQ();

// ---- Root endpoint ----
app.get("/", (req, res) => {
  res.send("✅ Chatbox Support API is running. Try /ping, /faq or /faq/search?q=...");
});

// ---- Endpoint kiểm tra server ----
app.get("/ping", (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
});

// ---- Endpoint lấy toàn bộ FAQ ----
app.get("/faq", (req, res) => {
  if (faqData.length === 0) {
    return res.json({ message: "Chưa có dữ liệu FAQ" });
  }
  res.json(faqData);
});

// ---- Endpoint tìm câu trả lời theo keyword ----
app.get("/faq/search", (req, res) => {
  const keyword = (req.query.q || "").toLowerCase();
  if (!keyword) {
    return res.status(400).json({ error: "Thiếu tham số q" });
  }

  const results = faqData.filter(item =>
    item.question && item.question.toLowerCase().includes(keyword)
  );

  res.json({ keyword, results });
});

// ---- Endpoint reload FAQ thủ công ----
app.get("/faq/reload", (req, res) => {
  loadFAQ();
  res.json({ message: "FAQ reloaded", count: faqData.length });
});

// ---- Khởi động server ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});