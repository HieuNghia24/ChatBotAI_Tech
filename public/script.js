document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const messages = document.getElementById("messages");

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = sender === "user" ? "msg user" : "msg bot";
    msg.innerText = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    addMessage(question, "user");
    input.value = "";

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      addMessage(data.answer, "bot");
    } catch (err) {
      addMessage("❌ Lỗi kết nối tới server.", "bot");
    }
  });
});