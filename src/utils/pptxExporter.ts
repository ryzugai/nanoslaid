import pptxgen from 'pptxgenjs';
import { SlideData, SetupConfig } from '../types';
import { renderSlideToCanvasDataUrl } from './imageRenderer';

export interface PptxExportOptions {
  slides: SlideData[];
  config: SetupConfig;
  includeNotes?: boolean;
  onProgress?: (current: number, total: number, message: string) => void;
}

/**
 * Exports slides and their generated images directly into a modern PowerPoint (.pptx) file.
 * If a slide does not yet have a generated image URL, renders its HD canvas image on-the-fly.
 */
export async function exportSlidesToPptx({
  slides,
  config,
  includeNotes = true,
  onProgress,
}: PptxExportOptions): Promise<void> {
  if (!slides || slides.length === 0) {
    throw new Error('Tiada slaid untuk dieksport.');
  }

  const pptx = new pptxgen();

  // Configure 16:9 Widescreen Layout
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = config.topic || 'Pembentangan Slaid Rasmi';
  pptx.author =
    config.characterSheet?.characterName ||
    config.nametagText ||
    'Pakar Penjana 45 Slaid';
  pptx.company = 'Pakar Penjana Slaid Nano Banana 2 & Veo';
  pptx.subject = `Topik: ${config.topic || 'Pembentangan Rasmi'}`;

  const total = slides.length;

  for (let i = 0; i < total; i++) {
    const slideData = slides[i];
    const currentNum = i + 1;

    if (onProgress) {
      onProgress(
        currentNum,
        total,
        `Menyediakan Slaid ${slideData.slideNumber} / ${total}: "${slideData.title.slice(0, 30)}..."`
      );
    }

    const pptSlide = pptx.addSlide();

    // Get or render the high-definition image data URL
    let imageDataUrl = slideData.generatedImageUrl;
    if (!imageDataUrl) {
      try {
        imageDataUrl = await renderSlideToCanvasDataUrl(slideData, config);
      } catch (renderErr) {
        console.warn(`Error rendering slide ${slideData.slideNumber} to canvas:`, renderErr);
      }
    }

    // Add full-bleed widescreen slide image
    if (imageDataUrl) {
      pptSlide.addImage({
        data: imageDataUrl,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
      });
    }

    // Add Slide Presenter Notes (Avatar Script + Veo Prompts + Meta)
    if (includeNotes) {
      const presenterName =
        slideData.assignedAvatar?.characterName ||
        config.characterSheet?.characterName ||
        config.nametagText ||
        'DR. AIMAN';

      const notes = `[SLAID ${slideData.slideNumber}]: ${slideData.title}
Kategori: ${slideData.isMcq ? 'UJI MINDA (SOALAN MCQ)' : `INFOGRAFIK (${slideData.infographicType || 'BENTO GRID'})`}
Watak Presenter: ${presenterName} (Kedudukan: ${slideData.characterPosition})

========================================================================
[1. AYAT DIALOG PENERANGAN AVATAR (UNTUK 30 SAAT)]:
"${slideData.scriptAvatar30s}"

========================================================================
[2. TEKS PROMPT ANIMASI VEO (10 SAAT - VERSI 1)]:
${slideData.promptVeo10s}

========================================================================
[3. TEKS PROMPT ANIMASI VEO (5 SAAT - VERSI 2)]:
${slideData.promptVeo5s}

========================================================================
[4. TEKS PROMPT IMEJ NANO BANANA 2]:
${slideData.promptNanoBanana2}
`;

      pptSlide.addNotes(notes);
    }
  }

  if (onProgress) {
    onProgress(total, total, 'Menjana dan memuat turun fail .pptx...');
  }

  // Generate clean filename
  const cleanTopic = (config.topic || 'pembentangan_slaid')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 35);
  const fileName = `45_Slaid_${cleanTopic}_NanoBanana2.pptx`;

  await pptx.writeFile({ fileName });
}

/**
 * Exports a single slide to a PowerPoint (.pptx) file.
 */
export async function exportSingleSlideToPptx(
  slide: SlideData,
  config: SetupConfig
): Promise<void> {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = slide.title;
  pptx.author =
    slide.assignedAvatar?.characterName ||
    config.characterSheet?.characterName ||
    config.nametagText ||
    'Pakar Penjana Slaid';

  const pptSlide = pptx.addSlide();

  let imageDataUrl = slide.generatedImageUrl;
  if (!imageDataUrl) {
    imageDataUrl = await renderSlideToCanvasDataUrl(slide, config);
  }

  if (imageDataUrl) {
    pptSlide.addImage({
      data: imageDataUrl,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
    });
  }

  const notes = `[SLAID ${slide.slideNumber}]: ${slide.title}
Dialog Avatar (30s): "${slide.scriptAvatar30s}"
Prompt Veo 10s: ${slide.promptVeo10s}
Prompt Veo 5s: ${slide.promptVeo5s}`;

  pptSlide.addNotes(notes);

  const cleanTitle = slide.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 30);
  const fileName = `Slaid_${slide.slideNumber}_${cleanTitle}.pptx`;

  await pptx.writeFile({ fileName });
}
