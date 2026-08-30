import { SetupConfig, SlideData, InfographicArchetype, InfographicMetaData, McqDetails, McqOption } from '../types';
import { OFFICIAL_COLOR_SCHEMES } from '../data/colorSchemes';

export function getSlideCharacterPosition(slideNumber: number): 'KIRI' | 'KANAN' {
  return slideNumber % 2 === 1 ? 'KIRI' : 'KANAN';
}

export function getSlideEthnicity(slideNumber: number): 'Melayu berhijab' | 'Cina' | 'India' {
  const mod = (slideNumber - 1) % 3;
  if (mod === 0) return 'Melayu berhijab';
  if (mod === 1) return 'Cina';
  return 'India';
}

export function getSlideImageSize(slideNumber: number): 'Besar' | 'Sederhana' | 'Kecil' {
  const mod = (slideNumber - 1) % 3;
  if (mod === 0) return 'Sederhana';
  if (mod === 1) return 'Besar';
  return 'Kecil';
}

export function formatSlideFullBlock(slide: SlideData): string {
  return `SLAID ${slide.slideNumber}: ${slide.title}
* Kedudukan Watak: ${slide.characterPosition}
* Skim Warna Pilihan: ${slide.colorSchemeName}
* Saiz Gambar & Etnik: Saiz ${slide.imageSize} | Rakyat Malaysia Etnik ${slide.ethnicity}
* Tipografi: ${slide.typography}

1. **[Teks Prompt Imej Slaid (Nano Banana 2)]:**
   ${slide.promptNanoBanana2}

2. **[Teks Prompt Animasi Slaid 10 Saat (Veo - Versi 1)]:**
   ${slide.promptVeo10s}

3. **[Teks Prompt Animasi Slaid 5 Saat (Veo - Versi 2)]:**
   ${slide.promptVeo5s}

4. **[Ayat Dialog Penerangan Avatar (Untuk 30 Saat)]:**
   "${slide.scriptAvatar30s}"`;
}

/**
 * Generates dynamic, natural explanatory gestures for the presenter across slides
 */
export function getPresenterDynamicExplainingPose(slideNumber: number, isMcq: boolean): string {
  if (isMcq) {
    const mcqPoses = [
      'Interactive quiz-master posture, enthusiastically raising one hand pointing toward the question header while gesturing with an open palm toward the four multiple-choice option cards [A, B, C, D] inviting the audience to choose',
      'Engaging presentation stance holding a smart digital pointer aimed at the quiz options, wearing a warm curious smile as if asking "Which answer is correct?"',
      'Dynamic thought-provoking pose with one hand gesturing toward the question and the other hand welcoming audience participation',
      'Energetic quiz facilitator posture with open arms framing the MCQ choices, smiling warmly with expressive eye contact',
    ];
    return mcqPoses[(slideNumber - 31) % mcqPoses.length];
  }

  const modulo = slideNumber % 6;
  switch (modulo) {
    case 1:
      return 'Welcoming keynote speaker posture with open arms and a warm confident smile, introducing the key theme with professional poise';
    case 2:
      return 'Active explanatory stance, raising one hand with open palm directing the viewer’s attention directly toward the prominent infographic cards';
    case 3:
      return 'Authoritative teaching pose holding a sleek glowing digital stylus/tablet in one hand, gesturing attentively at the visual data points';
    case 4:
      return 'Dynamic mid-lecture gesture with both hands expressively framing the central diagram, explaining the multi-step strategy with clarity';
    case 5:
      return 'Energetic 3/4 turn posture with one hand gesturing upward toward the growth metrics and visual chart highlights';
    case 0:
    default:
      return 'Professional consulting stance with one hand comfortably rested and the other hand gesturing clearly toward the key summary insights';
  }
}

