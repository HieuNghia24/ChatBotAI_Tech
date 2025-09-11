document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("user-input");
  const question = input.value.trim();
  if (!question) return;

  addMessage(question, "user");
  input.value = "";

  try {
    const res = await fetch("/ask", {   // dùng relative path
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();
    addMessage(data.answer, "bot");
  } catch (err) {
    addMessage("❌ Lỗi kết nối tới server.", "bot");
  }
});

function addMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "user-msg" : "bot-msg";
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}