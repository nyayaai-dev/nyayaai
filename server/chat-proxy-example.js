/**
 * Reference backend for NyayaAI's chat — NOT wired up or run automatically.
 *
 * Why this exists: the browser can't safely call the Anthropic/OpenAI API directly
 * (it would expose your API key to every visitor). This tiny Express server sits
 * between the frontend and the LLM provider, keeping the key server-side.
 *
 * Setup (once Node.js is installed):
 *   1. npm init -y
 *   2. npm install express cors @anthropic-ai/sdk dotenv
 *   3. Create a .env file (same folder) with: ANTHROPIC_API_KEY=sk-ant-...
 *   4. node server/chat-proxy-example.js
 *   5. In js/chat.js, set CHAT_CONFIG.apiEndpoint = "http://localhost:8787/api/chat"
 *
 * For production, deploy this as a Vercel/Netlify serverless function or a small
 * Node service, and set apiEndpoint to that deployed URL instead of localhost.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { system, messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages[] is required" });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: system || "You are NyayaAI, an AI legal information assistant for Indian law.",
      messages: messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }))
    });

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reach the AI provider." });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`NyayaAI chat proxy listening on http://localhost:${PORT}`));
