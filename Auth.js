import { auth, db } from "./firestore.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---------------- SIGN UP ----------------
window.signup = async () => {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store basic user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
      subscription: { active: false }
    });

    alert("Signup successful!");
    window.location.href = "subscription.html";
  } catch (error) {
    alert(error.message);
    console.error("Signup error:", error.message);
  }
};

// ---------------- LOGIN ----------------
window.login = async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "subscription.html";
  } catch (error) {
    alert(error.message);
    console.error("Login error:", error.message);
  }
};

// ---------------- GOOGLE SIGN-IN ----------------
window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user info in Firestore if new
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: new Date(),
      subscription: { active: false }
    }, { merge: true });

    alert("Google login successful!");
    window.location.href = "subscription.html";
  } catch (error) {
    alert(error.message);
    console.error("Google login error:", error.message);
  }
};
