// server.js
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*", methods: "GET,POST", allowedHeaders: "Content-Type" }));
app.use(bodyParser.json());
app.use(express.static(".")); // für index.html, logo.png usw.

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Begrüßungstext
const startnachricht =
  "Guten Tag! Ich bin der digitale Assistent von UNOVAM. Gerne beantworte ich Ihre Fragen zu unseren Leistungen, Preisen oder Projektabläufen. Wie kann ich helfen?";

// Optional: eigene Firmendaten
let eigeneDaten = "";
try {
  eigeneDaten = fs.readFileSync("daten.txt", "utf8");
  console.log("✅ daten.txt geladen.");
} catch {
  console.warn("⚠️ Keine daten.txt gefunden. Bot nutzt nur Standardwissen.");
}

// Haupt-Endpoint für Fragen
app.post("/frage", async (req, res) => {
  const nutzerfrage = req.body.frage;
  if (!nutzerfrage) return res.status(400).json({ antwort: "Frage fehlt im Request." });

  console.log("🟢 Eingehende Frage:", nutzerfrage);

  const prompt = `
Du bist ein professioneller, höflicher und hilfsbereiter Kundenberater der Firma UNOVAM.
Antworte per Sie, freundlich, kompetent und in maximal 3–4 Sätzen.
Firmenwissen:
${eigeneDaten || "Kein internes Wissen verfügbar."}

Nutzerfrage:
${nutzerfrage}
`;

  try {
    const antwort = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein freundlicher, professioneller Assistent der Firma UNOVAM. Gib präzise, höfliche Antworten in maximal 3–4 Sätzen.",
        },
        { role: "assistant", content: startnachricht },
        { role: "user", content: prompt },
      ],
      max_tokens: 250,
    });

    res.json({ antwort: antwort.choices[0].message.content });
  } catch (err) {
    console.error("❌ Fehler bei OpenAI:", err.message);
    res
      .status(500)
      .json({ antwort: "Fehler beim Antworten. Bitte später nochmal versuchen." });
  }
});

// einfache Testseite
app.get("/", (_req, res) => res.send("✅ UNOVAM Chatbot-API läuft"));

// 🟢 NEU: Healthcheck (für UptimeRobot)
app.get("/healthz", (_req, res) => res.status(200).send("OK"));

// Start
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Chatbot läuft auf http://localhost:${PORT}`);
});
