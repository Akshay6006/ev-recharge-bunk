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
// Load admin dashboard stats
async function loadDashboardStats() {
  // Total Users
  const usersSnapshot = await getDocs(collection(db, "users"));
  document.getElementById("totalUsers").textContent = usersSnapshot.size;

  // Total Bookings
  const bookingsSnapshot = await getDocs(collection(db, "bookings"));
  document.getElementById("totalBookings").textContent = bookingsSnapshot.size;

  // Charging Stations
  const stationSnapshot = await getDocs(collection(db, "stations"));
  document.getElementById("totalStations").textContent = stationSnapshot.size;

  // Total Revenue (from bookings)
  let totalRevenue = 0;
  bookingsSnapshot.forEach((doc) => {
    const data = doc.data();
    totalRevenue += data.amount || 0;
  });
  document.getElementById("totalRevenue").textContent = `₹${totalRevenue}`;
}

// Call after auth state confirms admin
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().role === "admin") {
      await loadDashboardStats();
    }
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
import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Load Users into Table
const userTableBody = document.getElementById("userTableBody");

if (userTableBody) {
  const fetchUsers = async () => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    userTableBody.innerHTML = ""; // Clear existing rows

    snapshot.forEach((doc) => {
      const data = doc.data();
      const row = `
        <tr>
          <td>${data.name || "N/A"}</td>
          <td>${data.email}</td>
          <td>${data.role || "user"}</td>
          <td>${data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</td>
        </tr>`;
      userTableBody.innerHTML += row;
    });
  };

  fetchUsers();
}
