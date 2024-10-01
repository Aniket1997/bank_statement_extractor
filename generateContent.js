const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdf = require('pdf-parse');
const fs = require('fs');

// This function processes the PDF and generates JSON content using Gemini
async function processPDFandGenerateJSON(req, res) {
  try {
    // Initialize Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    
    // Read the PDF file from the file system
    const dataBuffer = fs.readFileSync('file.pdf');

    // Extract text from the PDF
    const pdfData = await pdf(dataBuffer);

    // Define the model configuration for generating content in JSON format
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Send the PDF text to the Gemini model, requesting it to convert it to structured JSON
    const result = await model.generateContent(`Convert the following PDF content into structured JSON data:\n${pdfData.text}`);
    
    // Parse the response text and send it as JSON
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    // Error handling in case something goes wrong
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to process the PDF and generate content." });
  }
}

module.exports = processPDFandGenerateJSON;
