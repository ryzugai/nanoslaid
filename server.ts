import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Lazy initialization of Gemini AI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint to generate or refine slide content with Gemini 3.7 Flash
app.post('/api/gemini/generate-slide-ai', async (req, res) => {
  try {
    const { topic, referenceText, language, slideIndex, isMcq, colorSchemeName, nametag } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'API Key not provided, using high-craft local synthesizer engine.',
      });
    }

    const systemPrompt = `Anda adalah Pakar Penjana Prompt Imej (Nano Banana 2), Dua Versi Prompt Video Animasi Veo (10s & 5s), dan Skrip Penerangan Avatar 30s untuk Slaid Pembentangan Profesional Malaysia.
Bahasa output: ${language || 'Bahasa Melayu Baku Malaysia'}.
Gunakan ketepatan ejaan tanpa cacat (flawless typography, exact spelled text).`;

    const userPrompt = `Jana intipati kandungan kaya dan mendalam untuk ${isMcq ? `Slaid Soalan MCQ (Slaid ${slideIndex})` : `Slaid Infografik Utama (Slaid ${slideIndex})`} bagi topik: "${topic}".
Teks rujukan: ${referenceText || 'Tiada'}.
Sila berikan tajuk berimpak tinggi, 3 poin utama, skrip penerangan avatar 30 saat yang bernas, dan ${isMcq ? 'soalan MCQ dengan 4 pilihan A,B,C,D berserta jawapan betul dan penjelasan.' : 'highlight teras.'}
Pulangkan dalam format JSON yang sah.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Ralat semasa memproses AI generation',
    });
  }
});

// Endpoint to generate high-resolution image using Nano Banana 2 (gemini-3.1-flash-image)
app.post('/api/gemini/generate-image-nanobanana', async (req, res) => {
  try {
    const { prompt, slideNumber, characterImage, characterName } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Prompt teks Nano Banana 2 diperlukan.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: false,
        useCanvasRenderer: true,
        message: 'Kunci API Gemini tiada dalam konfigurasi persekitaran. Menggunakan pemapar grafik HD tempatan.',
      });
    }

    // Prepare multimodal parts if character reference image is provided
    const parts: any[] = [];
    if (characterImage && typeof characterImage === 'string') {
      const match = characterImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match && match[1] && match[2]) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    const enhancedPrompt = characterImage
      ? `${prompt}

CRITICAL MANDATES FOR NANO BANANA 2 IMAGE GENERATION:
1. NEW DYNAMIC PRESENTER GENERATION: Do NOT copy, crop, or paste the input reference sheet image as-is. Instead, generate a BRAND-NEW 3D render of the character (${characterName || 'presenter'}) from the reference image, preserving their exact face, hair, glasses, clothing style, and identity, but rendered in a fresh, lively, active presentation pose (pointing at infographic points, holding a presentation stylus, or welcoming the audience).
2. SEAMLESS BACKGROUND INTEGRATION: The character must stand organically on the slide floor with NO white rectangular box, NO background frame, and NO multi-angle sheet around them. The character's background must be 100% blended into the slide's ambient lighting and studio environment.
3. LARGE & HIGH-CONTRAST TYPOGRAPHY: All infographic points, cards, and labels on the slide must use large, crisp, bold, highly legible typography (minimum 16pt font size equivalent) with high color contrast against card backgrounds.
4. NO SMALL OR CLUTTERED TEXT: Keep all card content bold, spacious, and eye-catching with clear numerical badges and icons.`
      : `${prompt}

CRITICAL MANDATES:
1. Large legible typography across all slide cards (minimum 16pt font size equivalent).
2. Bold modern infographic visual cards with spacious padding and high contrast.
3. Charismatic 3D presenter seamlessly standing on the slide floor.`;

    parts.push({ text: enhancedPrompt });

    try {
      // Primary model: Nano Banana 2 (gemini-3.1-flash-image)
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts,
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
            imageSize: '1K',
          },
        },
      });

      for (const candidate of response.candidates || []) {
        for (const part of candidate.content?.parts || []) {
          if (part.inlineData && part.inlineData.data) {
            const base64EncodeString = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
            return res.json({
              success: true,
              imageUrl,
              source: 'gemini-nanobanana-2',
              model: 'Nano Banana 2 (gemini-3.1-flash-image)',
            });
          }
        }
      }
    } catch (genError: any) {
      console.warn('Gemini 3.1 Flash Image error, trying fallback models:', genError?.message);

      try {
        // Fallback model 1: Imagen 3 (imagen-3.0-generate-002)
        const imagenResponse = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt,
          config: {
            numberOfImages: 1,
            aspectRatio: '16:9',
            outputMimeType: 'image/png',
          },
        });

        if (imagenResponse.generatedImages && imagenResponse.generatedImages.length > 0) {
          const imgBase64 = imagenResponse.generatedImages[0].image.imageBytes;
          if (imgBase64) {
            return res.json({
              success: true,
              imageUrl: `data:image/png;base64,${imgBase64}`,
              source: 'imagen-3.0-generate-002',
              model: 'Imagen 3.0 (16:9 HD Infographic)',
            });
          }
        }
      } catch (imagenError: any) {
        console.warn('Imagen 3 fallback error, trying gemini-2.5-flash-image / lite:', imagenError?.message);
      }

      try {
        // Fallback model 2: Gemini 2.5 Flash Image
        const flash25Response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts,
          },
          config: {
            imageConfig: {
              aspectRatio: '16:9',
            },
          },
        });

        for (const candidate of flash25Response.candidates || []) {
          for (const part of candidate.content?.parts || []) {
            if (part.inlineData && part.inlineData.data) {
              const base64EncodeString = part.inlineData.data;
              const mimeType = part.inlineData.mimeType || 'image/png';
              const imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
              return res.json({
                success: true,
                imageUrl,
                source: 'gemini-2.5-flash-image',
                model: 'Gemini 2.5 Flash Image',
              });
            }
          }
        }
      } catch (flash25Error: any) {
        console.warn('Gemini 2.5 Flash Image error, trying gemini-3.1-flash-lite-image:', flash25Error?.message);
      }

      try {
        // Fallback model 3: Nano Banana Lite (gemini-3.1-flash-lite-image)
        const liteResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: '16:9',
            },
          },
        });

        for (const candidate of liteResponse.candidates || []) {
          for (const part of candidate.content?.parts || []) {
            if (part.inlineData && part.inlineData.data) {
              const base64EncodeString = part.inlineData.data;
              const mimeType = part.inlineData.mimeType || 'image/png';
              const imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
              return res.json({
                success: true,
                imageUrl,
                source: 'gemini-nanobanana-lite',
                model: 'Nano Banana Lite (gemini-3.1-flash-lite-image)',
              });
            }
          }
        }
      } catch (liteError: any) {
        console.warn('Fallback lite image model error:', liteError?.message);
      }
    }

    // If models could not generate, tell frontend to use high-craft canvas renderer
    return res.json({
      success: false,
      useCanvasRenderer: true,
      message: 'Khidmat penjanaan berasaskan pelayan tidak mengembalikan imej. Menggunakan pemapar grafik HD tematik.',
    });
  } catch (err: any) {
    console.error('Image Generation Route Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Ralat semasa menjana imej Nano Banana 2',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pakar Penjana 45 Slaid Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
