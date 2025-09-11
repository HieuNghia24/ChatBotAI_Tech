// public/script.js

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

// Thêm tin nhắn vào giao diện
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "msg user" : "msg bot";
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Gửi câu hỏi đến API
async function sendMessage() {
  const question = input.value.trim();
  if (!question) return;

  addMessage(question, "user");
  input.value = "";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    addMessage(data.answer, "bot");
  } catch (err) {
    addMessage("❌ Lỗi kết nối server!", "bot");
  }
}

// Xử lý sự kiện
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});