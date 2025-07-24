import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const displayNameInput = document.getElementById("displayName");
  const updateBtn = document.getElementById("updateBtn");
  const updateStatus = document.getElementById("updateStatus");
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

  // Update Display Name
  updateBtn.addEventListener("click", () => {
    const user = auth.currentUser;
    const name = displayNameInput.value.trim();

    if (user && name) {
      updateProfile(user, { displayName: name })
        .then(() => {
          updateStatus.textContent = "✅ Name updated successfully!";
          updateStatus.style.color = "green";
        })
        .catch((error) => {
          console.error("Update error:", error);
          updateStatus.textContent = "❌ Failed to update name.";
          updateStatus.style.color = "red";
        });
    } else {
      updateStatus.textContent = "❗ Please enter a valid name.";
      updateStatus.style.color = "orange";
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
