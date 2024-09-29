const express = require('express');
const dotenv = require('dotenv').config();
const generateContent = require('./generateContent');  // Assuming generateContent is in the same directory

const app = express();
const port = process.env.PORT || 3000;

// Create a GET route to handle API requests
app.get('/generate-jokes', generateContent);

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
