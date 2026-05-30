const SERVER_URL = "/api/soldier";;

let distressPopupShown = false; // To track if the popup is currently shown

// Initialize Leaflet map centered on India
let map = L.map('map').setView([22.9734, 78.6569], 5); // India center
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
let soldierMarker = null;

async function fetchSoldierData() {
    try {
        const response = await fetch(SERVER_URL);
        const data = await response.json();

        // Update Soldier Overview
        document.getElementById('soldier-name').textContent = data.name || 'N/A';
        document.getElementById('soldier-unit').textContent = data.unit || 'N/A';
        document.getElementById('soldier-rank').textContent = data.rank || 'N/A';
        document.getElementById('soldier-mission').textContent = data.mission || 'N/A';

        // Update Health Metrics
        document.getElementById('heart-rate').textContent = data.heartRate || 'N/A';
        document.getElementById('body-temperature').textContent = data.bodyTemperature || 'N/A';
        document.getElementById('oxygen-levels').textContent = data.oxygenLevels || 'N/A';
        document.getElementById('blood-pressure').textContent = data.bloodPressure || 'N/A';

        // Update Location Information
        const lat = data.gps?.lat;
        const lon = data.gps?.long;
        document.getElementById('gps-position').textContent = `Lat: ${lat || 'N/A'}, Long: ${lon || 'N/A'}`;
        document.getElementById('last-movement').textContent = new Date().toLocaleString();

        // Update map and geocode city
        if (lat && lon) {
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lon);

            // Add or move marker
            if (soldierMarker) {
                soldierMarker.setLatLng([latitude, longitude]);
            } else {
                soldierMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("Soldier Location");
            }

            map.setView([latitude, longitude], 8);

            // Reverse geocoding for city name
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                .then(res => res.json())
                .then(locationData => {
                    const city = locationData.address.city || locationData.address.town || locationData.address.village || 'Unknown Area';
                    document.getElementById('area-ops').textContent = city;
                    soldierMarker.bindPopup(`📍 ${city}`).openPopup();
                })
                .catch(err => {
                    console.error("Geocoding error:", err);
                    document.getElementById('area-ops').textContent = 'Unknown';
                });
        }

        // Distress Signal
        if (data.distressSignal) {
            showDistressOnDashboard();
            if (!distressPopupShown) showDistressPopup();
        } else {
            clearDistressFromDashboard();
        }

        // Environmental Data
        document.getElementById('weather-conditions').textContent = data.environmentalData?.weatherConditions || 'Clear Sky';
        document.getElementById('hazard-alerts').textContent = data.environmentalData?.hazardAlerts || 'N/A';

        // Device Status
        document.getElementById('device-battery').textContent = `${data.deviceStatus?.battery || '85'}%`;
        document.getElementById('connectivity-status').textContent = data.deviceStatus?.connectivity || 'Connected';

    } catch (error) {
        console.error('Error fetching soldier data:', error);
    }
}

