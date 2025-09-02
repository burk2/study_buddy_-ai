// dashboard.js

const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");
const historyBox = document.getElementById("history");
const flashBtn = document.getElementById("flashBtn");

let subject = localStorage.getItem("selectedSubject") || "General";
let history = JSON.parse(localStorage.getItem(subject + "_history")) || [];
let questionCount = parseInt(localStorage.getItem("questionCount_" + subject)) || 0;

// 🔹 Render chat messages
function renderMessages(messages) {
  chatBox.innerHTML = "";
  messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = msg.role === "user" ? "text-right mb-2" : "text-left mb-2";
    div.innerHTML = `<span class="inline-block px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-yellow-500 text-black" : "bg-gray-700 text-yellow-400"}">${msg.content}</span>`;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🔹 Render conversation history
function renderHistory() {
  historyBox.innerHTML = "";
  history.forEach((conv, idx) => {
    const btn = document.createElement("button");
    btn.className = "block w-full text-left px-2 py-1 hover:bg-gray-800";
    btn.textContent = conv.q;
    btn.onclick = () => renderMessages(conv.messages);
    historyBox.appendChild(btn);
  });
}

// 🔹 Handle sending user question
sendBtn.addEventListener("click", async () => {
  const question = userInput.value.trim();
  if (!question) return;

  // Limit free users
  if (questionCount >= 10 && !localStorage.getItem("subscribed")) {
    alert("⚠️ Free limit reached. Please subscribe to continue.");
    document.getElementById("subscriptionPopup").classList.remove("hidden");
    return;
  }

  const conversation = { q: question, messages: [] };
  conversation.messages.push({ role: "user", content: question });
  renderMessages(conversation.messages);

  try {
    const res = await fetch("/.netlify/functions/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, subject }),
    });

    const data = await res.json();
    const aiResponse = data.answer || "⚠️ No response from AI.";

    conversation.messages.push({ role: "ai", content: aiResponse });
    history.push(conversation);

    // Save history
    localStorage.setItem(subject + "_history", JSON.stringify(history));

    // Increase count
    questionCount++;
    localStorage.setItem("questionCount_" + subject, questionCount);

    renderHistory();
    renderMessages(conversation.messages);
  } catch (error) {
    conversation.messages.push({ role: "ai", content: "⚠️ Error: " + error.message });
    renderMessages(conversation.messages);
  }

  userInput.value = "";
});

// 🔹 Flashcards: download as TXT
flashBtn.addEventListener("click", () => {
  let flashcards = history.map(h => `Q: ${h.q}\nA: ${h.messages.find(m => m.role === "ai")?.content || "No answer"}\n`).join("\n---\n");
  const blob = new Blob([flashcards], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${subject}_flashcards.txt`;
  a.click();
});

// 🔹 Initial load
renderHistory();
