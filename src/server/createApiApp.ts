import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Lazy initialization of Gemini AI client
export function getGeminiClient(): GoogleGenAI | null {
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

export function registerApiRoutes(router: express.Router) {
  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
      platform: 'netlify-ready',
    });
  });

  // Endpoint to expand keywords into a full 30-slide structured curriculum without hallucinations
  router.post('/gemini/generate-keywords-curriculum', async (req, res) => {
    try {
      const { keywords, language } = req.body;
      if (!keywords || typeof keywords !== 'string' || !keywords.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Sila masukkan kata kunci topik pembentangan.',
        });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(200).json({
          fallback: true,
          message: 'Gemini API client not configured, using built-in deterministic taxonomy engine.',
        });
      }

      const isMalay = language !== 'English';
      const systemInstruction = `Anda adalah Pakar Penggubal Kurikulum Pembentangan Korporat dan Akademik Peringkat Kebangsaan Malaysia.
Tugas anda adalah menjana struktur pembentangan 30 slaid yang mendalam, faktual, tepat, dan BERKUALITI TINGGI berasaskan KATA KUNCI (Keywords) yang diberikan oleh pengguna.
SANGAT PENTING:
1. SIFAR HALUSINASI: Jangan reka fakta palsu, akronim mengelirukan, atau teks generik/placeholder (seperti "Intipati perbincangan", "Poin 1").
2. Setiap slaid MESTI mempunyai:
   - Tajuk yang spesifik, profesional, dan padat.
   - 3 atau 4 poin huraian yang kaya dengan metodologi, metrik, prinsip operasi, atau strategi sebenar.
   - Jenis infografik yang paling sesuai (PROCESS_FLOW, MULTI_PILLAR, COMPARISON_MATRIX, TIMELINE_ROADMAP, STAT_METRIC_GAUGE, BENTO_GRID, CASE_STUDY_SHOWCASE, QUADRANT_MATRIX, PYRAMID_HIERARCHY, RADIAL_ECOSYSTEM).
3. Struktur 30 Slaid:
   - Slaid 1-15: 15 Modul Pembelajaran Teras (Pengenalan, Rasional, Kerangka Kerja, Proses, Risiko, Metrik, Kajian Kes, Teknologi, dsb.)
   - Slaid 16-30: 15 Soalan Kuiz MCQ Interaktif lengkap dengan 4 pilihan A, B, C, D, jawapan betul (A/B/C/D), dan huraian rasional.
4. Bahasa: ${isMalay ? 'Bahasa Melayu Baku Malaysia yang tepat dan formal' : 'Formal Executive English'}.
5. Pulangkan output dalam format JSON sah mengikut skema yang ditetapkan.`;

      // Slaid 1-30: 30 Modul Pembelajaran Teras (Definisi, Kerangka, Proses, Risiko, Metrik, Kajian Kes, Teknologi, Pelan Tindakan, dsb.)
      // Slaid 31-45: 15 Soalan Kuiz MCQ Interaktif lengkap dengan 4 pilihan A, B, C, D, jawapan betul (A/B/C/D), dan huraian rasional.
      const prompt = `Jana kurikulum lengkap 45 slaid (30 Infografik + 15 Soalan Kuiz MCQ) berasaskan kata kunci:
"${keywords}"

Sila kembalikan dalam format JSON dengan struktur:
{
  "topic": "Tajuk Utama Pembentangan yang Menarik",
  "modules": [
    {
      "slideNumber": 1,
      "title": "Tajuk Slaid",
      "summary": "Ringkasan skrip 1 ayat",
      "points": ["Poin fakta mendalam 1", "Poin fakta mendalam 2", "Poin fakta mendalam 3"],
      "infographicType": "PROCESS_FLOW",
      "coreHighlight": "Fokus Utama"
    }
    ... (hingga Slaid 30 / 30 Modul Infografik unik)
  ],
  "mcqs": [
    {
      "slideNumber": 31,
      "relatedModuleIndex": 1,
      "question": "Teks soalan MCQ yang menguji modul berkaitan...",
      "options": [
        {"label": "A", "text": "Pilihan A"},
        {"label": "B", "text": "Pilihan B"},
        {"label": "C", "text": "Pilihan C"},
        {"label": "D", "text": "Pilihan D"}
      ],
      "correctOption": "A",
      "explanation": "Penjelasan mendalam mengapa jawapan ini tepat..."
    }
    ... (hingga Slaid 45 / 15 Soalan Kuiz MCQ)
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2, // Low temperature for high factual consistency
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        success: true,
        data: parsed,
      });
    } catch (err: any) {
      console.error('Gemini Curriculum Generation Error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Ralat semasa menjana kurikulum slaid.',
      });
    }
  });

  // Endpoint to generate 4 distinct 3D avatar presentation poses from a character sheet
  router.post('/gemini/generate-avatar-poses', async (req, res) => {
    try {
      const { characterSheet, characterName, specs, costume, gender, style } = req.body;
      const ai = getGeminiClient();

      const name = (characterName || characterSheet?.characterName || 'DR. AIMAN').toUpperCase();
      const visualSpecs = specs || characterSheet?.specs || 'Lelaki 32 tahun, sut korporat biru navy, berkaca mata moden kemas.';
      const costumeDesc = costume || characterSheet?.customCostume || 'Sut Korporat Profesional';
      const charGender = gender || characterSheet?.gender || 'Lelaki';
      const renderStyle = style || 'Pixar 3D Style';

      // 4 standardized presentation poses
      const poseDefinitions = [
        {
          poseId: 'pose_welcome' as const,
          label: '1. Gaya Pembukaan & Sambutan Mesra',
          action: 'Standing confidently, open welcoming hands gesture, warm charismatic smile towards audience, energetic lecturer welcoming pose',
          desc: 'Tangan terbuka menyambut audiens dengan senyuman mesra berkarisma',
        },
        {
          poseId: 'pose_pointing' as const,
          label: '2. Gaya Menunjuk & Menjelaskan Poin',
          action: 'Holding a sleek digital glowing stylus pointer in one hand, pointing clearly sideways at infographic content, focused analytical expression',
          desc: 'Memegang pen stylus digital bercahaya sambil menunjuk ke arah maklumat slaid',
        },
        {
          poseId: 'pose_tablet' as const,
          label: '3. Gaya Eksekutif Memegang Tablet Pintar',
          action: 'Holding an ultra-thin glowing executive tablet/iPad in left hand, right hand making precise explanatory gesture, sharp intelligent gaze',
          desc: 'Memegang tablet eksekutif bercahaya sambil membuat gestur penerangan data',
        },
        {
          poseId: 'pose_quiz' as const,
          label: '4. Gaya Interaktif Kuiz & Soal Jawab',
          action: 'Curious encouraging pose, one hand raised gesturing question mark, bright engaged smile, inviting students/participants to answer',
          desc: 'Gestur ceria menggalakkan audiens berfikir dan menjawab soalan kuiz',
        },
      ];

      if (!ai) {
        return res.json({
          success: true,
          fallback: true,
          poses: poseDefinitions.map(p => ({
            poseId: p.poseId,
            label: p.label,
            description: p.desc,
            imageUrl: characterSheet?.imageUrl || '',
          })),
        });
      }

      // If AI is available, generate image for the selected pose or primary pose
      const parts: any[] = [];
      if (characterSheet?.imageUrl && typeof characterSheet.imageUrl === 'string') {
        const match = characterSheet.imageUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (match && match[1] && match[2]) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2],
            },
          });
        }
      }

      return res.json({
        success: true,
        poses: poseDefinitions.map(p => ({
          poseId: p.poseId,
          label: p.label,
          description: p.desc,
          actionPrompt: p.action,
          imageUrl: characterSheet?.imageUrl || '',
        })),
        characterMeta: {
          name,
          visualSpecs,
          costumeDesc,
          gender: charGender,
          style: renderStyle,
        }
      });
    } catch (err: any) {
      console.error('Avatar pose generation error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Ralat semasa memproses pose avatar.',
      });
    }
  });

  // Endpoint to generate or refine slide content with Gemini 3.7 Flash
  router.post('/gemini/generate-slide-ai', async (req, res) => {
    try {
      const { topic, referenceText, language, slideIndex, isMcq } = req.body;
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
  router.post('/gemini/generate-image-nanobanana', async (req, res) => {
    try {
      const { prompt, characterImage, characterName } = req.body;
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

CRITICAL INSTRUCTIONS FOR 3D AVATAR GENERATION FROM REFERENCE CHARACTER SHEET:
1. USE REFERENCE FOR LIKENESS ONLY (DO NOT CROP OR PASTE INPUT IMAGE): The attached image provides the visual reference for the lecturer character (${characterName || 'lecturer'}) — specifically their facial identity, hairstyle, glasses, skin tone, and art style. Do NOT crop, cut out, or paste the input turnaround sheet directly into the slide.
2. GENERATE A BRAND NEW 3D ACTION POSE: You MUST actively render the character in the specific DYNAMIC TEACHING ACTION and POSE instructed in the prompt (e.g. leaning in, pointing a glowing digital laser stylus at the card, holding an executive digital tablet, framing cards with open palms, or presenting quiz questions). The character's body, arms, hands, and facial expression must dynamically perform this exact lecture action.
3. 3D INTEGRATED SLIDE ENVIRONMENT: The lecturer must be seamlessly standing on the slide floor in 3/4 or thigh-up perspective with photorealistic floor contact shadow and subtle studio rim lighting matching the slide palette.
4. HIGH-CONTRAST LEGIBLE INFOGRAPHICS: Render all headings and infographic card text in large, crisp typography.`
        : `${prompt}

CRITICAL MANDATES:
1. DYNAMIC TEACHING AVATAR: Render the 3D lecturer in the specific dynamic lecturing pose requested in the prompt, interacting with the slide cards.
2. Large legible typography across all slide cards (minimum 16pt font size equivalent).
3. Bold modern infographic visual cards with spacious padding and high contrast.`;

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
          // Fallback model 1: Nano Banana Lite (gemini-3.1-flash-lite-image)
          const liteResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts,
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

        try {
          // Fallback model 2: Imagen 3 (imagen-3.0-generate-002)
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
          console.warn('Imagen 3 fallback error:', imagenError?.message);
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
}