export function buildOfficialPrompts(params: {
  slideNumber: number;
  title: string;
  config: SetupConfig;
  pointsOrContent: string;
  isMcq: boolean;
  infographicType?: InfographicArchetype;
  infographicMeta?: InfographicMetaData;
  mcqData?: {
    question: string;
    options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
    correctOption: 'A' | 'B' | 'C' | 'D';
    explanation: string;
  };
  script30s: string;
  scriptNarration10s: string;
  scriptConcise5s: string;
}): {
  promptNanoBanana2: string;
  promptVeo10s: string;
  promptVeo5s: string;
} {
  const position = getSlideCharacterPosition(params.slideNumber);
  const scheme = OFFICIAL_COLOR_SCHEMES.find(s => s.id === params.config.colorSchemeId) || OFFICIAL_COLOR_SCHEMES[0];

  const posMalay = position.toLowerCase(); // 'kiri' or 'kanan'
  const posEn = position === 'KIRI' ? 'left' : 'right';

  const nametagSnippet = params.config.useNametag && params.config.nametagText.trim()
    ? `strictly include an authentic chest pocket nametag badge featuring clean UPPERCASE text: '${params.config.nametagText.trim().toUpperCase()}'`
    : `clean corporate attire without nametag`;

  const dynamicPose = getPresenterDynamicExplainingPose(params.slideNumber, params.isMcq);

  const charName = (params.config.characterSheet?.characterName || params.config.nametagText || 'DR. AIMAN').toUpperCase();
  const characterSheetPrompt = params.config.characterSheet?.imageUrl
    ? `strictly preserving 100% identical face, hairstyle, clothing, skin tone, and full likeness from the attached reference Character Sheet image '${charName}', rendered in ${params.config.presenterStyle} art style`
    : params.config.characterSheet?.specs
    ? `strictly preserve character identity '${charName}' (${params.config.characterSheet.specs}${params.config.characterSheet.customCostume ? `, Outfit: ${params.config.characterSheet.customCostume}` : ''}), rendered in ${params.config.presenterStyle} art style`
    : `a charismatic 3D animated presenter in ${params.config.presenterStyle} style`;

  // 1. Nano Banana 2 Image Prompt
  let visualLayoutDesc = '';
  if (params.isMcq && params.mcqData) {
    const optsStr = params.mcqData.options.map(o => `[${o.label}] "${o.text}"`).join(' | ');
    visualLayoutDesc = `An interactive high-tech quiz interface featuring a glowing glassmorphic Question Container: "${params.mcqData.question}" highlighted with dual-color accent gradients, surrounded by 4 elevated rounded option cards (${optsStr}) designed with translucent frosted glass, vibrant glowing letter badges (A, B, C, D), subtle hover glow effects, and zero answer spoiler indicators.`;
  } else if (params.infographicType === 'PROCESS_FLOW' && params.infographicMeta?.steps) {
    const stepsStr = params.infographicMeta.steps.map(s => `Step ${s.step}: [${s.title} - ${s.desc}]`).join(' -> ');
    visualLayoutDesc = `A state-of-the-art horizontal process flow diagram with ${params.infographicMeta.steps.length} glowing translucent step cards linked by directional connector arrows (${stepsStr}), featuring 3D numeric icon badges and structured descriptions.`;
  } else if (params.infographicType === 'STAT_METRIC_GAUGE' && params.infographicMeta?.stats) {
    const statsStr = params.infographicMeta.stats.map(s => `[${s.value} ${s.label} (${s.change || ''})]`).join(', ');
    visualLayoutDesc = `A futuristic executive KPI telemetry dashboard with glowing circular radial percentage gauges and stat metric modules (${statsStr}) with illuminated mini trend indicators and upward delta arrows.`;
  } else if (params.infographicType === 'MULTI_PILLAR' && params.infographicMeta?.pillars) {
    const pillarsStr = params.infographicMeta.pillars.map(p => `Pillar: [${p.title}: ${p.desc}]`).join(' | ');
    visualLayoutDesc = `A clean multi-pillar architectural foundation infographic with vertical elevated frosted glass column cards (${pillarsStr}), each topped with a glowing 3D vector emblem and structured sub-points.`;
  } else if (params.infographicType === 'COMPARISON_MATRIX' && params.infographicMeta?.comparison) {
    const cmp = params.infographicMeta.comparison;
    visualLayoutDesc = `A high-contrast side-by-side dual column comparison matrix card contrasting "${cmp.leftTitle}" (${cmp.leftItems.join(', ')}) against "${cmp.rightTitle}" (${cmp.rightItems.join(', ')}) with distinct checkmark and cross badges.`;
  } else if (params.infographicType === 'RADIAL_ECOSYSTEM' && params.infographicMeta?.nodes) {
    const nodes = params.infographicMeta.nodes;
    const satsStr = nodes.satellites.map(s => `[${s.title}: ${s.desc}]`).join(', ');
    visualLayoutDesc = `A modern radial network ecosystem diagram with a central glowing core hub node ("${nodes.centerNode}") interconnected via glowing orbital connection lines to satellite orbital feature cards (${satsStr}).`;
  } else if (params.infographicType === 'TIMELINE_ROADMAP' && params.infographicMeta?.phases) {
    const phasesStr = params.infographicMeta.phases.map(p => `[${p.phase}: ${p.milestone} - ${p.desc}]`).join(' -> ');
    visualLayoutDesc = `An executive horizontal milestone roadmap timeline across chronological phases (${phasesStr}) with glowing milestone nodes, progress bar fill, and strategic delivery flags.`;
  } else {
    visualLayoutDesc = `A sleek modern asymmetric bento grid dashboard layout comprising a large primary spotlight card, secondary stat metric modules, and an executive key takeaway banner representing: "${params.pointsOrContent}". All card texts and bullet points are rendered in large, highly readable typography (minimum 16pt+ equivalent) with bold headings and high-contrast color hierarchy.`;
  }

  const promptNanoBanana2 = `A commercial-grade 16:9 widescreen presentation slide titled '${params.title}' on the topic '${params.config.topic || params.title}'. The background features breathtaking modern 3D abstract geometric waves, flowing fluid gradient ribbons, subtle isometric grid accents, and volumetric ambient studio rim lighting adhering to the ${scheme.name} color palette (Primary: ${scheme.accentHexes[0] || '#06B6D4'}, Secondary: ${scheme.accentHexes[1] || '#3B82F6'}, Background: ${scheme.bgHex}). Positioned on the ${posMalay} (${posEn}) in a professional thigh-up posture is the presenter character standing naturally on the slide floor (${dynamicPose}, ${characterSheetPrompt}, ${nametagSnippet}). The main presentation area is filled with rich infographic visuals with large, easily readable text (minimum 16pt+ size): ${visualLayoutDesc} Top section displays a prominent bold gradient typography headline '${params.title}' with flawless spelling, crisp kerning, and zero typographical artifacts. Floating 3D rounded icon badges and geometric accents create stunning depth and visual dynamism. Bottom corner shows a clean slide number '${params.slideNumber}'. 8K resolution, photorealistic volumetric lighting, ultra-detailed graphic design render, zero white borders around the presenter, perfectly integrated character.`;

  // 2. Veo 10s Motion Graphics Video Prompt
  let promptVeo10s = '';
  if (params.isMcq && params.mcqData) {
    promptVeo10s = `A high-quality 60fps 10-second motion graphics presentation video using Veo with synchronized narration audio. From 0-2s, presenter character (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}, ${characterSheetPrompt}) on ${posMalay} (${posEn}) animates with natural gestures while speaking script: '${params.scriptNarration10s}'. From 3-4s, question heading '${params.title}' slides in. From 5-6s, MCQ options A, B, C, D slide in one by one. From 7-8s, correct answer Option ${params.mcqData.correctOption} (${params.mcqData.options.find(o => o.label === params.mcqData?.correctOption)?.text}) illuminates with a vibrant pulse glow and checkmark highlight. From 9-10s, layout completes as presenter smiles and gestures to the revealed answer.`;
  } else {
    promptVeo10s = `A high-quality 60fps 10-second motion graphics presentation video using Veo with synchronized narration audio. From 0-2s, presenter character (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}, ${characterSheetPrompt}) on ${posMalay} (${posEn}) animates with natural gestures while speaking script: '${params.scriptNarration10s}'. From 3-4s, gradient heading '${params.title}' slides in with elegant kinetic easing. From 5-6s, core infographic data points smoothly cascade in: '${params.pointsOrContent.slice(0, 140)}'. From 7-8s, central key takeaway metric dynamically highlights with accent glow. From 9-10s, visual composition achieves balanced completeness.`;
  }

  // 3. Veo 5s Fast Motion Graphics Prompt
  let promptVeo5s = '';
  if (params.isMcq && params.mcqData) {
    promptVeo5s = `A high-quality 60fps 5-second motion graphics presentation video using Veo focusing on core key points or instant MCQ answer reveal with narration. From 0-2s, presenter (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}) speaks concise script: '${params.scriptConcise5s}'. From 2-3s, quiz question slides in rapidly. From 3-5s, correct answer Option ${params.mcqData.correctOption} instantly spotlights with bright glowing highlight and sound chime cue.`;
  } else {
    promptVeo5s = `A high-quality 60fps 5-second motion graphics presentation video using Veo focusing on core key points or instant MCQ answer reveal with narration. From 0-2s, presenter (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}) speaks concise script: '${params.scriptConcise5s}'. From 2-3s, heading '${params.title}' slides in. From 3-5s, essential key highlights and focal infographic point (${params.pointsOrContent.slice(0, 80)}) instantly spotlight with crisp accent illumination.`;
  }

  return { promptNanoBanana2, promptVeo10s, promptVeo5s };
}

