const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Store latest soldier data
let soldierData = {};

// =========================
// HTML Routes
// =========================

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Dashboard Page
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});

// Soldier Device Page
app.get("/soldier", (req, res) => {
    res.sendFile(
        path.join(__dirname, "soldier", "soldier-device.html")
    );
});

// Login Page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

// Signup Page
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});

// =========================
// Soldier Data API
// =========================

// Receive soldier data
app.post("/api/soldier", (req, res) => {
    soldierData = req.body;

    console.log("Received soldier data:");
    console.log(soldierData);

    res.status(200).json({
        success: true,
        message: "Data received successfully"
    });
});

app.post("/api/soldier", (req, res) => {
    soldierData = req.body;

    res.status(200).json({
        success: true,
        message: "Data received successfully"
    });
});

app.get("/api/soldier", (req, res) => {
    res.json(soldierData);
});

// ADD THIS ROUTE
app.post("/api/soldier/location", (req, res) => {
    console.log("Live Location:", req.body);

    res.status(200).json({
        success: true,
        message: "Location received"
    });
});

// Send soldier data to dashboard
app.get("/api/soldier", (req, res) => {
    res.status(200).json(soldierData);
});

// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "Server Running",
        timestamp: new Date()
    });
});

// =========================
// 404 Handler
// =========================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// =========================
// Start Server
// =========================

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});