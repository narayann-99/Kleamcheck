import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI only if a real API key is present
const rawKey = process.env.GEMINI_API_KEY?.trim() || '';
const hasValidKey = Boolean(
  rawKey &&
  rawKey !== 'MY_GEMINI_API_KEY' &&
  !rawKey.startsWith('MY_') &&
  rawKey.length > 10
);
const ai = hasValidKey ? new GoogleGenAI({ apiKey: rawKey }) : null;

// Pre-computed fallback responses in natural Hinglish if API key is not present or offline
const FALLBACK_HINGLISH: Record<string, string> = {
  user: `👋 **CleanCheck Kya Hai & Ye Kaise Kaam Karta Hai? (Aam Zindagi Mode)**

Bhai, CleanCheck ek smart payment evidence checking tool hai jo online sellers, shopkeepers, aur freelancers ko fake payment screenshot scams se bachata hai.

### 🔍 Ye 4 Steps Me Kaam Karta Hai:

1. **Screenshot Upload**: Aap customer ka bheja hua payment screenshot (Google Pay, PhonePe, Paytm) upload karte ho.
2. **Duplicate Check (Recycled Receipt)**: System turant check karta hai ki kya yehi screenshot pehle kisi aur order pe ya kisi aur ko toh nahi bheja gaya tha (Image Fingerprinting se).
3. **Details Extraction**: Screenshot me se visible amount, 12-digit UTR (reference number), date, aur payee UPI ID ko padhta hai.
4. **Order Match & Warnings**: Agar aapne Rs. 1,500 ka samaan becha hai aur screenshot Rs. 150 ka ya edited font wala hai, toh system turant Laal (Red) ya Peela (Amber) alert de deta hai!

⚠️ **Sabse Zaroori Baat (Golden Rule)**:
Screenshot sirf ek photo hoti hai, bank settlement ka pakka proof nahi! Jab tak aapke khud ke bank SMS ya banking app me paise aane ka message na dikhe, tab tak parcel ya item dispatch mat karo.`,

  dev: `🛠️ **CleanCheck Interior Architecture & Working (Dev Info Mode)**

CleanCheck ka architecture client-side privacy, double-hashing algorithms, aur rule-based heuristics par designed hai.

### 🏗️ Interior Architecture & Flow:

1. **Privacy-First Client-Side Canvas Decoding**:
Image browser memory me HTMLCanvasElement ke through render hoti hai. Raw unencrypted receipts bina user action ke server par upload nahi hoti.

2. **Dual-Layer Duplicate Fingerprint Detection**:
SHA-256 exact cryptographic hash identical files ko 100% catch karta hai. Aur 64-bit Perceptual Hash (DCT / pHash) image ko 32x32 grayscale me convert karke visual fingerprint banata hai. Iska Hamming distance <= 10 hone par cropped ya compressed duplicate bhi pakad leta hai.

3. **Heuristic Parsing & Pattern Matching**:
Indian UPI receipt patterns ko parse karta hai: 12-digit UPI UTR regex (\\b[0-9]{12}\\b), currency amounts, aur Payee VPA handles (@okaxis, @okhdfcbank, @ybl, @paytm).

4. **Risk Scoring Matrix**:
Clean (Green): Exact amount match, unique hash, valid 12-digit UTR.
Warning (Amber): Low confidence OCR, slight time discrepancy, or repeat submission.
Critical (Red): Amount mismatch with expected order, duplicate recycled hash across orders, or invalid UTR structure.

5. **AI Explainer Proxy**:
Express server endpoint (/api/explain) server-side Gemini 3.8 Flash model se communicate karta hai, ensuring zero API key exposure on the client-side.`,
};

