// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAPjZ3lu2dvuDgKcvpxLaarMnzj7n1si7Y",
  authDomain: "ev-recharge-bunk-dbd05.firebaseapp.com",
  projectId: "ev-recharge-bunk-dbd05",
  storageBucket: "ev-recharge-bunk-dbd05.firebasestorage.app",
  messagingSenderId: "376503343817",
  appId: "1:376503343817:web:564092ebe808ad8bbe4b18"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