interface OutlineItem {
  title: string;
  summary: string;
  points: string[];
  coreHighlight: string;
  infographicType: InfographicArchetype;
  meta: InfographicMetaData;
}

/**
 * Intelligent clean parser to extract structured bullet points from raw text
 */
function cleanAndExtractBullets(rawLines: string[]): string[] {
  const result: string[] = [];
  for (const raw of rawLines) {
    if (!raw || !raw.trim()) continue;
    const trimmed = raw.trim();
    // Filter out purely decorative slide numbers or tags like "Lecture 3", "Slide 1"
    if (/^(lecture|kuliah|bab|chapter|part|slaid|slide)\s*\d+$/i.test(trimmed)) {
      continue;
    }
    if (trimmed.includes('|')) {
      result.push(...trimmed.split('|').map(s => s.trim()).filter(Boolean));
    } else if (trimmed.includes('\n')) {
      result.push(...trimmed.split('\n').map(s => s.trim()).filter(Boolean));
    } else {
      result.push(trimmed.replace(/^[•\-\*–—\d+\.]\s*/, ''));
    }
  }
  return result.filter(b => b.length > 0);
}

/**
 * Automatically detects the best matching infographic archetype based on actual content
 */
function detectArchetypeFromContent(title: string, points: string[], idx: number): {
  infographicType: InfographicArchetype;
  meta: InfographicMetaData;
} {
  const combined = (title + ' ' + points.join(' ')).toLowerCase();

  // 1. Process / Steps / Flow
  if (/proses|langkah|aliran|fasa|step|flow|stage|procedure|cycle|kaedah|hirarki/i.test(combined)) {
    const steps = points.slice(0, 4).map((pt, sIdx) => {
      const parts = pt.split(/[:–-]/);
      return {
        step: sIdx + 1,
        title: parts[0]?.trim() || `Langkah 0${sIdx + 1}`,
        desc: parts[1]?.trim() || pt
      };
    });
    if (steps.length === 0) {
      steps.push(
        { step: 1, title: 'Perancangan Awal', desc: `Analisis terperinci bagi ${title}` },
        { step: 2, title: 'Pelaksanaan Teras', desc: 'Penyelarasan operasi dan integrasi' },
        { step: 3, title: 'Pemantauan & Kawalan', desc: 'Penilaian kualiti dan hasil berterusan' }
      );
    }
    return {
      infographicType: 'PROCESS_FLOW',
      meta: { archetype: 'PROCESS_FLOW', steps }
    };
  }

  // 2. Stat / Metrics / Gauges / KPI
  if (/peratus|kadar|metrik|statistik|%|roi|gauge|index|metric|angka|jumlah|kos|unjuran/i.test(combined)) {
    const stats = points.slice(0, 3).map((pt) => {
      const numMatch = pt.match(/(\d+(?:\.\d+)?%?|\$\d+|\b\d+x\b)/i);
      const val = numMatch ? numMatch[1] : '100%';
      return {
        label: pt.replace(val, '').trim().slice(0, 35) || 'Metrik Utama',
        value: val,
        change: 'Sasaran Utama',
        icon: 'trending-up'
      };
    });
    if (stats.length === 0) {
      stats.push(
        { label: 'Indeks Kecekapan', value: '95%', change: 'Pencapaian', icon: 'trending-up' },
        { label: 'Ketepatan Operasi', value: '99.8%', change: 'Standard Kualiti', icon: 'check-circle' }
      );
    }
    return {
      infographicType: 'STAT_METRIC_GAUGE',
      meta: { archetype: 'STAT_METRIC_GAUGE', stats }
    };
  }

  // 3. Multi-Pillar / Pillars / Components
  if (/pilar|tonggak|teras|komponen|prinsip|pillar|dimension|dimensi|elemen|aspek/i.test(combined) || points.length >= 3) {
    const pillars = points.slice(0, 4).map((pt, pIdx) => {
      const parts = pt.split(/[:–-]/);
      return {
        title: parts[0]?.trim() || `Teras 0${pIdx + 1}`,
        desc: parts[1]?.trim() || pt,
        icon: 'shield-check'
      };
    });
    return {
      infographicType: 'MULTI_PILLAR',
      meta: { archetype: 'MULTI_PILLAR', pillars }
    };
  }

  // 4. Comparison Matrix / VS
  if (/banding|vs|versus|cabaran|lawan|matrix|perbezaan/i.test(combined)) {
    const mid = Math.ceil(points.length / 2);
    return {
      infographicType: 'COMPARISON_MATRIX',
      meta: {
        archetype: 'COMPARISON_MATRIX',
        comparison: {
          leftTitle: 'Aspek Analisis & Cabaran',
          leftItems: points.slice(0, mid).length ? points.slice(0, mid) : ['Kaedah konvensional', 'Batasan sumber'],
          rightTitle: 'Solusi & Penambahbaikan',
          rightItems: points.slice(mid).length ? points.slice(mid) : ['Pelaksanaan sistematik', 'Pengoptimuman proses']
        }
      }
    };
  }

  // 5. Default Bento Grid
  const stats = points.slice(0, 2).map((pt) => ({
    label: pt.slice(0, 30),
    value: 'Teras',
    change: 'Fokus',
    icon: 'zap'
  }));
  return {
    infographicType: 'BENTO_GRID',
    meta: {
      archetype: 'BENTO_GRID',
      stats: stats.length > 0 ? stats : [{ label: 'Fokus Utama', value: '100%', change: 'Kualiti', icon: 'check' }]
    }
  };
}

