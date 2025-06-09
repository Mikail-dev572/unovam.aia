const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // ❗ Wichtig für Wix & GitHub Pages
app.use(bodyParser.json());
app.use(express.static(".")); // z. B. logo.png, index.html

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Begrüßung
const startnachricht = "Guten Tag! Ich bin der digitale Assistent von UNOVAM. Gerne beantworte ich Ihre Fragen zu unseren Leistungen, Preisen oder Projektabläufen. Wie kann ich helfen?";

// Daten aus daten.txt (optional)
let eigeneDaten = "";
try {
  eigeneDaten = fs.readFileSync("daten.txt", "utf8");
  console.log("✅ daten.txt geladen.");
} catch (err) {
  console.warn("⚠️ Keine daten.txt gefunden. Bot nutzt nur Standardwissen.");
}

app.post("/frage", async (req, res) => {
  const nutzerfrage = req.body.frage;
  if (!nutzerfrage) {
    return res.status(400).json({ antwort: "Frage fehlt im Request." });
  }

  const alleDaten = eigeneDaten
    ? `Nutze dieses Firmenwissen:\n${eigeneDaten}\n\n`
    : "";

  const prompt = `
Du bist ein professioneller, höflicher und hilfsbereiter Kundenberater der Firma UNOVAM.

Verhalte dich wie ein echter Kundenservice-Mitarbeiter: Antworte auf Augenhöhe, freundlich, kompetent und mit echtem Interesse, dem Kunden zu helfen.

Nutze das folgende Firmenwissen, um die Frage des Kunden präzise zu beantworten. Wenn etwas im Wissen nicht steht, antworte ehrlich, dass du keine Information dazu hast.

Firmenwissen:
${eigeneDaten || "Kein internes Wissen verfügbar."}

Nutzerfrage:
${nutzerfrage}

Antworte bitte ausführlich und verständlich:
`;

  try {
    const antwort = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Du bist ein freundlicher, professioneller Assistent der Firma UNOVAM.",
        },
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

app.listen(PORT, () => {
  console.log(`✅ Chatbot läuft auf http://localhost:${PORT}`);
});
