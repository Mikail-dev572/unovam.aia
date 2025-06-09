const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(".")); // Serves index.html, logo.png, etc.

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Begrüßungstext beim Start
const startnachricht = "Guten Tag! Ich bin der digitale Assistent von UNOVAM. Gerne beantworte ich Ihre Fragen zu unseren Leistungen, Preisen oder Projektabläufen. Wie kann ich helfen?";

// Eigene Inhalte laden
let eigeneDaten = "";
try {
  eigeneDaten = fs.readFileSync("daten.txt", "utf8");
} catch (err) {
  console.warn("⚠️ Keine daten.txt gefunden. Bot nutzt nur Standardwissen.");
}

app.post("/frage", async (req, res) => {
  const nutzerfrage = req.body.frage;
  const alleDaten = eigeneDaten
    ? `Nutze dieses Firmenwissen:\n${eigeneDaten}\n\n`
    : "";

  const prompt = `${alleDaten}Frage: ${nutzerfrage}\nAntwort:`;

  try {
    const antwort = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Du bist ein freundlicher, professioneller Assistent der Firma UNOVAM." },
        { role: "assistant", content: startnachricht },
        { role: "user", content: prompt },
      ],
    });

    res.json({ antwort: antwort.choices[0].message.content });
  } catch (err) {
    console.error("❌ Fehler bei OpenAI:", err.message);
    res.status(500).json({ antwort: "Fehler beim Antworten. Bitte später nochmal versuchen." });
  }
});

app.listen(3000, () => {
  console.log("✅ Chatbot läuft auf http://localhost:3000");
});
