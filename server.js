require("dotenv").config();
const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// कॅशिंग बंद करण्यासाठी (प्रत्येक वेळी नवीन लुक दिसेल)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  systemInstruction: "You are Power AI Assistant created by Rameshwar Kharade."
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server Ready on port ${PORT}`);
});

