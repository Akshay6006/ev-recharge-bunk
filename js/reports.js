import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load Report Data
async function loadReports() {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const bookingsSnapshot = await getDocs(collection(db, "bookings"));

    document.getElementById("totalUsers").textContent = usersSnapshot.size;
    document.getElementById("totalBookings").textContent = bookingsSnapshot.size;

    // Example: Count stations
    const stationCount = {};
    bookingsSnapshot.forEach(doc => {
      const data = doc.data();
      const station = data.station || "Unknown";
      stationCount[station] = (stationCount[station] || 0) + 1;
    });

    const sortedStations = Object.entries(stationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const stationList = document.getElementById("topStations");
    stationList.innerHTML = "";
    sortedStations.forEach(([station, count]) => {
      const li = document.createElement("li");
      li.textContent = `${station} - ${count} bookings`;
      stationList.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading reports:", err);
  }
}

loadReports();
