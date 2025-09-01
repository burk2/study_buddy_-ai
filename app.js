// app.js
import { auth } from "./firebase-config.js";
import { 
  loginWithGoogle, signupWithEmail, loginWithEmail, logoutUser 
} from "./auth.js";
import { saveFlashcards, loadFlashcards } from "./firestore.js";

// ✅ Navigation helpers
function goTo(page) {
  window.location.href = page;
}

// ========== AUTH ==========
// Google login
const googleLoginBtn = document.getElementById("googleLogin");
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    const user = await loginWithGoogle();
    if (user) goTo("subscription.html");
  });
}

// Email signup
const signupForm = document.getElementById("emailSignupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const user = await signupWithEmail(email, password);
    if (user) goTo("subscription.html");
  });
}

// Email login
const loginBtn = document.getElementById("emailLoginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = prompt("Enter email:");
    const password = prompt("Enter password:");
    const user = await loginWithEmail(email, password);
    if (user) goTo("subscription.html");
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await logoutUser();
    goTo("index.html");
  });
}

// ========== GEMINI API
