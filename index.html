require("dotenv").config();
const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const { message, type } = req.body;

    if (type === "image" || message.toLowerCase().startsWith("create an image") || message.toLowerCase().startsWith("generate image")) {
      const promptText = message.replace(/create an image/gi, "").trim();
      const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(promptText)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}`;
      return res.json({ reply: `इमेज तयार झाली आहे:\n\n![Generated Image](${imageUrl})` });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "उत्तर तयार करताना अडचण आली: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

