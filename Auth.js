// auth.js
import { auth, provider } from "./firebase-config.js";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Google login
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error("Google login error:", err.message);
    alert("Google login failed: " + err.message);
  }
}

// Email signup
export async function signupWithEmail(email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (err) {
    console.error("Signup error:", err.message);
    alert("Signup failed: " + err.message);
  }
}

// Email login
export async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (err) {
    console.error("Login error:", err.message);
    alert("Login failed: " + err.message);
  }
}

// Logout
export async function logoutUser() {
  try {
    await signOut(auth);
    alert("You have logged out.");
  } catch (err) {
    console.error("Logout error:", err.message);
  }
}
