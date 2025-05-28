import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const displayNameInput = document.getElementById("displayName");
  const updateBtn = document.getElementById("updateBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // Auth check
  onAuthStateChanged(auth, (user) => {
    if (user) {
      emailInput.value = user.email;
      displayNameInput.value = user.displayName || "";
    } else {
      window.location.href = "index.html";
    }
  });

  // Update Name
  updateBtn.addEventListener("click", () => {
    const name = displayNameInput.value.trim();
    const user = auth.currentUser;

    if (user && name) {
      updateProfile(user, { displayName: name })
        .then(() => {
          alert("Name updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating name:", error);
          alert("Failed to update name.");
        });
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        alert("Logout failed.");
      });
  });
});
