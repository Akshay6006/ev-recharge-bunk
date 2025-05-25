// scripts/map.js

const map = L.map('map').setView([12.9716, 77.5946], 13); // Bengaluru by default

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Dummy EV Charging Station Markers
const stations = [
  { lat: 12.975, lng: 77.605, name: "EV Charger - MG Road" },
  { lat: 12.965, lng: 77.595, name: "EV Charger - Residency Rd" },
  { lat: 12.971, lng: 77.590, name: "EV Charger - Church St" }
];

stations.forEach(station => {
  L.marker([station.lat, station.lng])
    .addTo(map)
    .bindPopup(`<b>${station.name}</b><br>Available`);
});
