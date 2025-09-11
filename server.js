import express from "express";
import path from "path";
import fs from "fs";
import XLSX from "xlsx";

const app = express();
const PORT = process.env.PORT || 10000;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let faqData = [];

function loadFAQ() {
  const filePath = path.join(__dirname, "faq.xlsx");
  if (!fs.existsSync(filePath)) {
    console.warn("⚠️ Không tìm thấy file faq.xlsx");
    return;
  }
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  faqData = XLSX.utils.sheet_to_json(sheet);
  console.log(`✅ Đã load ${faqData.length} FAQ từ ${filePath}`);
}
loadFAQ();

// API nhận câu hỏi
app.post("/ask", (req, res) => {
  const { question } = req.body;
  if (!question) return res.json({ answer: "❌ Không có câu hỏi." });

  let found = faqData.find(item =>
    item.question.toLowerCase().includes(question.toLowerCase())
  );

  if (found) {
    return res.json({ answer: found.answer });
  } else {
    return res.json({ answer: "❓ Không tìm thấy câu trả lời phù hợp." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});