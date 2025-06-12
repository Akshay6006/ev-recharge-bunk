import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const authButton = document.getElementById("authButton");
const formTitle = document.getElementById("form-title");
const toggleLink = document.getElementById("toggleLink");
const toggleText = document.getElementById("toggleText");
const errorMsg = document.getElementById("errorMsg");

let isLogin = true;

toggleLink.addEventListener("click", () => {
  isLogin = !isLogin;
  if (isLogin) {
    formTitle.textContent = "Login";
    nameInput.style.display = "none";
    authButton.textContent = "Login";
    toggleText.innerHTML = `Don't have an account? <a href="#" id="toggleLink">Register</a>`;
  } else {
    formTitle.textContent = "Register";
    nameInput.style.display = "block";
    authButton.textContent = "Register";
    toggleText.innerHTML = `Already have an account? <a href="#" id="toggleLink">Login</a>`;
  }
});

authButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();

  errorMsg.textContent = "";

  if (!email || !password || (!isLogin && !name)) {
    errorMsg.textContent = "Please fill all fields.";
    return;
  }

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "user-dashboard.html"; // redirect after login
    } else {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, {
        displayName: name,
      });
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: email,
        displayName: name,
        role: "user",
      });
      alert("Registered successfully!");
      window.location.href = "user-dashboard.html";
    }
  } catch (error) {
    errorMsg.textContent = error.message;
  }
});
