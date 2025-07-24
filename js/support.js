document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("supportForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "❗ Please fill out all fields.";
      status.style.color = "orange";
      return;
    }

    // Placeholder for sending data to Firebase, EmailJS, etc.
    status.textContent = "✅ Message sent successfully!";
    status.style.color = "green";

    form.reset(); // clear the form
  });
});

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function logout() {
  alert("Logging out...");
  window.location.href = "index.html";
}
