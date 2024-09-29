// generateContent.js
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

async function generateContent(req, res) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    // Define a schema for the task list using the provided schema
    const schema = {
      description: "List of tasks for a to-do list",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          taskDescription: {
            type: SchemaType.STRING,
            description: "A brief description of the task",
            nullable: false,
          },
          dueDate: {
            type: SchemaType.STRING,
            description: "The due date for the task (optional)",
            nullable: true, // Optional
          },
          completed: {
            type: SchemaType.BOOLEAN,
            description: "Indicates whether the task has been completed",
            nullable: false, // Must be provided
          },
        },
        required: ["taskDescription"], // taskDescription is mandatory
      },
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    // Change the prompt to ask for tasks for a to-do list project
    const result = await model.generateContent("Create a list of tasks for overcome complex math");

    // Parse the response and send it as JSON
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content." });
  }
}

module.exports = generateContent;
