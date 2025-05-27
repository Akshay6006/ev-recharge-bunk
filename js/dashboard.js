// js/dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Firebase Config (use your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyAPjZ3lu2dvuDgKcvpxLaarMnzj7n1si7Y",
  authDomain: "ev-recharge-bunk-dbd05.firebaseapp.com",
  projectId: "ev-recharge-bunk-dbd05",
  storageBucket: "ev-recharge-bunk-dbd05.firebasestorage.app",
  messagingSenderId: "376503343817",
  appId: "1:376503343817:web:564092ebe808ad8bbe4b18"
};

// ✅ Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Auth Check and Data Load
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    const userNameElem = document.getElementById("userName");
    const userEmailElem = document.getElementById("userEmail");
    if (userNameElem) userNameElem.textContent = data.email.split("@")[0];
    if (userEmailElem) userEmailElem.textContent = data.email;

    const totalBookingsElem = document.getElementById("totalBookings");
    const upcomingBookingElem = document.getElementById("upcomingBooking");

    if (totalBookingsElem) totalBookingsElem.querySelector("p").textContent = "4";
    if (upcomingBookingElem) upcomingBookingElem.querySelector("p").textContent = "June 5, 2025 at 4PM";

    if (data.role === "admin") {
      loadAdminDashboard();
    }
  } else {
    alert("User data not found.");
    signOut(auth);
  }
});

// ✅ Load admin stats if admin
async function loadAdminDashboard() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const bookingsSnapshot = await getDocs(collection(db, "bookings"));
  const stationSnapshot = await getDocs(collection(db, "stations"));

  const totalUsersElem = document.getElementById("totalUsers");
  const totalBookingsElem = document.getElementById("totalBookings");
  const totalStationsElem = document.getElementById("totalStations");
  const totalRevenueElem = document.getElementById("totalRevenue");

  if (totalUsersElem) totalUsersElem.textContent = usersSnapshot.size;
  if (totalBookingsElem) totalBookingsElem.textContent = bookingsSnapshot.size;
  if (totalStationsElem) totalStationsElem.textContent = stationSnapshot.size;

  let totalRevenue = 0;
  bookingsSnapshot.forEach((doc) => {
    const data = doc.data();
    totalRevenue += data.amount || 0;
  });

  if (totalRevenueElem) totalRevenueElem.textContent = `₹${totalRevenue}`;
}

// ✅ Logout Function
function logout() {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Logout Error:", error);
    });
}

// ✅ Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// ✅ Expose to HTML inline
window.logout = logout;
window.toggleDarkMode = toggleDarkMode;
