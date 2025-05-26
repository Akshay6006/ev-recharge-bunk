import { auth, db } from './firebase-config.js';
import {
  doc, setDoc, getDoc, collection, query,
  where, getDocs, addDoc, orderBy, limit
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const bookingForm = document.getElementById("bookingForm");
const totalBookingEl = document.querySelector(".card:nth-child(1) p");
const upcomingBookingEl = document.querySelector(".card:nth-child(2) p");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    loadBookingStats();
  } else {
    window.location.href = "login.html";
  }
});

async function loadBookingStats() {
  const q = query(collection(db, "bookings"), where("userId", "==", currentUser.uid));
  const snapshot = await getDocs(q);

  const bookings = [];
  snapshot.forEach(doc => bookings.push(doc.data()));

  totalBookingEl.textContent = bookings.length;

  const futureBookings = bookings
    .filter(b => new Date(b.date + "T" + b.time) > new Date())
    .sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time));

  if (futureBookings.length > 0) {
    const next = futureBookings[0];
    upcomingBookingEl.textContent = `${next.date} at ${formatTime(next.time)}`;
  } else {
    upcomingBookingEl.textContent = "No upcoming booking";
  }
}

function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const station = document.getElementById("station").value;

  try {
    await addDoc(collection(db, "bookings"), {
      userId: currentUser.uid,
      email: currentUser.email,
      date,
      time,
      station,
      timestamp: new Date().toISOString()
    });

    alert("Booking confirmed!");
    bookingForm.reset();
    loadBookingStats();
  } catch (error) {
    console.error("Error adding booking: ", error);
    alert("Failed to book. Try again.");
  }
});

// Logout Function
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};

// Optional: Dark mode toggle (handled globally if needed)
