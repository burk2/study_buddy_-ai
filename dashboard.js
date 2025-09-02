const subject = localStorage.getItem("selectedSubject") || "STEM";
document.getElementById("subjectTitle").innerText = subject;

const chatWindow = document.getElementById("chatWindow");
const historyList = document.getElementById("historyList");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let history = JSON.parse(localStorage.getItem(subject + "_history")) || [];

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = `Q${index + 1}: ${item.q}`;
    li.className = "cursor-pointer hover:underline";
    li.onclick = () => loadConversation(index);
    historyList.appendChild(li);
  });
}

function renderMessages(messages) {
  chatWindow.innerHTML = "";
  messages.forEach(msg => {
    let div = document.createElement("div");
    div.className = "message " + (msg.role === "user" ? "user" : "ai");
    div.textContent = msg.content;
    chatWindow.appendChild(div);
  });
}

function loadConversation(index) {
  renderMessages(history[index].messages);
}

sendBtn.addEventListener("click", () => {
  const question = userInput.value.trim();
  if (!question) return;

  const conversation = { q: question, messages: [] };
  conversation.messages.push({ role: "user", content: question });

  // Dummy AI response (replace later with Gemini)
  const aiResponse = "This is an AI-generated explanation for: " + question;

  conversation.messages.push({ role: "ai", content: aiResponse });
  history.push(conversation);

  localStorage.setItem(subject + "_history", JSON.stringify(history));
  renderHistory();
  renderMessages(conversation.messages);

  userInput.value = "";
});

document.getElementById("downloadFlashcards").addEventListener("click", () => {
  let flashcards = history.map(item => `Q: ${item.q}\nA: ${item.messages[1]?.content || ""}`).join("\n\n");
  let blob = new Blob([flashcards], { type: "text/plain" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = subject + "_flashcards.txt";
  link.click();
});

renderHistory();
