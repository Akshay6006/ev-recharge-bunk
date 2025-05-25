// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Handle login/register UI toggling
window.toggleAuth = function(mode) {
  document.getElementById("loginForm").style.display = mode === "login" ? "block" : "none";
  document.getElementById("registerForm").style.display = mode === "register" ? "block" : "none";
  document.getElementById("loginTab").classList.toggle("active", mode === "login");
  document.getElementById("registerTab").classList.toggle("active", mode === "register");
};

// Login function
window.login = async function () {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const role = userData.role;
      if (role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else if (role === "user") {
        window.location.href = "user-dashboard.html";
      } else {
        alert("User role not defined.");
      }
    } else {
      alert("No user role found in database.");
    }
  } catch (error) {
    alert("Login failed: " + error.message);
  }
};

// Register function
window.register = async function () {
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const role = document.getElementById("role").value;

  if (!["admin", "user"].includes(role)) {
    return alert("Please select a valid role.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "users", uid), {
      email: email,
      role: role
    });
    alert("Registration successful! You can now log in.");
    window.toggleAuth("login");
  } catch (error) {
    alert("Registration failed: " + error.message);
  }
};

// Forgot password function
window.forgotPassword = function () {
  const email = document.getElementById("login-email").value.trim();
  if (!email) {
    alert("Please enter your email address.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => alert("Password reset email sent!"))
    .catch((error) => alert("Error: " + error.message));
};