// Dark mode
document.getElementById('dark-mode-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
window.onload = function () {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
};

// Distress signal handlers
function showDistressPopup() {
    const popup = document.createElement('div');
    popup.id = 'distress-popup';
    popup.classList.add('popup');
    popup.innerHTML = `
        <h2>Distress Signal Received</h2>
        <p>A distress signal has been activated by a soldier.</p>
        <button id="close-popup">Close</button>
    `;
    document.body.appendChild(popup);
    document.getElementById('close-popup').addEventListener('click', () => {
        document.body.removeChild(popup);
        distressPopupShown = true;
    });
}
function showDistressOnDashboard() {
    const section = document.getElementById('distress-section');
    section.innerHTML = `<div class="distress-active">
        <h3>Distress Signal Active</h3>
        <p>Immediate action required!</p>
    </div>`;
    section.style.display = 'block';
}
function clearDistressFromDashboard() {
    document.getElementById('distress-section').style.display = 'none';
}

// Data polling
setInterval(fetchSoldierData, 5000);

// History handling
function saveSoldierToHistory() {
    let history = JSON.parse(localStorage.getItem("soldierHistory")) || [];
    let soldier = {
        name: document.getElementById("soldier-name").textContent.trim(),
        rank: document.getElementById("soldier-rank").textContent.trim(),
        unit: document.getElementById("soldier-unit").textContent.trim(),
        mission: document.getElementById("soldier-mission").textContent.trim(),
        heartRate: document.getElementById("heart-rate").textContent.trim(),
        oxygenLevels: document.getElementById("oxygen-levels").textContent.trim(),
        bloodPressure: document.getElementById("blood-pressure").textContent.trim(),
        date: new Date().toLocaleString()
    };
    if (!soldier.name || soldier.name === "Loading...") {
        alert("⚠ No valid soldier data available to save!");
        return;
    }
    history.push(soldier);
    localStorage.setItem("soldierHistory", JSON.stringify(history));
    alert("✅ Soldier data saved successfully!");
    updateHistoryTable();
}
function updateHistoryTable() {
    let history = JSON.parse(localStorage.getItem("soldierHistory")) || [];
    let tableBody = document.querySelector("#history-table tbody");
    tableBody.innerHTML = "";
    history.forEach((record, index) => {
        let row = `<tr>
            <td>${index + 1}</td>
            <td>${record.name}</td>
            <td>${record.rank}</td>
            <td>${record.unit}</td>
            <td>${record.mission}</td>
            <td>${record.heartRate}</td>
            <td>${record.oxygenLevels}</td>
            <td>${record.bloodPressure}</td>
            <td>${record.date}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}
document.getElementById("view-history-btn").addEventListener("click", function () {
    document.getElementById("history-content").classList.toggle("hidden");
    updateHistoryTable();
});
document.getElementById("save-soldier-btn").addEventListener("click", saveSoldierToHistory);
document.getElementById("clear-history").addEventListener("click", function () {
    localStorage.removeItem("soldierHistory");
    updateHistoryTable();
});
document.addEventListener("DOMContentLoaded", updateHistoryTable);

// Chat functionality
const socket = io("https://soldiersignup.onrender.com");
const myId = location.href.includes("dashboard") ? "commandDashboard" : "soldierDevice";
const otherId = myId === "commandDashboard" ? "soldierDevice" : "commandDashboard";

socket.emit("join", myId);
document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById("chat-window");
    const chatInput = document.getElementById("chat-input");
    const sendChatBtn = document.getElementById("send-chat-btn");
    const clearChatBtn = document.getElementById("clear-chat-btn");
    const typingIndicator = document.getElementById("typing-indicator");

    sendChatBtn.addEventListener("click", () => {
        const message = chatInput.value.trim();
        if (message) {
            socket.emit("sendMessage", {
                sender: myId,
                receiver: otherId,
                message,
                timestamp: new Date().toLocaleTimeString()
            });
            appendChatMessage("You", message, new Date().toLocaleTimeString(), "sent");
            chatInput.value = "";
            typingIndicator.textContent = "";
        }
    });

    chatInput.addEventListener("input", () => {
        socket.emit("typing", { sender: myId, receiver: otherId });
    });

    socket.on("receiveMessage", ({ sender, message, timestamp }) => {
        appendChatMessage(sender, message, timestamp || new Date().toLocaleTimeString(), "received");
    });

    socket.on("showTyping", ({ sender }) => {
        typingIndicator.textContent = `${sender === "commandDashboard" ? "Command" : "Soldier"} is typing...`;
        setTimeout(() => typingIndicator.textContent = "", 2000);
    });

    clearChatBtn.addEventListener("click", () => {
        chatWindow.innerHTML = "";
        localStorage.removeItem(`chatHistory-${myId}`);
    });

    function appendChatMessage(sender, message, time, type) {
        const msgDiv = document.createElement("div");
        msgDiv.style.marginBottom = "8px";
        msgDiv.style.background = type === "sent" ? "#dcf8c6" : "#e8e8e8";
        msgDiv.style.padding = "5px 10px";
        msgDiv.style.borderRadius = "10px";
        msgDiv.style.textAlign = type === "sent" ? "right" : "left";
        msgDiv.innerHTML = `<strong>${sender}</strong>: ${message}<br><small>${time}</small>`;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});













document.getElementById("weather-cond").textContent = data.weatherConditions || "Unknown";
document.getElementById("hazard-alert").textContent = data.hazardAlerts || "None";

// Optional: Add the weather icon from condition
const iconMap = {
    "clear sky": "01d", "few clouds": "02d", "scattered clouds": "03d",
    "broken clouds": "04d", "shower rain": "09d", "rain": "10d",
    "thunderstorm": "11d", "snow": "13d", "mist": "50d"
};

if (data.weatherConditions) {
    const desc = data.weatherConditions.split(",")[0].trim().toLowerCase();
    const iconCode = iconMap[desc] || "01d";
    document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}



const soldierCard = document.getElementById("soldier-card"); // Your soldier display container

if (data.distressSignal === true || data.hazardAlerts !== "None") {
    soldierCard.classList.add("alert-distress");

    // Optional: Play alert sound
    const alertAudio = new Audio('alert.mp3'); // add a small mp3 file in your folder
    alertAudio.play();
} else {
    soldierCard.classList.remove("alert-distress");
}
