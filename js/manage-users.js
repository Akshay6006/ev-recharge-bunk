import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import { firebaseConfig } from "../../scripts/firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersRef = collection(db, "users");

const usersTable = document.querySelector("#usersTable tbody");
const searchInput = document.getElementById("search");

let usersData = [];

async function loadUsers() {
  const snapshot = await getDocs(usersRef);
  usersData = [];
  usersTable.innerHTML = "";

  let index = 1;
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    usersData.push({ id: docSnap.id, ...data });

    const row = buildUserRow(index++, docSnap.id, data);
    usersTable.appendChild(row);
  });
}

function buildUserRow(index, id, data) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${index}</td>
    <td>${data.displayName || "N/A"}</td>
    <td>${data.email}</td>
    <td>${data.role || "user"}</td>
    <td>
      <button class="delete-btn" data-id="${id}">Delete</button>
      <button class="role-btn" data-id="${id}" data-role="${data.role}">Toggle Role</button>
    </td>
  `;
  return row;
}

// Event Delegation for buttons
usersTable.addEventListener("click", async (e) => {
  const target = e.target;
  const id = target.getAttribute("data-id");

  if (target.classList.contains("delete-btn")) {
    await deleteDoc(doc(db, "users", id));
    alert("User deleted.");
    loadUsers();
  }

  if (target.classList.contains("role-btn")) {
    const currentRole = target.getAttribute("data-role") || "user";
    const newRole = currentRole === "admin" ? "user" : "admin";
    await updateDoc(doc(db, "users", id), { role: newRole });
    alert(`Role changed to ${newRole}`);
    loadUsers();
  }
});

// Live Search
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = usersData.filter(user =>
    user.displayName?.toLowerCase().includes(value) ||
    user.email?.toLowerCase().includes(value)
  );

  usersTable.innerHTML = "";
  filtered.forEach((user, i) => {
    const row = buildUserRow(i + 1, user.id, user);
    usersTable.appendChild(row);
  });
});

loadUsers();
