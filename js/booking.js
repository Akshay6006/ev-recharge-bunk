const auth = firebase.auth();
const db = firebase.firestore();

const bookingForm = document.getElementById("bookingForm");
const totalBookingEl = document.querySelector(".card:nth-child(1) p");
const upcomingBookingEl = document.querySelector(".card:nth-child(2) p");

let currentUser = null;

// Detect user login
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    loadBookingStats();
  } else {
    window.location.href = "login.html";
  }
});

function loadBookingStats() {
  db.collection("bookings")
    .where("userId", "==", currentUser.uid)
    .get()
    .then(snapshot => {
      const bookings = snapshot.docs.map(doc => doc.data());

      totalBookingEl.textContent = bookings.length;

      const future = bookings
        .filter(b => new Date(b.date + "T" + b.time) > new Date())
        .sort((a, b) => new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time));

      if (future.length > 0) {
        upcomingBookingEl.textContent = `${future[0].date} at ${formatTime(future[0].time)}`;
      } else {
        upcomingBookingEl.textContent = "No upcoming booking";
      }
    });
}

function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Booking submission
bookingForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const station = document.getElementById("station").value;

  db.collection("bookings").add({
    userId: currentUser.uid,
    email: currentUser.email,
    date,
    time,
    station,
    timestamp: new Date().toISOString()
  }).then(() => {
    alert("✅ Booking confirmed!");
    bookingForm.reset();
    loadBookingStats();
  }).catch(err => {
    console.error(err);
    alert("❌ Booking failed.");
  });
});

// GLOBAL FUNCTIONS

window.logout = function () {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
};

window.toggleDarkMode = function () {
  document.body.classList.toggle("dark-mode");
};
