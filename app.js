import { auth, db } from "./firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Ensure user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadFlashcards(user.uid);
  }
});

// ✅ Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// ---------------- AI CHAT ----------------
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");

sendChat.addEventListener("click", async () => {
  const question = chatInput.value.trim();
  if (!question) return;

  // Display user message
  const userMsg = document.createElement("div");
  userMsg.className = "text-right text-yellow-400";
  userMsg.textContent = "You: " + question;
  chatBox.appendChild(userMsg);

  chatInput.value = "";

  // Fake AI response for now (replace with Gemini API later)
  const aiMsg = document.createElement("div");
  aiMsg.className = "text-left text-green-400";
  aiMsg.textContent = "AI: That's an interesting question about STEM!";
  chatBox.appendChild(aiMsg);

  chatBox.scrollTop = chatBox.scrollHeight;
});

// ---------------- FLASHCARDS ----------------
const addFlashcardBtn = document.getElementById("addFlashcard");
const flashcardList = document.getElementById("flashcardList");
const downloadBtn = document.getElementById("downloadFlashcards");

async function loadFlashcards(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists() && userSnap.data().flashcards) {
    displayFlashcards(userSnap.data().flashcards);
  }
}

addFlashcardBtn.addEventListener("click", async () => {
  const question = document.getElementById("flashQuestion").value.trim();
  const answer = document.getElementById("flashAnswer").value.trim();

  if (!question || !answer) return alert("Please enter both question and answer.");

  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    flashcards: arrayUnion({ question, answer })
  }).catch(async () => {
    // If flashcards field doesn't exist yet
    await setDoc(userRef, { flashcards: [{ question, answer }] }, { merge: true });
  });

  displayFlashcards([{ question, answer }], true);

  document.getElementById("flashQuestion").value = "";
  document.getElementById("flashAnswer").value = "";
});

function displayFlashcards(cards, append = false) {
  if (!append) flashcardList.innerHTML = "";
  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "bg-gray-800 p-2 rounded text-white";
    div.innerHTML = `<b>Q:</b> ${card.question} <br><b>A:</b> ${card.answer}`;
    flashcardList.appendChild(div);
  });
}

// ✅ Download as JSON
downloadBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists() && userSnap.data().flashcards) {
    const flashcards = userSnap.data().flashcards;
    const blob = new Blob([JSON.stringify(flashcards, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "flashcards.json";
    a.click();
    URL.revokeObjectURL(url);
  } else {
    alert("No flashcards to download.");
  }
});
