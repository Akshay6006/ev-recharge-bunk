import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth protection
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

// Logout
window.logout = function () {
  signOut(auth).then(() => window.location.href = "login.html");
};

// Dark mode toggle
window.toggleDarkMode = function () {
  document.body.classList.toggle("dark");
};

// Load Leaflet map
window.onload = function () {
  const map = L.map('map').setView([12.9716, 77.5946], 13); // Bangalore

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Sample marker
  L.marker([12.9716, 77.5946]).addTo(map)
    .bindPopup('EV Charging Station')
    .openPopup();
};
