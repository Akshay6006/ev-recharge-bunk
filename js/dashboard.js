// js/dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";  // ✅ Correct path

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth State Listener
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("userName").textContent = data.email.split("@")[0];
    document.getElementById("userEmail").textContent = data.email;

    // Example dynamic values
    document.getElementById("totalBookings").querySelector("p").textContent = "4";
    document.getElementById("upcomingBooking").querySelector("p").textContent = "June 5, 2025 at 4PM";

  } else {
    alert("User data not found.");
    signOut(auth);
  }
});

// Logout
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// Dark Mode Toggle
window.toggleDarkMode = function () {
  document.body.classList.toggle("dark");
};
