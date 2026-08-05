require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  systemInstruction: "You are Power AI Assistant created by Rameshwar Kharade. Always state clearly and proudly in English: 'I was created by Rameshwar Kharade' whenever asked who created or made you."
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Image Generation Endpoint
app.post("/generate-image", (req, res) => {
  try {
    const randomSeed = Math.floor(Math.random() * 1000);
    const imageUrl = `https://picsum.photos/seed/${randomSeed}/800/800`;
    res.json({ imageUrl: imageUrl });
  } catch (err) {
    res.status(500).json({ error: "Image service error." });
  }
});

// Chat & Document Analysis Endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message, image, mimeType, docText } = req.body;
    let parts = [];

    let combinedPrompt = message || "";
    if (docText) {
      combinedPrompt = `[Document Content Included]:\n${docText}\n\nUser Question: ${combinedPrompt}`;
    }

    if (combinedPrompt) parts.push(combinedPrompt);

    if (image) {
      parts.push({
        inlineData: {
          data: image,
          mimeType: mimeType || "image/jpeg"
        }
      });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Server Ready: http://localhost:3000");
});

