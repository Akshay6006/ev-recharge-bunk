// scripts/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔁 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAPjZ3lu2dvuDgKcvpxLaarMnzj7n1si7Y",
  authDomain: "ev-recharge-bunk-dbd05.firebaseapp.com",
  projectId: "ev-recharge-bunk-dbd05",
  storageBucket: "ev-recharge-bunk-dbd05.firebasestorage.app",
  messagingSenderId: "376503343817",
  appId: "1:376503343817:web:564092ebe808ad8bbe4b18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get DOM elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const authButton = document.getElementById("authButton");
const toggleLink = document.getElementById("toggleLink");
const formTitle = document.getElementById("form-title");
const toggleText = document.getElementById("toggleText");
const errorMsg = document.getElementById("errorMsg");

let isLogin = true; // Toggle state

// Toggle login/register mode
toggleLink.addEventListener("click", () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Login" : "Register";
  authButton.textContent = isLogin ? "Login" : "Register";
  toggleText.innerHTML = isLogin
    ? `Don't have an account? <a href="#" id="toggleLink">Register</a>`
    : `Already have an account? <a href="#" id="toggleLink">Login</a>`;
  nameInput.style.display = isLogin ? "none" : "block";
  errorMsg.textContent = "";
});

// Handle login or registration
authButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();

  if (!email || !password || (!isLogin && !name)) {
    errorMsg.textContent = "Please fill in all required fields.";
    return;
  }

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "user-dashboard.html"; // Redirect on success
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "user-dashboard.html"; // Redirect after registration
    }
  } catch (err) {
    errorMsg.textContent = err.message;
  }
});
