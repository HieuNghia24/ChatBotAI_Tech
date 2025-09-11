document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const input = document.getElementById("chat-input");
  const form = document.getElementById("chat-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    input.value = "";

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text })
      });
      const data = await res.json();
      appendMessage("bot", data.answer);
    } catch (err) {
      appendMessage("bot", "⚠️ Lỗi kết nối tới server.");
    }
  });

  function appendMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = sender === "user" ? "user-msg" : "bot-msg";
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});