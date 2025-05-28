import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { firebaseConfig } from "../../scripts/firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const bookingsRef = collection(db, "bookings");

const bookingsTable = document.querySelector("#bookingsTable tbody");
const searchInput = document.getElementById("search");

let bookingsData = [];

async function loadBookings() {
  const snapshot = await getDocs(bookingsRef);
  bookingsData = [];
  bookingsTable.innerHTML = "";

  let index = 1;
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    bookingsData.push({ id: docSnap.id, ...data });

    const row = buildBookingRow(index++, docSnap.id, data);
    bookingsTable.appendChild(row);
  });
}

function buildBookingRow(index, id, data) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${index}</td>
    <td>${data.email || "N/A"}</td>
    <td>${data.chargerName || "N/A"}</td>
    <td>${data.date || "-"}</td>
    <td>${data.time || "-"}</td>
    <td><button class="delete-btn" data-id="${id}">Delete</button></td>
  `;
  return row;
}

// Event Delegation for Delete
bookingsTable.addEventListener("click", async (e) => {
  const target = e.target;
  const id = target.getAttribute("data-id");

  if (target.classList.contains("delete-btn")) {
    await deleteDoc(doc(db, "bookings", id));
    alert("Booking deleted.");
    loadBookings();
  }
});

// Live Search
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = bookingsData.filter(b =>
    b.email?.toLowerCase().includes(value) ||
    b.date?.toLowerCase().includes(value)
  );

  bookingsTable.innerHTML = "";
  filtered.forEach((booking, i) => {
    const row = buildBookingRow(i + 1, booking.id, booking);
    bookingsTable.appendChild(row);
  });
});

loadBookings();
