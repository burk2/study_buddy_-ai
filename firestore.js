// Firebase Core + Services
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// 🔹 Your Firebase Config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBoUzc3gd8juDrfaFrIQg2mDK2lzqcUEQ4",
  authDomain: "study-buddy-ai-7ec93.firebaseapp.com",
  databaseURL: "https://study-buddy-ai-7ec93-default-rtdb.firebaseio.com",
  projectId: "study-buddy-ai-7ec93",
  storageBucket: "study-buddy-ai-7ec93.appspot.com",
  messagingSenderId: "373071601542",
  appId: "1:373071601542:web:f43ae825680a2652b75607",
  measurementId: "G-51V3434CTD"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔹 Export Auth & Firestore so other files can use them
export const auth = getAuth(app);
export const db = getFirestore(app);
