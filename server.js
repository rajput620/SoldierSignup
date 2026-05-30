const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Middleware to parse JSON bodies

// Store soldier data
let soldierData = {};

// Endpoint to receive soldier data from the device
app.post('/api/soldier', (req, res) => {
    soldierData = req.body; // Update soldier data with the latest received data
    console.log('Received soldier data:', soldierData); // Log received data
    res.status(200).json({ message: 'Data received successfully' });
});

// Endpoint to send soldier data to the dashboard
app.get('/api/soldier', (req, res) => {
    res.json(soldierData); // Send the stored soldier data
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`); // ✅ Corrected syntax
});




















