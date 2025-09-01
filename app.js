import { auth, db } from "./firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  doc, setDoc, getDoc, updateDoc, arrayUnion 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ------------------- GLOBALS -------------------
let currentSubject = "General";
let flashcards = [];

// ------------------- SUBJECT -------------------
window.setSubject = (subject) => {
  currentSubject = subject;
  alert(`Switched subject to: ${subject}`);
};

// ------------------- LOGOUT -------------------
window.logout = async () => {
  await signOut(auth);
  window.location.href = "index.html";
};

// ------------------- AI CHAT -------------------
const API_KEY = "YOUR_GEMINI_API_KEY"; // <-- Replace with your Gemini key

window.sendMessage = async () => {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");
  const question = input.value.trim();
  if (!question) return;

  // Add user message
  chatBox.innerHTML += `<div class="text-right"><span class="bg-yellow-500 text-black px-3 py-1 rounded-lg">${question}</span></div>`;
  input.value = "";

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Subject: ${currentSubject}. Question: ${question}` }] }]
      })
    });

    const data = await response.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response";
    
    // Add AI reply
    chatBox.innerHTML += `<div class="text-left"><span class="bg-gray-200 text-black px-3 py-1 rounded-lg">${aiText}</span></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error("AI error:", err);
    chatBox.innerHTML += `<div class="text-left text-red-500">Error connecting to AI</div>`;
  }
};

// ------------------- FLASHCARDS -------------------
window.addFlashcard = async () => {
  const input = document.getElementById("flashcardInput");
  const text = input.value.trim();
  if (!text) return;

  flashcards.push(text);
  renderFlashcards();

  input.value = "";

  const user = auth.currentUser;
  if (user) {
    const userDoc = doc(db, "users", user.uid);
    await setDoc(userDoc, { flashcards: arrayUnion(text) }, { merge: true });
  }
};

function renderFlashcards() {
  const container = document.getElementById("flashcards");
  container.innerHTML = "";
  flashcards.forEach((card, index) => {
    container.innerHTML += `
      <div class="p-3 border rounded bg-yellow-50 shadow flex justify-between items-center">
        <span>${card}</span>
        <button onclick="removeFlashcard(${index})" class="text-red-500 hover:text-red-700">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  });
}

window.removeFlashcard = (index) => {
  flashcards.splice(index, 1);
  renderFlashcards();
};

window.downloadFlashcards = () => {
  const blob = new Blob([flashcards.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "flashcards.txt";
  a.click();
  URL.revokeObjectURL(url);
};

// ------------------- LOAD USER FLASHCARDS -------------------
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists() && docSnap.data().flashcards) {
    flashcards = docSnap.data().flashcards;
    renderFlashcards();
  }
});
