// Letzter Check: funktioniert noch!
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(".")); // Stellt index.html, logo.png usw. bereit

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Eigene Daten einlesen
const eigeneDaten = fs.readFileSync("daten.txt", "utf8");

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
  console.error("Fehler im /frage-Handler:", error);
  res.status(500).json({ antwort: "Fehler: " + error.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Chatbot läuft auf http://localhost:3000");
});
