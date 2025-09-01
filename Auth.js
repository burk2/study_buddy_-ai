import { auth } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Email signup
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created!");
      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// Email login
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// Google Auth (login/signup)
const googleProvider = new GoogleAuthProvider();
const googleLoginBtn = document.getElementById("googleLoginBtn");
const googleSignupBtn = document.getElementById("googleSignupBtn");

function googleAuth() {
  signInWithPopup(auth, googleProvider)
    .then(() => {
      alert("Google login successful!");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
}

if (googleLoginBtn) googleLoginBtn.addEventListener("click", googleAuth);
if (googleSignupBtn) googleSignupBtn.addEventListener("click", googleAuth);
