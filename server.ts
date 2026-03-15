
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Gemini API Configuration
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // AI Support Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await genAI.models.generateContent({
     model: "gemini-1.5-flash",
        contents: [
          ...(history || []).map((h: any) => ({
            role: h.role === 'model' ? 'model' : 'user',
            parts: [{ text: h.parts[0].text }]
          })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "You are MindCare AI, a compassionate and professional mental health support assistant. Your goal is to provide empathetic listening, practical coping strategies, and a safe space for users to express their feelings. You are NOT a doctor or a replacement for professional medical advice. If a user expresses thoughts of self-harm, gently encourage them to seek professional help or contact a crisis hotline immediately. Keep responses concise, supportive, and focused on the user's well-being. Respond within 1 second whenever possible.",
        }
      });

      const text = response.text;

      res.json({ text });
    } catch (error) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ 
        error: "I'm here to support you. Please try again in a moment.",
        details: process.env.NODE_ENV === "development" ? error : undefined
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MindCare AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
