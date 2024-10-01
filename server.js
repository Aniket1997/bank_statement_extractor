require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdf = require('pdf-parse');

// Initialize Express app and set up file upload
const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Function to process the PDF and generate JSON content using Gemini
async function processPDFandGenerateJSON(pdfPath, res, temperature, token) {
  try {
    // Initialize Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    // Read the PDF file from the file system
    const dataBuffer = fs.readFileSync(pdfPath);

    // Extract text from the PDF
    const pdfData = await pdf(dataBuffer);

    // Define the model configuration for generating content in JSON format
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(`Convert the following PDF content into structured JSON data:\n${pdfData.text}`, { 
      temperature, 
      tokens: token // Pass the token value here
    });

    // Parse the response text and send it as JSON
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    // Error handling in case something goes wrong
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to process the PDF and generate content." });
  }
}

// API endpoint to handle PDF upload and process it
app.post('/upload', upload.single('pdf'), (req, res) => {
  const pdfPath = req.file.path;
  
  // Define temperature and token values
  const temperature = 7.0; // Example temperature value
  const token = 300; // Example token value, modify as needed

  // Call the function to process the PDF and generate JSON
  processPDFandGenerateJSON(pdfPath, res, temperature, token);

  // Clean up the uploaded PDF file after processing (optional)
  fs.unlinkSync(pdfPath);
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
