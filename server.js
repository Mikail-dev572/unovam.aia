const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors()); // <<< SEHR WICHTIG für GitHub + Wix
app.use(bodyParser.json());
app.use(express.static(".")); // Optional: für statische Dateien wie index.html

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Sicher lesen
let eigeneDaten = '';
try {
  eigeneDaten = fs.readFileSync("daten.txt", "utf8");
} catch (e) {
  console.error("Fehler beim Lesen von daten.txt:", e.message);
}

app.post("/frage", async (req, res) => {
  const frage = req.body.frage;
  const prompt = `Nutze folgendes Wissen, um zu antworten:\n${eigeneDaten}\n\nFrage: ${frage}\nAntwort:`;

  try {
    const antwort = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ antwort: antwort.choices[0].message.content });
  } catch (error) {
    console.error("Fehler im OpenAI-Aufruf:", error.message);
    res.status(500).json({ antwort: "Fehler: " + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Chatbot läuft auf http://localhost:${PORT}`);
});
