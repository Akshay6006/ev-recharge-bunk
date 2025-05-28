import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// Logout handler
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// Dark mode toggle
window.toggleDarkMode = function () {
  document.body.classList.toggle("dark");
};

// 🧠 Wait for the Google Maps script to load
const waitForGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
    setTimeout(() => reject("Google Maps load timed out"), 5000);
  });
};

// ✅ Use that wait function before calling initMap
waitForGoogleMaps()
  .then(() => {
    initMap();
  })
  .catch((err) => {
    console.error("Google Maps failed to load:", err);
  });

// ✅ Define initMap normally
function initMap() {
  const center = { lat: 12.9716, lng: 77.5946 }; // Bangalore
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: center,
  });

  new google.maps.Marker({
    position: center,
    map: map,
    title: "Sample EV Charger",
  });
}
