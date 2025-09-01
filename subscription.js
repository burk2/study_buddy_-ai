// subscription.js
import { db } from "./firebase-config.js";
import { auth } from "./firebase-config.js";
import { 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔹 Mark user as subscribed
export async function activateSubscription(paymentMethod) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please login first to subscribe.");
    return;
  }

  try {
    await setDoc(doc(db, "users", user.uid), {
      subscription: {
        active: true,
        method: paymentMethod,
        startedAt: new Date(),
        plan: "Pro $20/month"
      }
    }, { merge: true });

    alert("Subscription activated!");
  } catch (err) {
    console.error("Subscription error:", err.message);
  }
}

// 🔹 Check if user is subscribed
export async function checkSubscription() {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const sub = userDoc.data().subscription;
      return sub?.active || false;
    }
    return false;
  } catch (err) {
    console.error("Error checking subscription:", err.message);
    return false;
  }
  }
