document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("supportForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // You can connect this to Firebase, EmailJS, or a backend in the future.
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill out all fields.";
      status.style.color = "orange";
      return;
    }

    status.textContent = "Message sent successfully!";
    status.style.color = "lightgreen";

    // Clear form
    form.reset();
  });
});
