const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.send("Chatbox Support is running!");
});


// Đọc dữ liệu từ file Excel
const workbook = XLSX.readFile(path.join(__dirname, 'faq.xlsx'));
const sheetName = workbook.SheetNames[0];
const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Tạo object lưu Q&A với chuẩn hóa lowercase + trim
let faqData = {};
sheet.forEach(row => {
    if (row['question'] && row['answer']) {
        const normalizedQ = row['question'].toString().trim().toLowerCase();
        faqData[normalizedQ] = row['answer'].toString().trim();
    }
});

// API chat
app.post('/chat', (req, res) => {
    let question = req.body.question || '';
    const normalizedQuestion = question.toString().trim().toLowerCase();

    let answer = faqData[normalizedQuestion] || "Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này.";
    // Xuống dòng khi hiển thị
    answer = answer.replace(/\n/g, '<br>');

    res.json({ answer });
});


// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
