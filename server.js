// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import xlsx from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware đọc JSON
app.use(express.json());

// Serve file tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, "public")));

// Load dữ liệu FAQ từ Excel
const workbook = xlsx.readFile(path.join(__dirname, "faq.xlsx"));
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const faqs = xlsx.utils.sheet_to_json(sheet);

// API xử lý câu hỏi
app.post("/api/ask", (req, res) => {
  const question = req.body.question?.toLowerCase() || "";
  let answer = "Xin lỗi, tôi chưa có câu trả lời phù hợp.";

  for (const faq of faqs) {
    if (faq.question && question.includes(faq.question.toLowerCase())) {
      answer = faq.answer;
      break;
    }
  }

  res.json({ answer });
});

// Route mặc định trả về index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});