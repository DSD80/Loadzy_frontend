document.addEventListener("DOMContentLoaded", async () => {
  const body = document.querySelector(".chat-body");
  const input = document.querySelector(".chat-input input");
  const sendButton = document.querySelector(".chat-input .attach");
  const user = LoadzyAPI.user();
  const room = user?.role === "admin" ? "helpdesk:admin" : `helpdesk:${user?.role || "driver"}:${user?._id || "guest"}`;
  let socket;

  function renderMessage(message) {
    const div = document.createElement("div");
    const mine = message.senderRole === user?.role && String(message.sender) === String(user?._id);
    div.className = `chat-message ${mine ? "yellow" : "orange"}`;
    div.innerHTML = `${message.text || ""}<span class="time">${new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>`;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  try {
    const { messages } = await LoadzyAPI.request(`/api/chat/messages?room=${encodeURIComponent(room)}`);
    // body.innerHTML = "";
    messages.forEach(renderMessage);
  } catch (_err) {
    // body.innerHTML = "";
  }

  if (window.io && LoadzyAPI.token()) {
    socket = io(LOADZY_API_URL, { auth: { token: LoadzyAPI.token() } });
    socket.emit("chat:join", room);
    socket.on("chat:message", renderMessage);
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    if (socket?.connected) {
      socket.emit("chat:send", { room, text });
      return;
    }

    try {
      const { message } = await LoadzyAPI.request("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify({ room, text })
      });
      renderMessage(message);
    } catch (err) {
      alert(err.message);
    }
  }

  sendButton?.addEventListener("click", sendMessage);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
