import JSZip from 'jszip';

export interface ExtractedPptSlide {
  slideNumber: number;
  title: string;
  bullets: string[];
  rawText: string;
}

export interface PptParseResult {
  fileName: string;
  fileSize: string;
  slideCount: number;
  extractedSlides: ExtractedPptSlide[];
  fullExtractedText: string;
  suggestedTopic: string;
}

/**
 * Format bytes to readable size string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Parses a .pptx file using JSZip and browser DOMParser
 */
export async function parsePptxFile(file: File): Promise<PptParseResult> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  const slideFiles: { name: string; num: number }[] = [];

  // Find all slide XML files in ppt/slides/
  loadedZip.forEach((relativePath) => {
    const match = relativePath.match(/^ppt\/slides\/slide(\d+)\.xml$/i);
    if (match) {
      slideFiles.push({
        name: relativePath,
        num: parseInt(match[1], 10),
      });
    }
  });

  // Sort slides numerically
  slideFiles.sort((a, b) => a.num - b.num);

  const parser = new DOMParser();
  const extractedSlides: ExtractedPptSlide[] = [];

  for (let i = 0; i < slideFiles.length; i++) {
    const slideItem = slideFiles[i];
    const xmlContent = await loadedZip.file(slideItem.name)?.async('text');

    if (!xmlContent) continue;

    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

    // Extract text paragraphs
    const paragraphs = xmlDoc.getElementsByTagName('a:p');
    const paragraphTexts: string[] = [];

    for (let p = 0; p < paragraphs.length; p++) {
      const pElem = paragraphs[p];
      const textNodes = pElem.getElementsByTagName('a:t');
      let pText = '';
      for (let t = 0; t < textNodes.length; t++) {
        pText += textNodes[t].textContent || '';
      }
      pText = pText.trim();
      if (pText.length > 0) {
        paragraphTexts.push(pText);
      }
    }

    // Determine title vs bullets
    let title = `Slaid ${i + 1}`;
    let bullets: string[] = [];

    if (paragraphTexts.length > 0) {
      title = paragraphTexts[0];
      bullets = paragraphTexts.slice(1);
    }

    // Clean up empty lines
    bullets = bullets.filter((b) => b.trim().length > 0);

    const rawText = paragraphTexts.join('\n');

    extractedSlides.push({
      slideNumber: i + 1,
      title,
      bullets,
      rawText,
    });
  }

  // Combine full text
  let fullExtractedText = `=== DOKUMEN SLAID PERSEMBAHAN: ${file.name} ===\n\n`;
  extractedSlides.forEach((s) => {
    fullExtractedText += `[SLAID ${s.slideNumber}: ${s.title}]\n`;
    if (s.bullets.length > 0) {
      s.bullets.forEach((b) => {
        fullExtractedText += `• ${b}\n`;
      });
    } else {
      fullExtractedText += `(Isi kandungan visual / grafik)\n`;
    }
    fullExtractedText += '\n';
  });

  // Suggest topic from first slide title or file name
  let suggestedTopic = file.name.replace(/\.(pptx|ppt)$/i, '').replace(/[-_]/g, ' ');
  if (extractedSlides.length > 0 && extractedSlides[0].title.length > 3) {
    suggestedTopic = extractedSlides[0].title;
  }

  return {
    fileName: file.name,
    fileSize: formatBytes(file.size),
    slideCount: extractedSlides.length,
    extractedSlides,
    fullExtractedText,
    suggestedTopic,
  };
}

/**
 * Generic file reader fallback for text or legacy binary ppt text scanning
 */
export async function parseGenericSlideFile(file: File): Promise<PptParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pptx') {
    return parsePptxFile(file);
  }

  // Fallback for .ppt / .txt / .md
  const text = await file.text();
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  const extractedSlides: ExtractedPptSlide[] = [];
  let currentSlideNum = 1;

  for (let i = 0; i < Math.min(lines.length, 30); i += 3) {
    extractedSlides.push({
      slideNumber: currentSlideNum++,
      title: lines[i] || `Slaid ${currentSlideNum}`,
      bullets: lines.slice(i + 1, i + 3),
      rawText: lines.slice(i, i + 3).join('\n'),
    });
  }

  return {
    fileName: file.name,
    fileSize: formatBytes(file.size),
    slideCount: Math.max(1, extractedSlides.length),
    extractedSlides,
    fullExtractedText: text,
    suggestedTopic: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
  };
}
