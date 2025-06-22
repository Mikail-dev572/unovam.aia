const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS für Tests (achte auf Sicherheit bei Deployment)
const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static(".")); // z. B. logo.png, index.html

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Begrüßung
const startnachricht =
  "Guten Tag! Ich bin der digitale Assistent von UNOVAM. Gerne beantworte ich Ihre Fragen zu unseren Leistungen, Preisen oder Projektabläufen. Wie kann ich helfen?";

// Daten aus daten.txt laden (falls vorhanden)
let eigeneDaten = "";
try {
  eigeneDaten = fs.readFileSync("daten.txt", "utf8");
  console.log("✅ daten.txt geladen.");
} catch (err) {
  console.warn("⚠️ Keine daten.txt gefunden. Bot nutzt nur Standardwissen.");
}

// POST-Endpunkt für Benutzerfragen
app.post("/frage", async (req, res) => {
  const nutzerfrage = req.body.frage;

  if (!nutzerfrage) {
    return res.status(400).json({ antwort: "Frage fehlt im Request." });
  }

  console.log("🟢 Eingehende Frage:", nutzerfrage);

  // Themenfilter: nur relevante Fragen zulassen
  const relevanteStichworte = [
    "dienstleistung", "leistung", "angebot", "unovam", "projekt", "preis", "kosten", "ablauf", "wie funktioniert"
  ];

  const frageIstRelevant = relevanteStichworte.some((wort) =>
    nutzerfrage.toLowerCase().includes(wort)
  );

  if (!frageIstRelevant) {
    return res.json({
      antwort:
        "Ich bin auf Fragen rund um unsere Dienstleistungen spezialisiert. Bei anderen Themen kann ich leider nicht weiterhelfen.",
    });
  }

  const prompt = `
Du bist ein professioneller, höflicher und hilfsbereiter Kundenberater der Firma UNOVAM.

Verhalte dich wie ein echter Kundenservice-Mitarbeiter: Antworte per Sie, freundlich, kompetent und mit echtem Interesse, dem Kunden zu helfen.

Nutze das folgende Firmenwissen, um die Frage des Kunden präzise zu beantworten. Wenn etwas im Wissen nicht steht, antworte ehrlich, dass du keine Information dazu hast.

Antwort bitte klar, freundlich und möglichst kurz – maximal 3–4 Sätze.

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
    res.status(500).json({
      antwort: "Fehler beim Antworten. Bitte später nochmal versuchen.",
    });
  }
});

// Test-Route
app.get("/", (req, res) => {
  res.send("✅ UNOVAM Chatbot-API läuft");
});

app.listen(PORT, () => {
  console.log(`✅ Chatbot läuft auf http://localhost:${PORT}`);
});