/**
 * Generates 30 Infographic Slide Outlines STRICTLY derived from user input (PPT slides or Reference Text)
 */
export function extractAndGenerate30Infographics(config: SetupConfig, isMalay: boolean): OutlineItem[] {
  const pptSlides = config.uploadedPpt?.extractedSlides || [];
  const refText = config.referenceText?.trim() || '';
  const mainTopic = config.topic?.trim() || 'Pembentangan Strategik';

  const generatedOutlines: OutlineItem[] = [];

  // CASE 1: Uploaded PowerPoint / PPTX file exists
  if (pptSlides.length > 0) {
    // If PPT has 30 or more slides, take the 30 slides 1:1
    if (pptSlides.length >= 30) {
      for (let i = 0; i < 30; i++) {
        const slide = pptSlides[i];
        const title = slide.title && slide.title.trim() ? slide.title.trim() : `Slaid ${i + 1}: Kandungan Utama`;
        let points = cleanAndExtractBullets(slide.bullets);
        if (points.length === 0 && slide.rawText) {
          points = cleanAndExtractBullets(slide.rawText.split('\n'));
        }
        if (points.length === 0) {
          points = [`Kandungan dan intipati penting bagi ${title}`];
        }

        const { infographicType, meta } = detectArchetypeFromContent(title, points, i);
        generatedOutlines.push({
          title,
          summary: isMalay
            ? `modul '${title}' memperincikan kandungan dan objektif bagi topik ini.`
            : `the section '${title}' elaborates on the key findings and objectives.`,
          points,
          coreHighlight: `Fokus: ${title}`,
          infographicType,
          meta
        });
      }
      return generatedOutlines;
    }

    // If PPT has fewer than 30 slides (e.g. 5, 10, 15, 20 slides),
    // expand each slide by extracting its subtopics/bullets into structured deep-dive slides
    // strictly from the uploaded presentation without inventing external topics!
    const targetCount = 30;
    const slidesPool: { title: string; points: string[]; parentTitle?: string }[] = [];

    // Collect all real slides and their sub-sections
    for (const slide of pptSlides) {
      const slideTitle = slide.title && slide.title.trim() ? slide.title.trim() : `Bahagian Persembahan`;
      const bullets = cleanAndExtractBullets(slide.bullets.length > 0 ? slide.bullets : slide.rawText.split('\n'));
      
      // Main slide
      slidesPool.push({
        title: slideTitle,
        points: bullets.length > 0 ? bullets.slice(0, 4) : [`Intipati perbincangan bagi ${slideTitle}`]
      });

      // If slide has multiple sub-bullets, expand them into dedicated deep-dive slides
      if (bullets.length > 1) {
        for (let bIdx = 0; bIdx < bullets.length; bIdx++) {
          const bText = bullets[bIdx];
          const colonSplit = bText.split(/[:–-]/);
          const subTitle = colonSplit.length > 1 && colonSplit[0].length < 40 ? colonSplit[0].trim() : `${slideTitle} (Perincian ${bIdx + 1})`;
          const subDesc = colonSplit.length > 1 ? colonSplit.slice(1).join(' ').trim() : bText;
          slidesPool.push({
            title: subTitle,
            points: [
              subDesc,
              `Analisis dan pelaksanaan terperinci bagi ${subTitle}`,
              `Penyelarasan standard dan pematuhan kualiti ${slideTitle}`
            ],
            parentTitle: slideTitle
          });
        }
      }
    }

    // Now fill the 30 slides strictly using slidesPool
    for (let i = 0; i < targetCount; i++) {
      const item = slidesPool[i % slidesPool.length];
      const title = item.title;
      const points = item.points.length > 0 ? item.points : [`Fokus utama bagi ${title}`];
      const { infographicType, meta } = detectArchetypeFromContent(title, points, i);

      generatedOutlines.push({
        title: i >= slidesPool.length ? `${title} (Fasa ${Math.floor(i / slidesPool.length) + 1})` : title,
        summary: isMalay
          ? `modul '${title}' membentangkan maklumat penting berasaskan kandungan fail yang dimuat naik.`
          : `the section '${title}' presents crucial insights derived from the uploaded presentation.`,
        points,
        coreHighlight: `Fokus: ${title}`,
        infographicType,
        meta
      });
    }

    return generatedOutlines;
  }

  // CASE 2: User provided referenceText
  if (refText.length > 0) {
    const rawParagraphs = refText.split(/\n\s*\n|\n(?=[#\[\d+\.])/).map(p => p.trim()).filter(Boolean);
    const parsedSections: { title: string; points: string[] }[] = [];

    for (let pIdx = 0; pIdx < rawParagraphs.length; pIdx++) {
      const lines = rawParagraphs[pIdx].split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;
      const title = lines[0].replace(/^[#\[\]\d+\.\-\*:]\s*/, '') || `Bahagian ${pIdx + 1}`;
      const bullets = cleanAndExtractBullets(lines.slice(1));
      parsedSections.push({
        title,
        points: bullets.length > 0 ? bullets : [lines.join(' ')]
      });
    }

    if (parsedSections.length > 0) {
      for (let i = 0; i < 30; i++) {
        const item = parsedSections[i % parsedSections.length];
        const title = i >= parsedSections.length ? `${item.title} (Lanjutan ${Math.floor(i / parsedSections.length) + 1})` : item.title;
        const points = item.points.length > 0 ? item.points : [`Perincian modul bagi ${title}`];
        const { infographicType, meta } = detectArchetypeFromContent(title, points, i);

        generatedOutlines.push({
          title,
          summary: isMalay
            ? `perbincangan '${title}' menghuraikan aspek teras daripada teks rujukan yang dibekalkan.`
            : `the module '${title}' details the key principles from the reference text.`,
          points,
          coreHighlight: `Fokus: ${title}`,
          infographicType,
          meta
        });
      }
      return generatedOutlines;
    }
  }

  // CASE 3: Only mainTopic provided (Generate 30 structured topics for this specific title)
  const defaultModulesMalay = [
    'Pengenalan & Visi Strategik',
    'Latar Belakang & Analisis Keperluan',
    'Objektif & Matlamat Utama',
    'Prinsip Asas & Kerangka Kerja',
    'Pilar 1: Tadbir Urus & Pematuhan',
    'Pilar 2: Pelaksanaan Operasi Pintar',
    'Pilar 3: Pembangunan Modal Insan',
    'Pilar 4: Kolaborasi & Sinergi Ekosistem',
    'Aliran Proses Pelaksanaan (Langkah 1-4)',
    'Analisis Risiko & Pelan Mitigasi',
    'Metrik Prestasi & Sasaran KPI',
    'Pengoptimuman Sumber & Belanjawan',
    'Integrasi Teknologi & Keselamatan',
    'Pengurusan Perubahan & Budaya Kerja',
    'Kawalan Kualiti & Penandaarasan',
    'Kajian Impak Komuniti & Pemegang Taruh',
    'Struktur Pasukan & Peranan Utama',
    'Garis Masa & Pelan Hala Tuju (Milestone)',
    'Strategi Komunikasi & Penyampaian',
    'Audit Prestasi & Ketelusan Data',
    'Automasi Proses & Peningkatan Kecekapan',
    'Dasar Keselamatan & Privasi Maklumat',
    'Pemerkasaan Bakat & Latihan Berterusan',
    'Pengukuran Kepuasan & Maklum Balas',
    'Inovasi Berterusan & Penyelidikan',
    'Ketahanan Operasi & Pelan Kontingensi',
    'Kelestarian & Nilai Jangka Panjang',
    'Pelan Tindakan Segera 30 Hari',
    'Faktor Kejayaan Kritikal (CSF)',
    'Rumusan Eksekutif & Penutup'
  ];

  for (let i = 0; i < 30; i++) {
    const modTitle = defaultModulesMalay[i] || `Modul ${i + 1}`;
    const fullTitle = `${modTitle}: ${mainTopic}`;
    const points = [
      `Menetapkan kerangka kerja asas bagi ${modTitle} dalam inisiatif ${mainTopic}.`,
      `Menyelaraskan strategi pelaksanaan berkesan bersama semua pihak berkepentingan.`,
      `Memastikan pematuhan standard dan pemantauan metrik hasil secara berterusan.`
    ];
    const { infographicType, meta } = detectArchetypeFromContent(fullTitle, points, i);

    generatedOutlines.push({
      title: fullTitle,
      summary: isMalay
        ? `modul '${fullTitle}' menggariskan tindakan strategik bagi mencapai hasil optimum.`
        : `the segment '${fullTitle}' outlines strategic execution for optimal impact.`,
      points,
      coreHighlight: `Fokus: ${modTitle}`,
      infographicType,
      meta
    });
  }

  return generatedOutlines;
}

/**
 * Dynamically generates 15 MCQ Knowledge-Check Questions strictly based on the extracted slide content
 */
function generateDynamicMcqQuestions(outlines: OutlineItem[], isMalay: boolean, topic: string): McqDetails[] {
  const mcqs: McqDetails[] = [];

  for (let j = 1; j <= 15; j++) {
    const relatedSlide = outlines[(j * 2 - 2) % outlines.length];
    const slideTitle = relatedSlide ? relatedSlide.title : topic;
    const slidePoint = relatedSlide && relatedSlide.points.length > 0 ? relatedSlide.points[0] : `prinsip asas ${slideTitle}`;

    if (isMalay) {
      mcqs.push({
        question: `Berdasarkan perbincangan mengenai '${slideTitle}', apakah objektif atau langkah paling tepat yang perlu ditekankan?`,
        options: [
          { label: 'A', text: `Melaksanakan ${slidePoint} dengan pemantauan standard kualiti yang ketat` },
          { label: 'B', text: 'Mengabaikan penilaian risiko dan terus memulakan operasi tanpa perancangan' },
          { label: 'C', text: 'Mengurangkan ketelusan dokumentasi audit bagi mempercepatkan kelulusan' },
          { label: 'D', text: 'Menyerahkan keseluruhan kawalan kepada pihak ketiga tanpa pengawasan' }
        ],
        correctOption: 'A',
        explanation: `Pelaksanaan yang teliti terhadap '${slidePoint}' memastikan tadbir urus kukuh dan pencapaian hasil mampan bagi ${slideTitle}.`
      });
    } else {
      mcqs.push({
        question: `Based on the discussion in '${slideTitle}', what is the primary strategic action required?`,
        options: [
          { label: 'A', text: `Execute '${slidePoint}' with strict quality governance and accountability` },
          { label: 'B', text: 'Bypass risk assessments to rush delivery timelines without validation' },
          { label: 'C', text: 'Minimize transparency and documentation to avoid compliance checks' },
          { label: 'D', text: 'Outsource critical decision-making without internal oversight' }
        ],
        correctOption: 'A',
        explanation: `Executing '${slidePoint}' ensures robust governance and sustainable results for ${slideTitle}.`
      });
    }
  }

  return mcqs;
}

/**
 * Comprehensive Generator that builds the complete 45 slides (30 Infographics + 15 MCQs)
 * strictly derived from the user's uploaded presentation / custom input!
 */
export function generateCurated45Slides(config: SetupConfig): SlideData[] {
  const isMalay = config.outputLanguage === 'Bahasa Melayu Baku Malaysia';
  const scheme = OFFICIAL_COLOR_SCHEMES.find(s => s.id === config.colorSchemeId) || OFFICIAL_COLOR_SCHEMES[0];

  // Extract 30 structured outlines from the uploaded PPT or user input
  const infographTopics = extractAndGenerate30Infographics(config, isMalay);
  const mcqQuestions = generateDynamicMcqQuestions(infographTopics, isMalay, config.topic);

  const slides: SlideData[] = [];

  // Generate Slaid 1 to 30: Infografik Utama
  for (let i = 1; i <= 30; i++) {
    const info = infographTopics[i - 1];
    const position = getSlideCharacterPosition(i);
    const ethnicity = getSlideEthnicity(i);
    const imageSize = getSlideImageSize(i);

    const script30s = isMalay
      ? `Selamat datang ke Slaid ${i}. Dalam bahagian '${info.title}', kita meneliti intipati utama di mana ${info.summary} Antara fokus utamanya ialah ${info.points.slice(0, 2).join(', ')}. Melalui pelaksanaan berstruktur ini, objektif dapat dicapai secara mampan dan berkesan.`
      : `Welcome to Slide ${i}. In this segment on '${info.title}', we analyze the core pillar where ${info.summary} Key focus areas include ${info.points.slice(0, 2).join(', ')}. By applying these structured principles, we achieve sustainable excellence.`;

    const script10s = isMalay
      ? `Mari kita teliti intipati utama ${info.title} dan peranannya dalam kejayaan jangka panjang.`
      : `Let's explore the strategic impact of ${info.title} on achieving sustainable excellence.`;

    const script5s = isMalay
      ? `Kunci utama: ${info.coreHighlight}.`
      : `Core takeaway: ${info.coreHighlight}.`;

    const typography = isMalay
      ? 'Tipografi sans-serif moden, tajuk cerun tebal dengan kejelasan sempurna tanpa kesalahan ejaan'
      : 'Modern bold gradient typography, high contrast crisp rendering with flawless exact spelling';

    const prompts = buildOfficialPrompts({
      slideNumber: i,
      title: info.title,
      config,
      pointsOrContent: info.points.join(' | '),
      isMcq: false,
      infographicType: info.infographicType,
      infographicMeta: info.meta,
      script30s,
      scriptNarration10s: script10s,
      scriptConcise5s: script5s
    });

    const slideObj: SlideData = {
      slideNumber: i,
      isMcq: false,
      title: info.title,
      characterPosition: position,
      colorSchemeName: scheme.name,
      colorSchemeHex: scheme.bgHex,
      accentHexes: scheme.accentHexes,
      imageSize,
      ethnicity,
      typography,
      infographicType: info.infographicType,
      infographicPoints: info.points,
      infographicMeta: info.meta,
      promptNanoBanana2: prompts.promptNanoBanana2,
      promptVeo10s: prompts.promptVeo10s,
      promptVeo5s: prompts.promptVeo5s,
      scriptAvatar30s: script30s,
      fullFormattedBlock: ''
    };
    slideObj.fullFormattedBlock = formatSlideFullBlock(slideObj);
    slides.push(slideObj);
  }

  // Generate Slaid 31 to 45: Soalan MCQ (15 Questions derived from uploaded slides)
  for (let j = 1; j <= 15; j++) {
    const slideNumber = 30 + j;
    const mcq = mcqQuestions[j - 1];
    const position = getSlideCharacterPosition(slideNumber);
    const ethnicity = getSlideEthnicity(slideNumber);
    const imageSize = getSlideImageSize(slideNumber);
    const title = `${isMalay ? 'Soalan MCQ' : 'MCQ Question'} ${j}: ${infographTopics[(j * 2 - 2) % infographTopics.length]?.title || config.topic}`;

    const script30s = isMalay
      ? `Slaid ${slideNumber}: Uji Minda Soalan ${j}. Soalannya: ${mcq.question}. Mari kita semak pilihan jawapan A, B, C, dan D. Jawapan yang paling tepat adalah Pilihan ${mcq.correctOption} (${mcq.options.find(o => o.label === mcq.correctOption)?.text}) kerana ${mcq.explanation}. Tahniah kepada anda yang menjawab dengan tepat!`
      : `Slide ${slideNumber}: Knowledge Check Question ${j}. The question asks: ${mcq.question}. Let us review options A, B, C, and D. The correct answer is Option ${mcq.correctOption} (${mcq.options.find(o => o.label === mcq.correctOption)?.text}) because ${mcq.explanation}. Great job to everyone who got it right!`;

    const script10s = isMalay
      ? `Uji minda soalan ${j}: ${mcq.question}. Fikirkan jawapan sebelum masa tamat.`
      : `Knowledge check ${j}: ${mcq.question}. Identify the best option.`;

    const script5s = isMalay
      ? `Jawapan tepat soalan ${j} ialah Pilihan ${mcq.correctOption}.`
      : `The correct answer for question ${j} is Option ${mcq.correctOption}.`;

    const typography = isMalay
      ? 'Tipografi kad soalan kemas, pilihan A,B,C,D berasingan dengan ejaan tepat tanpa sebarang petunjuk jawapan'
      : 'Crisp quiz layout, distinct A, B, C, D cards with zero error spelling and clean neutral choice badges';

    const prompts = buildOfficialPrompts({
      slideNumber,
      title,
      config,
      pointsOrContent: mcq.question,
      isMcq: true,
      mcqData: mcq,
      script30s,
      scriptNarration10s: script10s,
      scriptConcise5s: script5s
    });

    const slideObj: SlideData = {
      slideNumber,
      isMcq: true,
      title,
      characterPosition: position,
      colorSchemeName: scheme.name,
      colorSchemeHex: scheme.bgHex,
      accentHexes: scheme.accentHexes,
      imageSize,
      ethnicity,
      typography,
      mcqDetails: mcq,
      promptNanoBanana2: prompts.promptNanoBanana2,
      promptVeo10s: prompts.promptVeo10s,
      promptVeo5s: prompts.promptVeo5s,
      scriptAvatar30s: script30s,
      fullFormattedBlock: ''
    };
    slideObj.fullFormattedBlock = formatSlideFullBlock(slideObj);
    slides.push(slideObj);
  }

  return slides;
}
