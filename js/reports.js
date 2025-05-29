import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { firebaseConfig } from "../../scripts/firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usersCol = collection(db, "users");
const bookingsCol = collection(db, "bookings");

const totalUsersSpan = document.querySelector("#totalUsers span");
const totalBookingsSpan = document.querySelector("#totalBookings span");
const topChargerSpan = document.querySelector("#topCharger span");

async function generateReports() {
  const usersSnap = await getDocs(usersCol);
  const bookingsSnap = await getDocs(bookingsCol);

  totalUsersSpan.textContent = usersSnap.size;
  totalBookingsSpan.textContent = bookingsSnap.size;

  let chargerCount = {};
  let dateCount = {};

  bookingsSnap.forEach(doc => {
    const data = doc.data();

    // Count chargers
    if (data.chargerName) {
      chargerCount[data.chargerName] = (chargerCount[data.chargerName] || 0) + 1;
    }

    // Count by date
    if (data.date) {
      dateCount[data.date] = (dateCount[data.date] || 0) + 1;
    }
  });

  // Find most used charger
  let topCharger = Object.entries(chargerCount).sort((a, b) => b[1] - a[1])[0];
  topChargerSpan.textContent = topCharger ? `${topCharger[0]} (${topCharger[1]})` : "N/A";

  // Generate chart data
  const chartLabels = Object.keys(dateCount).sort();
  const chartData = chartLabels.map(date => dateCount[date]);

  const ctx = document.getElementById("bookingChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartLabels,
      datasets: [{
        label: "Bookings per Day",
        data: chartData,
        backgroundColor: "#6c5ce7"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

generateReports();
