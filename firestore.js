// firestore.js
import { db } from "./firebase-config.js";
import { 
  collection, 
  addDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth } from "./firebase-config.js";

// Save flashcards
export async function saveFlashcards(subject, topic, cards) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first to save your flashcards.");
    return;
  }

  try {
    await addDoc(collection(db, "users", user.uid, "flashcards"), {
      subject,
      topic,
      cards,
      createdAt: new Date()
    });
    console.log("Flashcards saved!");
  } catch (err) {
    console.error("Error saving flashcards:", err.message);
  }
}

// Load flashcards
export async function loadFlashcards() {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const snapshot = await getDocs(collection(db, "users", user.uid, "flashcards"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error loading flashcards:", err.message);
    return [];
  }
}