// API endpoint for AI Explainer in Hinglish
app.post('/api/explain', async (req, res) => {
  try {
    const { mode = 'user', question } = req.body;

    // If custom question is provided or specific mode is requested with AI available
    if (ai) {
      const systemInstruction = `You are CleanCheck AI Explainer - an intelligent, warm, and highly engaging assistant built directly into the CleanCheck payment evidence platform.
Your primary superpower is explaining payment fraud detection, receipt verification, and architecture in friendly, crisp, natural HINGLISH (conversational Hindi written in English script).

Guidelines:
- Language: Natural Hinglish (e.g., "Bhai CleanCheck ka main kaam ye hai...", "Dekho, agar koi customer fake receipt bhejta hai...").
- Tone: Helpful, respectful, tech-savvy, and conversational.
- Target Modes:
  1. 'user' mode: Keep it easy to understand for ordinary shopkeepers, Instagram sellers, and students. Use real-life scenarios (OLX selling, Instagram DMs, fake Paytm spoof apps). Highlight the golden rule: screenshot is not bank settlement proof.
  2. 'dev' mode: Explain interior technical architecture, client-side Canvas pixel manipulation, SHA-256 cryptographic hash, 64-bit Discrete Cosine Transform (DCT) perceptual hashing, Hamming distance, UPI UTR regex parsing, risk scoring matrix, and full-stack API proxying.
- If the user asks a specific question, answer it directly in Hinglish with clear bullet points.
- Never mention internal API keys or backend setup steps. Focus on product value, fraud prevention, and architecture.`;

      let userPrompt = '';
      if (question && question.trim().length > 0) {
        userPrompt = `User asks in ${mode === 'dev' ? 'Dev Info' : 'User-Friendly'} mode: "${question}". Answer clearly in conversational Hinglish.`;
      } else if (mode === 'dev') {
        userPrompt = `Explain CleanCheck's complete interior technical architecture, fetching mechanism, dual-hashing (SHA-256 and 64-bit DCT perceptual hash), OCR heuristics, and risk scoring matrix in Hinglish. Keep it informative, structured, and developer-friendly.`;
      } else {
        userPrompt = `Explain how CleanCheck works in a friendly, simple, user-friendly Hinglish style for a normal person or shopkeeper. Explain screenshot verification, duplicate receipt detection, what it checks, and why screenshot alone is not bank settlement proof.`;
      }

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI request timeout')), 2500)
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.6,
          },
        }),
        timeoutPromise,
      ]);

      const reply = response.text || FALLBACK_HINGLISH[mode] || FALLBACK_HINGLISH.user;
      return res.json({
        success: true,
        reply,
        mode,
        isAiGenerated: true,
      });
    }

    // Graceful fallback if no API key configured
    let fallbackReply = FALLBACK_HINGLISH[mode] || FALLBACK_HINGLISH.user;
    if (question && question.trim().length > 0) {
      const qLower = question.toLowerCase();
      if (qLower.includes('fake') || qLower.includes('spoof') || qLower.includes('pakad')) {
        fallbackReply = `🔍 **Fake Screenshot Kaise Pakadte Hain? (Hinglish Guide)**

Bhai, fake payment screenshots (jaise spoof apps ya edited photos) pakadne ke liye CleanCheck 3 main cheezon par dhyan deta hai:
1. **Duplicate Perceptual Hash**: Bahut se fraud log ek hi purani screenshot ko Photoshop karke baar-baar alag sellers ko bhejte hain. CleanCheck ka algorithm image ka visual fingerprint banata hai aur pakad leta hai.
2. **UTR Format & Missing Digits**: Real UPI apps me 12-digit unique reference number (UTR) hota hai. Fake apps aksar dummy ya invalid format generate karti hain.
3. **Font & Alignment Inconsistencies**: Original GPay, PhonePe aur Paytm ka font weight aur spacing exact hota hai. Agar kisi ne photo editor se amount badla hai, toh bounding box aur text alignment me mismatch pakda jata hai.

💡 **Pro Tip**: Hamesha apne bank statement ya official merchant soundbox/SMS se verify karo!`;
      } else if (qLower.includes('hash') || qLower.includes('dct') || qLower.includes('algorithm')) {
        fallbackReply = `🧮 **Perceptual Hash & SHA-256 Working (Dev Deep Dive)**

CleanCheck me 2-step hashing use hoti hai:
1. **SHA-256 (Binary Exact Match)**: File ke raw byte buffer ka cryptographic hash. Agar user ne bilkul wahi exact file upload ki, toh binary match turant 100% duplicate declare karta hai.
2. **pHash (DCT Perceptual Hash)**:
   - Image ko 32x32 grayscale me downscale kiya jata hai.
   - 2D Discrete Cosine Transform (DCT) matrix compute hoti hai jo high-frequency noise hata kar low-frequency visual structure rakhti hai.
   - 8x8 top-left low frequencies ka median nikal kar 64-bit binary hash banta hai.
   - Jab do screenshots aati hain, unka **Hamming Distance** check hota hai. Agar distance <= 10 hai, iska matlab image cropped, compressed, ya re-saved duplicate hai!`;
      } else if (qLower.includes('safe') || qLower.includes('privacy') || qLower.includes('security')) {
        fallbackReply = `🔒 **Data Privacy & Security (Hinglish)**

Aapka data bilkul safe hai:
- **Local Client-Side Processing**: Default scan aapke browser ke andar HTML5 Canvas se decode hota hai.
- **No Unnecessary Cloud Storage**: Aapke sensitive customer screenshots kisi public database me beche nahi jaate.
- **Audit Logs in Local Storage**: MVP me scan history aapke browser ke private localStorage me rehti hai jise aap jab chahe clear kar sakte ho.`;
      }
    }

    return res.json({
      success: true,
      reply: fallbackReply,
      mode,
      isAiGenerated: false,
    });
  } catch (error) {
    console.error('Error in /api/explain:', error);
    const mode = req.body?.mode === 'dev' ? 'dev' : 'user';
    return res.json({
      success: true,
      reply: FALLBACK_HINGLISH[mode] || FALLBACK_HINGLISH.user,
      mode,
      isAiGenerated: false,
      error: 'Using fallback response due to transient connection error',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function setupApp() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CleanCheck server active on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
