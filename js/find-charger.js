// js/find-charger.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch stations and populate list
async function loadStations() {
  const stationList = document.getElementById("stationList");
  stationList.innerHTML = "<li>Loading...</li>";

  try {
    const querySnapshot = await getDocs(collection(db, "stations"));
    stationList.innerHTML = "";

    if (querySnapshot.empty) {
      stationList.innerHTML = "<li>No stations found.</li>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const listItem = document.createElement("li");
      listItem.textContent = `${data.name} - ${data.location}`;
      stationList.appendChild(listItem);
    });

  } catch (error) {
    console.error("Error fetching stations:", error);
    stationList.innerHTML = "<li>Error loading stations.</li>";
  }
}

loadStations();
