require("dotenv").config();
const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_KEY");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const { message, type } = req.body;
    
    if (type === "image" || message.toLowerCase().startsWith("create an image")) {
      const promptText = message.replace(/create an image/gi, "").trim() || "beautiful nature artwork";
      const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(promptText)}?width=800&height=800&seed=${Math.floor(Math.random()*1000)}`;
      return res.json({ reply: `इमेज तयार झाली आहे:\n\n![Generated Image](${imageUrl})` });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    res.json({ reply: response.text() });
  } catch (err) {
    res.json({ reply: "उत्तर तयार करताना अडचण आली: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

