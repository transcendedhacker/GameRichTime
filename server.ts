import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Executive Advisor route
app.post('/api/advisor/chat', async (req, res) => {
  try {
    const { message, history, gameState } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your environment variables.'
      });
    }

    const systemPrompt = `You are "Archibald Sterling", Senior Executive & Strategic Investment Advisor for "Business Empire: Richman Tycoon".
Your client is the Chief Executive (the player) building a multi-billion dollar business empire.

CURRENT LIVE GAME STATE OF PLAYER:
- Net Worth: $${Number(gameState?.netWorth || 0).toLocaleString()}
- Liquid Cash: $${Number(gameState?.cash || 0).toLocaleString()}
- Hourly Passive Cash Flow: +$${Number(gameState?.incomePerHour || 0).toLocaleString()}/hr
- Executive Title / Tier: ${gameState?.currentTitle || 'Aspiring Hustler'} (Multiplier: ${gameState?.multiplier || 1}x)
- Prestige Rating: ${gameState?.prestigePoints || 0} PTS
- Businesses Owned (${gameState?.businesses?.length || 0}): ${gameState?.businesses?.map((b: any) => `${b.name} (Lvl ${b.level}, Automated: ${b.managerHired})`).join(', ') || 'None yet'}
- Real Estate Held (${gameState?.properties?.length || 0}): ${gameState?.properties?.map((p: any) => `${p.name} (${p.renovationStars}/5 stars, Rent: $${p.baseRentPerHour}/hr)`).join(', ') || 'None yet'}
- Stock & Crypto Portfolio: ${gameState?.stocks?.filter((s: any) => s.ownedShares > 0).map((s: any) => `${s.symbol}: ${s.ownedShares} shares @ $${s.price.toFixed(2)}`).join(', ') || 'No shares held'}
- Commercial Bank Status: ${gameState?.bank?.unlocked ? `Charter Active (Vault: $${Number(gameState.bank.vaultCash).toLocaleString()}, Spread: ${(gameState.bank.loanRatePercent - gameState.bank.depositRatePercent).toFixed(1)}%)` : 'License Not Acquired'}
- Luxury Fleets: ${gameState?.luxuryItems?.map((l: any) => l.name).join(', ') || 'No luxury vehicles/jets yet'}
- Executive Persona & RPG Biodata: ${gameState?.persona?.name || 'Executive'} (Age ${gameState?.persona?.age || 28}, ${gameState?.persona?.city || 'Manhattan'}), Charisma: ${gameState?.persona?.charisma || 30}, Intellect: ${gameState?.persona?.intellect || 35}, Elegance: ${gameState?.persona?.elegance || 25}, Health: ${gameState?.persona?.health || 90}/100, Influence: ${gameState?.persona?.influence || 20}, Unallocated Points: ${gameState?.persona?.unallocatedStatusPoints || 0} PTS
- Active Daily 24h Objectives: ${gameState?.dailyObjectives?.map((o: any) => `[${o.title}: ${o.progress}, Completed: ${o.completed}]`).join(', ') || 'None active'}
- Latest Breaking Market News: "${gameState?.latestNews || 'Markets calm'}"

YOUR PERSONA & GUIDELINES:
1. Speak as a distinguished, ultra-sharp Wall Street tycoon & private counselor. You are loyal, shrewd, and deeply knowledgeable about high finance, corporate acquisitions, real estate leverage, banking margins, and equities.
2. Directly refer to their exact numbers, assets, and news events from their live game state.
3. Offer strategic advice on what to buy next (e.g. acquire automated businesses, buy dividend stocks when prices drop, renovate properties for 30% rent boosts, or acquire a banking license).
4. Keep responses punchy, engaging, and atmospheric (2 to 4 concise paragraphs max).
5. If the player asks about current news or random market spikes, explain how it affects their empire or how they can profit from it.`;

    // Construct conversation contents
    const contents: any[] = [];
    
    // Add previous conversation turns
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        contents.push({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        });
      }
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 600,
      }
    });

    const replyText = response.text || "I have reviewed your financial dossiers, Chief Executive. Let us continue scaling your empire.";

    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error generating advisor response:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to consult with Executive Advisor.'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
