require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: userMessage,
    });

    res.json({
      reply: response.text,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Server Ready: http://localhost:3000");
});

