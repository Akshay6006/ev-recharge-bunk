// js/booking.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Firebase Config (use your actual credentials)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Handle Booking Form Submit
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }

    if (bookingForm) {
      bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const station = document.getElementById("station").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        try {
          await addDoc(collection(db, "bookings"), {
            userId: user.uid,
            station,
            date,
            time,
            createdAt: serverTimestamp()
          });

          alert("✅ Booking successful!");
          bookingForm.reset();
        } catch (error) {
          console.error("Booking Error:", error);
          alert("❌ Failed to book. Try again.");
        }
      });
    }
  });
});
