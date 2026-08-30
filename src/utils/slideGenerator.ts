import { SetupConfig, SlideData, InfographicArchetype, InfographicMetaData } from '../types';
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
 * Generates dynamic, natural explanatory gestures for the presenter across the 45 slides
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
  const ethnicity = getSlideEthnicity(params.slideNumber);
  const size = getSlideImageSize(params.slideNumber);
  const scheme = OFFICIAL_COLOR_SCHEMES.find(s => s.id === params.config.colorSchemeId) || OFFICIAL_COLOR_SCHEMES[0];

  const posMalay = position.toLowerCase(); // 'kiri' or 'kanan'
  const posEn = position === 'KIRI' ? 'left' : 'right';
  const sizeMalay = size.toLowerCase(); // 'besar', 'sederhana', 'kecil'

  const nametagSnippet = params.config.useNametag && params.config.nametagText.trim()
    ? `strictly include an authentic chest pocket nametag badge featuring clean UPPERCASE text: '${params.config.nametagText.trim().toUpperCase()}'`
    : `clean corporate attire without nametag`;

  const dynamicPose = getPresenterDynamicExplainingPose(params.slideNumber, params.isMcq);

  const characterSheetPrompt = params.config.characterSheet
    ? `strictly preserve the exact character likeness, face structure, hairstyle, and attire from the reference Character Sheet '${params.config.characterSheet.characterName}' (Specs: ${params.config.characterSheet.specs}${params.config.characterSheet.customCostume ? `, Outfit: ${params.config.characterSheet.customCostume}` : ''}), rendered in ${params.config.presenterStyle} art style`
    : `a charismatic 3D animated presenter in ${params.config.presenterStyle} style`;

  // 1. Nano Banana 2 Image Prompt (Stunning Abstract Patterns & Rich Infographics with Dynamic Explanatory Character)
  let visualLayoutDesc = '';
  if (params.isMcq && params.mcqData) {
    const optsStr = params.mcqData.options.map(o => `[${o.label}] "${o.text}"`).join(' | ');
    visualLayoutDesc = `An interactive high-tech quiz interface featuring a glowing glassmorphic Question Container: "${params.mcqData.question}" highlighted with dual-color accent gradients, surrounded by 4 elevated rounded option cards (${optsStr}) designed with translucent frosted glass, vibrant glowing letter badges (A, B, C, D), subtle hover glow effects, and zero answer spoiler indicators.`;
  } else if (params.infographicType === 'PROCESS_FLOW' && params.infographicMeta?.steps) {
    const stepsStr = params.infographicMeta.steps.map(s => `Step ${s.step}: [${s.title} - ${s.desc}]`).join(' -> ');
    visualLayoutDesc = `A state-of-the-art horizontal process flow diagram with 4 glowing translucent step cards linked by directional connector arrows (${stepsStr}), featuring 3D numeric icon badges and structured descriptions.`;
  } else if (params.infographicType === 'STAT_METRIC_GAUGE' && params.infographicMeta?.stats) {
    const statsStr = params.infographicMeta.stats.map(s => `[${s.value} ${s.label} (${s.change || ''})]`).join(', ');
    visualLayoutDesc = `A futuristic executive KPI telemetry dashboard with 3 glowing circular radial percentage gauges and stat metric modules (${statsStr}) with illuminated mini trend indicators and upward delta arrows.`;
  } else if (params.infographicType === 'MULTI_PILLAR' && params.infographicMeta?.pillars) {
    const pillarsStr = params.infographicMeta.pillars.map(p => `Pillar: [${p.title}: ${p.desc}]`).join(' | ');
    visualLayoutDesc = `A clean multi-pillar architectural foundation infographic with 4 vertical elevated frosted glass column cards (${pillarsStr}), each topped with a glowing 3D vector emblem and structured sub-points.`;
  } else if (params.infographicType === 'COMPARISON_MATRIX' && params.infographicMeta?.comparison) {
    const cmp = params.infographicMeta.comparison;
    visualLayoutDesc = `A high-contrast side-by-side dual column comparison matrix card contrasting "${cmp.leftTitle}" (${cmp.leftItems.join(', ')}) against "${cmp.rightTitle}" (${cmp.rightItems.join(', ')}) with distinct checkmark and cross badges.`;
  } else if (params.infographicType === 'RADIAL_ECOSYSTEM' && params.infographicMeta?.nodes) {
    const nodes = params.infographicMeta.nodes;
    const satsStr = nodes.satellites.map(s => `[${s.title}: ${s.desc}]`).join(', ');
    visualLayoutDesc = `A modern radial network ecosystem diagram with a central glowing core hub node ("${nodes.centerNode}") interconnected via glowing orbital connection lines to 4 satellite orbital feature cards (${satsStr}).`;
  } else if (params.infographicType === 'TIMELINE_ROADMAP' && params.infographicMeta?.phases) {
    const phasesStr = params.infographicMeta.phases.map(p => `[${p.phase}: ${p.milestone} - ${p.desc}]`).join(' -> ');
    visualLayoutDesc = `An executive horizontal milestone roadmap timeline across chronological phases (${phasesStr}) with glowing milestone nodes, progress bar fill, and strategic delivery flags.`;
  } else {
    visualLayoutDesc = `A sleek modern asymmetric bento grid dashboard layout comprising a large primary spotlight card, secondary stat metric modules, and an executive key takeaway banner representing: "${params.pointsOrContent}". All card texts and bullet points are rendered in large, highly readable typography (minimum 16pt equivalent) with bold headings and high-contrast color hierarchy.`;
  }

  const promptNanoBanana2 = `A commercial-grade 16:9 widescreen presentation slide titled '${params.title}' on the topic '${params.config.topic}'. The background features breathtaking modern 3D abstract geometric waves, flowing fluid gradient ribbons, subtle isometric grid accents, and volumetric ambient studio rim lighting adhering to the ${scheme.name} color palette (Primary: ${scheme.accentHexes[0] || '#06B6D4'}, Secondary: ${scheme.accentHexes[1] || '#3B82F6'}, Background: ${scheme.bgHex}). Positioned on the ${posMalay} (${posEn}) in a professional thigh-up posture is the presenter character standing naturally on the slide floor (${dynamicPose}, ${characterSheetPrompt}, ${nametagSnippet}). The main presentation area is filled with rich infographic visuals with large, easily readable text (minimum 16pt+ size): ${visualLayoutDesc} Top section displays a prominent bold gradient typography headline '${params.title}' with flawless spelling, crisp kerning, and zero typographical artifacts. Floating 3D rounded icon badges and geometric accents create stunning depth and visual dynamism. Bottom corner shows a clean slide number '${params.slideNumber}'. 8K resolution, photorealistic volumetric lighting, ultra-detailed graphic design render, zero white borders around the presenter, perfectly integrated character.`;

  // 2. Veo 10s Motion Graphics Video Prompt
  let promptVeo10s = '';
  if (params.isMcq && params.mcqData) {
    promptVeo10s = `A high-quality 60fps 10-second motion graphics presentation video using Veo with synchronized narration audio. From 0-2s, presenter character (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}, ${characterSheetPrompt}) on ${posMalay} (${posEn}) animates with natural gestures while speaking script: '${params.scriptNarration10s}'. From 3-4s, question heading '${params.title}' slides in. From 5-6s, MCQ options A, B, C, D slide in one by one. From 7-8s, correct answer Option ${params.mcqData.correctOption} (${params.mcqData.options.find(o => o.label === params.mcqData?.correctOption)?.text}) illuminates with a vibrant pulse glow and checkmark highlight. From 9-10s, layout completes as presenter smiles and gestures to the revealed answer.`;
  } else {
    promptVeo10s = `A high-quality 60fps 10-second motion graphics presentation video using Veo with synchronized narration audio. From 0-2s, presenter character (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}, ${characterSheetPrompt}) on ${posMalay} (${posEn}) animates with natural gestures while speaking script: '${params.scriptNarration10s}'. From 3-4s, gradient heading '${params.title}' slides in with elegant kinetic easing. From 5-6s, core infographic data points smoothly cascade in. From 7-8s, central key takeaway metric dynamically highlights with accent glow. From 9-10s, visual composition achieves balanced completeness.`;
  }

  // 3. Veo 5s Fast Motion Graphics Prompt
  let promptVeo5s = '';
  if (params.isMcq && params.mcqData) {
    promptVeo5s = `A high-quality 60fps 5-second motion graphics presentation video using Veo focusing on core key points or instant MCQ answer reveal with narration. From 0-2s, presenter (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}) speaks concise script: '${params.scriptConcise5s}'. From 2-3s, quiz question slides in rapidly. From 3-5s, correct answer Option ${params.mcqData.correctOption} instantly spotlights with bright glowing highlight and sound chime cue.`;
  } else {
    promptVeo5s = `A high-quality 60fps 5-second motion graphics presentation video using Veo focusing on core key points or instant MCQ answer reveal with narration. From 0-2s, presenter (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}) speaks concise script: '${params.scriptConcise5s}'. From 2-3s, heading '${params.title}' slides in. From 3-5s, essential key highlights and focal infographic point instantly spotlight with crisp accent illumination.`;
  }

  return { promptNanoBanana2, promptVeo10s, promptVeo5s };
}

// Comprehensive Generator that produces the complete 45 slides immediately
export function generateCurated45Slides(config: SetupConfig): SlideData[] {
  const isMalay = config.outputLanguage === 'Bahasa Melayu Baku Malaysia';
  const scheme = OFFICIAL_COLOR_SCHEMES.find(s => s.id === config.colorSchemeId) || OFFICIAL_COLOR_SCHEMES[0];
  const topic = config.topic.trim() || (isMalay ? 'Transformasi Digital & Strategi Masa Depan Malaysia' : 'Digital Transformation & Future Strategy Malaysia');

  // Subtopic outline generator tailored to the user's topic and uploaded PPT slides
  const infographTopics = generateInfographicOutlines(topic, isMalay, config);
  const mcqQuestions = generateMcqQuestions(topic, isMalay, config);

  const slides: SlideData[] = [];

  // Generate Slaid 1 to 30: Infografik Utama
  for (let i = 1; i <= 30; i++) {
    const info = infographTopics[i - 1];
    const position = getSlideCharacterPosition(i);
    const ethnicity = getSlideEthnicity(i);
    const imageSize = getSlideImageSize(i);

    const script30s = isMalay
      ? `Selamat datang ke Slaid ${i}. Dalam bahagian '${info.title}', kita meneliti intipati utama di mana ${info.summary}. Melalui pelaksanaan yang teliti dan penglibatan semua pihak berkepentingan, objektif ini dapat dicapai secara mampan dan berkesan untuk kemajuan organisasi.`
      : `Welcome to Slide ${i}. In this segment on '${info.title}', we analyze the fundamental pillar where ${info.summary}. By applying structured frameworks and active stakeholder synergy, we establish resilient operational success for long-term growth.`;

    const script10s = isMalay
      ? `Mari kita fahami intipati utama ${info.title} dan peranannya dalam kejayaan jangka panjang.`
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

  // Generate Slaid 31 to 45: Soalan MCQ (15 Questions)
  for (let j = 1; j <= 15; j++) {
    const slideNumber = 30 + j;
    const mcq = mcqQuestions[j - 1];
    const position = getSlideCharacterPosition(slideNumber);
    const ethnicity = getSlideEthnicity(slideNumber);
    const imageSize = getSlideImageSize(slideNumber);

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
      title: `${isMalay ? 'Soalan MCQ' : 'MCQ Question'} ${j}: ${mcq.shortTitle}`,
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
      title: `${isMalay ? 'Soalan MCQ' : 'MCQ Question'} ${j}: ${mcq.shortTitle}`,
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

interface OutlineItem {
  title: string;
  summary: string;
  points: string[];
  coreHighlight: string;
  infographicType: InfographicArchetype;
  meta: InfographicMetaData;
}

function generateInfographicOutlines(topic: string, isMalay: boolean, config?: SetupConfig): OutlineItem[] {
  const pptSlides = config?.uploadedPpt?.extractedSlides || [];

  const rawOutlinesMalay: OutlineItem[] = [
    {
      title: 'Pengenalan & Objektif Strategik',
      summary: `hala tuju inisiatif '${topic}' dirangka secara holistik bagi mencapai kecemerlangan jangka panjang.`,
      points: [
        'Mewujudkan visi digital berimpak tinggi yang mampan',
        'Memperkukuh tadbir urus dan kecekapan operasi teras',
        'Menjana pulangan pelaburan (ROI) dan nilai komuniti'
      ],
      coreHighlight: `Visi Utama: Pemerkasaan Holistik '${topic}'`,
      infographicType: 'BENTO_GRID',
      meta: {
        archetype: 'BENTO_GRID',
        stats: [
          { label: 'Indeks Kecekapan', value: '+45%', change: 'Pertumbuhan 2026', icon: 'zap' },
          { label: 'Pematuhan Standard', value: '100%', change: 'ISO Standard', icon: 'shield' }
        ]
      }
    },
    {
      title: 'Latar Belakang & Landskap Semasa',
      summary: `analisis landskap makro membuktikan keperluan mendesak terhadap pemodenan ekosistem '${topic}'.`,
      points: [
        'Peralihan pasaran global ke arah automasi pintar',
        'Peningkatan jangkaan pemegang taruh terhadap responsiviti',
        'Keperluan integrasi data merentas pelbagai bahagian'
      ],
      coreHighlight: `3 Metrik Kunci Landskap Makro`,
      infographicType: 'STAT_METRIC_GAUGE',
      meta: {
        archetype: 'STAT_METRIC_GAUGE',
        stats: [
          { label: 'Kesediaan Digital', value: '88.5%', change: '+12.4% YoY', icon: 'gauge' },
          { label: 'Pertumbuhan Pasaran', value: '3.8x', change: 'Unjuran 5 Tahun', icon: 'trending-up' },
          { label: 'Capaian Komuniti', value: '95%', change: 'Liputan Menyeluruh', icon: 'users' }
        ]
      }
    },
    {
      title: 'Analisis Keperluan & Cabaran Utama',
      summary: `perbandingan teliti antara cabaran kaedah legasi dan peluang transformasi digital moden.`,
      points: [
        'Silo data legasi digantikan dengan seni bina terpadu',
        'Pemprosesan manual dialihkan kepada aliran pintar',
        'Risiko keselamatan siber dibendung secara proaktif'
      ],
      coreHighlight: `Matriks Perbandingan: Legasi vs Transformasi Moden`,
      infographicType: 'COMPARISON_MATRIX',
      meta: {
        archetype: 'COMPARISON_MATRIX',
        comparison: {
          leftTitle: 'Cabaran Kaedah Tradisional',
          leftItems: [
            'Proses manual berperingkat dan birokrasi lambat',
            'Silo data sukar diakses secara masa nyata',
            'Kos penyelenggaraan tinggi tanpa keterlihatan data'
          ],
          rightTitle: 'Solusi Transformasi Pintar',
          rightItems: [
            'Aliran kerja automatik dengan keputusan berasaskan AI',
            'Pangkalan data awan berpusat dan selamat',
            'Pengurangan 40% kos dengan cerapan analitik segera'
          ]
        }
      }
    },
    {
      title: 'Prinsip Asas & Kerangka Kerja',
      summary: `empat tonggak asas yang menjadi tunjang kekuatan pelaksanaan '${topic}'.`,
      points: [
        'Tadbir urus beretika dan ketelusan mutlak',
        'Teknologi pintar berasaskan kebolehskalaan',
        'Pembangunan modal insan berdaya saing',
        'Sinergi kolaborasi industri yang mampan'
      ],
      coreHighlight: `4 Tonggak Utama Kerangka Kerja`,
      infographicType: 'MULTI_PILLAR',
      meta: {
        archetype: 'MULTI_PILLAR',
        pillars: [
          { title: 'Integriti & Etika', desc: 'Tadbir urus telus dan pematuhan peraturan antarabangsa', icon: 'shield-check' },
          { title: 'Teknologi Pintar', desc: 'Infrastruktur berskala tinggi dan automasi moden', icon: 'cpu' },
          { title: 'Modal Insan', desc: 'Peningkatan bakat, reskilling, dan budaya tangkas', icon: 'users' },
          { title: 'Sinergi Ekosistem', desc: 'Kerjasama rentas industri untuk impak optimum', icon: 'network' }
        ]
      }
    },
    {
      title: 'Pilar 1: Tadbir Urus & Pematuhan',
      summary: `sistem tadbir urus yang telus menjamin akauntabiliti dan kepercayaan berterusan.`,
      points: [
        'Pematuhan ketat piawaian ISO dan kawal selia undang-undang',
        'Pengauditan berkala dengan jejak audit digital tanpa kompromi',
        'Penerapan dasar anti-rasuah dan etika profesional'
      ],
      coreHighlight: `Struktur Pematuhan 4 Peringkat`,
      infographicType: 'MULTI_PILLAR',
      meta: {
        archetype: 'MULTI_PILLAR',
        pillars: [
          { title: 'Standard ISO', desc: 'Audit pensijilan kualiti berkala', icon: 'file-check' },
          { title: 'Jejak Audit Digital', desc: 'Log forensik data tidak boleh diubah', icon: 'lock' },
          { title: 'Polisi Anti-Rasuah', desc: 'Integriti tanpa kompromi setiap fasa', icon: 'award' },
          { title: 'Pematuhan PDPA', desc: 'Perlindungan privasi data komprehensif', icon: 'eye' }
        ]
      }
    },
    {
      title: 'Pilar 2: Teknologi & Infrastruktur Pintar',
      summary: `hab teknologi teras mengintegrasikan analitik AI, awan hibrid, dan kubu keselamatan siber.`,
      points: [
        'Seni bina awan hibrid dengan kebolehskalaan automatik',
        'Enjin AI untuk analitik ramalan dan automasi tugas',
        'Sistem pertahanan keselamatan siber berlapis'
      ],
      coreHighlight: `Hab Pusat & Ekosistem Teknologi Pintar`,
      infographicType: 'RADIAL_ECOSYSTEM',
      meta: {
        archetype: 'RADIAL_ECOSYSTEM',
        nodes: {
          centerNode: 'Hab Teknologi Awan Pintar',
          satellites: [
            { title: 'Enjin Analitik AI', desc: 'Pemprosesan ramalan data masa nyata' },
            { title: 'Kubu Siber Zero-Trust', desc: 'Pengesahan berterusan setiap lapisan' },
            { title: 'Gerbang API Terbuka', desc: 'Penyepaduan mikrosistem pantas' },
            { title: 'Storan Data Teragih', desc: 'Ketersediaan data 99.99% tanpa gangguan' }
          ]
        }
      }
    },
    {
      title: 'Pilar 3: Pembangunan Modal Insan',
      summary: `aliran sistematik memacu transformasi minda dan kemahiran warga organisasi.`,
      points: [
        'Penilaian jurang kemahiran secara berstruktur',
        'Program pensijilan teknikal dan kepimpinan',
        'Pembudayaan inovasi berterusan di tempat kerja'
      ],
      coreHighlight: `Aliran 4 Langkah Pembangunan Bakat`,
      infographicType: 'PROCESS_FLOW',
      meta: {
        archetype: 'PROCESS_FLOW',
        steps: [
          { step: 1, title: 'Analisis Jurang', desc: 'Audit kompetensi bakat sedia ada' },
          { step: 2, title: 'Reskilling Berfokus', desc: 'Modul latihan teknikal intensif' },
          { step: 3, title: 'Pensijilan Pakar', desc: 'Akreditasi bertaraf antarabangsa' },
          { step: 4, title: 'Aplikasi Budaya', desc: 'Pelaksanaan projek inovasi sebenar' }
        ]
      }
    },
    {
      title: 'Pilar 4: Kolaborasi & Ekosistem Industri',
      summary: `jaringan kerjasama strategik melipatgandakan impak kejayaan '${topic}'.`,
      points: [
        'Perkongsian pintar antara sektor awam dan swasta',
        'Penglibatan institusi pengajian tinggi untuk penyelidikan',
        'Penyertaan aktif komuniti pengguna akhir'
      ],
      coreHighlight: `Rangkaian Sinergi 4 Penjuru`,
      infographicType: 'RADIAL_ECOSYSTEM',
      meta: {
        archetype: 'RADIAL_ECOSYSTEM',
        nodes: {
          centerNode: 'Pusat Sinergi Strategik',
          satellites: [
            { title: 'Agensi Kerajaan', desc: 'Sokongan dasar & peruntukan bajet' },
            { title: 'Peneraju Korporat', desc: 'Pelaburan teknologi & pasaran' },
            { title: 'Pusat Penyelidikan', desc: 'Inovasi R&D & kertas putih' },
            { title: 'Komuniti Awam', desc: 'Maklum balas & penerimagunaan' }
          ]
        }
      }
    },
    {
      title: 'Peta Jalan Pelaksanaan (Roadmap Fasa 1)',
      summary: `pelan jangka pendek suku tahunan memastikan kejayaan fasa peletakan asas.`,
      points: [
        'S1: Audit kesediaan dan pembentukan jawatankuasa',
        'S2: Reka bentuk seni bina dan prototaip awal',
        'S3: Pelancaran projek perintis berskala terkawal',
        'S4: Penilaian metrik dan penyelarasan akhir'
      ],
      coreHighlight: `Garis Masa Fasa 1 (Tahun Pertama)`,
      infographicType: 'TIMELINE_ROADMAP',
      meta: {
        archetype: 'TIMELINE_ROADMAP',
        phases: [
          { phase: 'S1', milestone: 'Perancangan & Audit', desc: 'Pembentukan terma rujukan & tata kelola' },
          { phase: 'S2', milestone: 'Pembangunan Prototaip', desc: 'Reka bentuk seni bina sistem teras' },
          { phase: 'S3', milestone: 'Pelancaran Rintis', desc: 'Ujian lapangan pada zon perintis terpilih' },
          { phase: 'S4', milestone: 'Kajian Pencapaian', desc: 'Semakan metrik kejayaan & penyempurnaan' }
        ]
      }
    },
    {
      title: 'Peta Jalan Pelaksanaan (Roadmap Fasa 2)',
      summary: `pelan penskalaan menyeluruh untuk melonjakkan impak ke peringkat nasional dan serantau.`,
      points: [
        'Tahun 2: Peluasan penuh ke seluruh cawangan dan zon',
        'Tahun 3: Integrasi automasi AI termaju dan analitik ramalan',
        'Tahun 4: Penandaarasan serantau dan model rujukan global'
      ],
      coreHighlight: `Peta Jalan Jangka Sederhana (Tahun 2-4)`,
      infographicType: 'TIMELINE_ROADMAP',
      meta: {
        archetype: 'TIMELINE_ROADMAP',
        phases: [
          { phase: 'Tahun 2', milestone: 'Peluasan Skala Nasional', desc: 'Penyebaran ke seluruh operasi dan wilayah' },
          { phase: 'Tahun 3', milestone: 'Integrasi AI Termaju', desc: 'Automasi analitik kognitif sepenuhnya' },
          { phase: 'Tahun 4', milestone: 'Peneraju Penanda Aras', desc: 'Pengiktirafan kecemerlangan serantau' }
        ]
      }
    },
    {
      title: 'Petunjuk Prestasi Utama (KPI Strategik)',
      summary: `tiga indeks utama mengukur keberhasilan dan pencapaian sasaran '${topic}'.`,
      points: [
        'Tahap ketersediaan sistem melepasi 99.9% operasi tanpa henti',
        'Peningkatan 94% kepuasan pemegang taruh dan pelanggan',
        'Pengurangan 50% masa pemprosesan transaksi harian'
      ],
      coreHighlight: `Papan Pemuka 3 KPI Utama`,
      infographicType: 'STAT_METRIC_GAUGE',
      meta: {
        archetype: 'STAT_METRIC_GAUGE',
        stats: [
          { label: 'Uptime Sistem', value: '99.95%', change: 'Standard Tier-4', icon: 'activity' },
          { label: 'Skor Kepuasan', value: '94.2%', change: '+18% Kenaikan', icon: 'smile' },
          { label: 'Kelajuan Proses', value: '-52%', change: 'Masa Jimat', icon: 'clock' }
        ]
      }
    },
    {
      title: 'Pengurusan Risiko & Mitigasi Krisis',
      summary: `kitaran mitigasi proaktif melindungi kesinambungan operasi daripada sebarang ancaman.`,
      points: [
        'Pengesanan risiko peringkat awal melalui amaran automatik',
        'Pelan mitigasi kecemasan yang diuji secara berkala',
        'Pemulihan bencana (Disaster Recovery) dalam tempoh <15 minit'
      ],
      coreHighlight: `Aliran Pengurusan Risiko 4 Peringkat`,
      infographicType: 'PROCESS_FLOW',
      meta: {
        archetype: 'PROCESS_FLOW',
        steps: [
          { step: 1, title: 'Identifikasi', desc: 'Audit potensi risiko operasi & siber' },
          { step: 2, title: 'Kuantifikasi', desc: 'Penilaian impak kewangan & reputasi' },
          { step: 3, title: 'Mitigasi', desc: 'Pengaktifan benteng kawalan automatik' },
          { step: 4, title: 'Audit Pasca', desc: 'Penambahbaikan SOP berterusan' }
        ]
      }
    },
    {
      title: 'Protokol Keselamatan & Perlindungan Data',
      summary: `empat benteng keselamatan siber melindungi integriti maklumat sensitif.`,
      points: [
        'Penyulitan data gred tentera (AES-256) semasa simpanan dan transit',
        'Pengesahan identiti Zero-Trust dengan 2FA mandatori',
        'Pusat Operasi Keselamatan (SOC) memantau 24/7/365'
      ],
      coreHighlight: `4 Lapisan Kubu Pertahanan Data`,
      infographicType: 'MULTI_PILLAR',
      meta: {
        archetype: 'MULTI_PILLAR',
        pillars: [
          { title: 'Enkripsi AES-256', desc: 'Perlindungan data semasa rehat dan transit', icon: 'shield' },
          { title: 'Akses Zero-Trust', desc: 'Tiada kepercayaan tanpa pengesahan identiti', icon: 'key' },
          { title: 'SOC 24/7', desc: 'Pemantauan ancaman masa nyata kecerdasan buatan', icon: 'eye' },
          { title: 'Sandaran Terpencil', desc: 'Salinan data luar tapak berkala', icon: 'server' }
        ]
      }
    },
    {
      title: 'Kecekapan Operasi & Automasi Proses',
      summary: `automasi aliran kerja pintar mengoptimumkan sumber dan meminimumkan kesilapan manusia.`,
      points: [
        'Penyeragaman borang dan dokumen digital tanpa kertas',
        'Pengesahan pintar menggunakan automasi robotik (RPA)',
        'Pelaporan automatik dihantar terus kepada pembuat keputusan'
      ],
      coreHighlight: `Saluran Aliran Kerja Pintar 4 Langkah`,
      infographicType: 'PROCESS_FLOW',
      meta: {
        archetype: 'PROCESS_FLOW',
        steps: [
          { step: 1, title: 'Tangkapan Data', desc: 'Pengecaman dokumen automatik AI' },
          { step: 2, title: 'Pengesahan Logik', desc: 'Semakan peraturan integriti segera' },
          { step: 3, title: 'Kelulusan Pantas', desc: 'Routing digital tanpa birokrasi fizikal' },
          { step: 4, title: 'Arkib Digital', desc: 'Penyimpanan selamat boleh carian pantas' }
        ]
      }
    },
    {
      title: 'Kajian Impak Sosioekonomi',
      summary: `hasil pelaksanaan melonjakkan produktiviti tenaga kerja dan manfaat masyarakat.`,
      points: [
        'Pemberdayaan komuniti dengan akses digital yang inklusif',
        'Peluang pekerjaan bernilai tinggi dalam bidang teknologi',
        'Peningkatan daya saing ekonomi digital tempatan'
      ],
      coreHighlight: `Metrik Impak Sosioekonomi`,
      infographicType: 'STAT_METRIC_GAUGE',
      meta: {
        archetype: 'STAT_METRIC_GAUGE',
        stats: [
          { label: 'Peningkatan Produktiviti', value: '+68%', change: 'Pertumbuhan Sektor', icon: 'trending-up' },
          { label: 'Bakat Terlatih', value: '15,000+', change: 'Penerima Manfaat', icon: 'user-check' },
          { label: 'Nilai Sosioekonomi', value: 'RM50M+', change: 'Penjanaan Nilai', icon: 'dollar-sign' }
        ]
      }
    },
    {
      title: 'Pengoptimuman Kos & Nilai Pelaburan (ROI)',
      summary: `analisis pulangan pelaburan membuktikan penjimatan kos ketara dalam tempoh 12 bulan.`,
      points: [
        'Penjimatan ketara perbelanjaan operasi (OPEX)',
        'Pulangan pelaburan (ROI) mencecah 3.6x modal permulaan',
        'Ketepatan peruntukan bajet berasaskan analitik ramalan'
      ],
      coreHighlight: `Analisis Matriks Pulangan Pelaburan (ROI)`,
      infographicType: 'COMPARISON_MATRIX',
      meta: {
        archetype: 'COMPARISON_MATRIX',
        comparison: {
          leftTitle: 'Struktur Kos Sebelum',
          leftItems: [
            'Kos percetakan & penyimpanan dokumen fizikal tinggi',
            'Kerugian masa menunggu giliran kelulusan manual',
            'Kos pembaikan sistem legasi tidak menentu'
          ],
          rightTitle: 'Keberhasilan Pasca Transformasi',
          rightItems: [
            'Operasi 100% tanpa kertas menjimatkan 45% kos',
            'Aliran kerja digital segera meningkatkan produktiviti',
            'ROI positif 3.6x direkodkan dalam tahun pertama'
          ]
        }
      }
    },
    {
      title: 'Integrasi Amalan Kelestarian (ESG)',
      summary: `pematuhan prinsip Alam Sekitar, Sosial, dan Tadbir Urus memacu pembangunan bertanggungjawab.`,
      points: [
        'Pengurangan jejak karbon melalui operasi pusat data hijau',
        'Keterangkuman digital bagi memastikan tiada golongan tercicir',
        'Ketelusan laporan tahunan berasaskan standard antarabangsa'
      ],
      coreHighlight: `3 Tiang Utama Penjajaran ESG`,
      infographicType: 'MULTI_PILLAR',
      meta: {
        archetype: 'MULTI_PILLAR',
        pillars: [
          { title: 'Alam Sekitar (E)', desc: 'Pusat data hijau & pengurangan sisa elektronik', icon: 'leaf' },
          { title: 'Sosial (S)', desc: 'Keterangkuman digital & kebolehcapaian komuniti', icon: 'heart' },
          { title: 'Tadbir Urus (G)', desc: 'Ketelusan integriti & akauntabiliti lembaga', icon: 'shield' }
        ]
      }
    },
    {
      title: 'Komunikasi Strategik & Penglibatan Komuniti',
      summary: `pendekatan komunikasi berbilang saluran memastikan mesej sampai dengan tepat dan jelas.`,
      points: [
        'Hebahan pantas melalui portal rasmi dan media sosial',
        'Sesi libat urus secara berkala bersama pihak berkepentingan',
        'Saluran maklum balas telus untuk penambahbaikan berterusan'
      ],
      coreHighlight: `Pusat Komunikasi & Penglibatan Komuniti`,
      infographicType: 'RADIAL_ECOSYSTEM',
      meta: {
        archetype: 'RADIAL_ECOSYSTEM',
        nodes: {
          centerNode: 'Pusat Komunikasi Bersepadu',
          satellites: [
            { title: 'Portal Interaktif', desc: 'Akses maklumat rasmi 24 jam' },
            { title: 'Sesi Dialog Terbuka', desc: 'Libat urus pemegang taruh' },
            { title: 'Talian Bantuan Pantas', desc: 'Sokongan pelanggan responsif' },
            { title: 'Saluran Maklum Balas', desc: 'Pengumpulan cadangan komuniti' }
          ]
        }
      }
    },
    {
      title: 'Kajian Kes & Contoh Kejayaan Sebenar',
      summary: `bukti kejayaan pelaksanaan di agensi perintis menjadi tanda aras kecemerlangan industri.`,
      points: [
        'Pencapaian 100% digitalisasi dalam tempoh 6 bulan',
        'Pengurangan masa aduan daripada 7 hari kepada 2 jam',
        'Pengiktirafan anugerah inovasi peringkat kebangsaan'
      ],
      coreHighlight: `Papan Sorotan Kajian Kes Perintis`,
      infographicType: 'BENTO_GRID',
      meta: {
        archetype: 'BENTO_GRID',
        stats: [
          { label: 'Kadar Digital', value: '100%', change: 'Penyelesaian Sempurna', icon: 'check-circle' },
          { label: 'Masa Respons', value: '2 Jam', change: 'Daripada 7 Hari', icon: 'zap' }
        ]
      }
    },
    {
      title: 'Standard Kualiti & Audit Berkala',
      summary: `kitaran semakan kualiti berterusan mengekalkan standard perkhidmatan pada tahap tertinggi.`,
      points: [
        'Audit berkala setiap suku tahun oleh panel bebas',
        'Pemantauan SLA masa nyata dengan notifikasi segera',
        'Tindakan pembetulan pantas bagi sebarang ketidakpatuhan'
      ],
      coreHighlight: `Kitaran 4 Peringkat Jaminan Kualiti`,
      infographicType: 'PROCESS_FLOW',
      meta: {
        archetype: 'PROCESS_FLOW',
        steps: [
          { step: 1, title: 'Penandaarasan', desc: 'Penetapan matlamat kualiti standard' },
          { step: 2, title: 'Pengauditan', desc: 'Pemeriksaan kepatuhan proses bebas' },
          { step: 3, title: 'Pembetulan', desc: 'Tindakan mitigasi serta-merta' },
          { step: 4, title: 'Pengiktirafan', desc: 'Pengesahan kepatuhan standard kualiti' }
        ]
      }
    },
    {
      title: 'Inovasi Berterusan & Penyelidikan (R&D)',
      summary: `pelaburan dalam R&D memastikan penyelesaian sentiasa relevan mendahului masa hadapan.`,
      points: [
        'Penerokaan aplikasi AI generatif dan model pembelajaran mesin',
        'Pembangunan paten dan harta intelek bernilai tinggi',
        'Ujian beta bersama komuniti pengguna terpilih'
      ],
      coreHighlight: `Hab Penyelidikan & Inovasi R&D`,
      infographicType: 'RADIAL_ECOSYSTEM',
      meta: {
        archetype: 'RADIAL_ECOSYSTEM',
        nodes: {
          centerNode: 'Pusat Kecemerlangan R&D',
          satellites: [
            { title: 'Makmal AI Masa Hadapan', desc: 'Eksperimen model kognitif canggih' },
            { title: 'Paten & Harta Intelek', desc: 'Perlindungan inovasi proprietari' },
            { title: 'Ujian Kotak Pasir (Sandbox)', desc: 'Pengujian selamat teknologi baharu' },
            { title: 'Hab Kolaborasi Saintifik', desc: 'Kerjasama universiti terkemuka' }
          ]
        }
      }
    },
    {
      title: 'Pemberdayaan Pasukan & Budaya Tangkas',
      summary: `budaya kerja tangkas membolehkan organisasi bertindak pantas terhadap perubahan persekitaran.`,
      points: [
        'Struktur pasukan silang fungsi yang diberi kuasa autonomi',
        'Kitaran sprint dwi-mingguan untuk penambahbaikan berterusan',
        'Penghargaan terhadap inisiatif dan penyelesaian kreatif'
      ],
      coreHighlight: `4 Prinsip Budaya Kerja Tangkas`,
      infographicType: 'MULTI_PILLAR',
      meta: {
        archetype: 'MULTI_PILLAR',
        pillars: [
          { title: 'Autonomi Pasukan', desc: 'Kuasa membuat keputusan di peringkat operasi', icon: 'zap' },
          { title: 'Sprint Dwi-Mingguan', desc: 'Kitaran lelaran pantas dan penilaian kerap', icon: 'refresh-cw' },
          { title: 'Sinergi Silang Fungsi', desc: 'Kerjasama tanpa halangan birokrasi jabatan', icon: 'users' },
          { title: 'Ganjaran Inovasi', desc: 'Pengiktirafan idea berimpak tinggi', icon: 'award' }
        ]
      }
    },
    {
      title: 'Sistem Pemantauan & Papan Pemuka Masa Nyata',
      summary: `keterlihatan data 360 darjah memberikan keupayaan membuat keputusan strategik yang tepat.`,
      points: [
        'Papan pemuka telemetri masa nyata untuk pengurusan kanan',
        'Analisis ramalan menggunakan algoritma pembelajaran mesin',
        'Sistem amaran pintar yang mengesan anomali operasi'
      ],
      coreHighlight: `Papan Pemuka Telemetri Masa Nyata`,
      infographicType: 'STAT_METRIC_GAUGE',
      meta: {
        archetype: 'STAT_METRIC_GAUGE',
        stats: [
          { label: 'Transaksi Harian', value: '1.8M+', change: 'Data Masa Nyata', icon: 'activity' },
          { label: 'Kadar Ralat Sistem', value: '0.01%', change: 'Kestabilan Sempurna', icon: 'check-circle' },
          { label: 'Latency Respons', value: '120ms', change: 'Kelajuan Ultra-Pantas', icon: 'zap' }
        ]
      }
    },
    {
      title: 'Penyelarasan Dasar & Polisi Kebangsaan',
      summary: `penjajaran dasar memastikan pelan selari dengan aspirasi negara dan piawaian global.`,
      points: [
        'Sokongan padu terhadap Rangka Kerja Ekonomi Digital Kebangsaan',
        'Penyelarasan bersama garis panduan keselamatan siber negara',
        'Pematuhan ketetapan kelestarian dan pelepasan karbon'
      ],
      coreHighlight: `Aliran Penjajaran Dasar 4 Langkah`,
      infographicType: 'PROCESS_FLOW',
      meta: {
        archetype: 'PROCESS_FLOW',
        steps: [
          { step: 1, title: 'Kajian Polisi', desc: 'Analisis mandat strategik kerajaan' },
          { step: 2, title: 'Pemetaan SOP', desc: 'Penyesuaian proses kerja dalaman' },
          { step: 3, title: 'Pengesahan Undang-undang', desc: 'Kelulusan pematuhan undang-undang rasmi' },
          { step: 4, title: 'Pelaksanaan Sejajar', desc: 'Penerapan seragam di seluruh organisasi' }
        ]
      }
    },
    {
      title: 'Pengurusan Perubahan (Change Management)',
      summary: `pelan komunikasi dan latihan yang rapi mengatasi penolakan dan mempercepat penerimaan.`,
      points: [
        'Fasa 1: Mewujudkan kesedaran dan dorongan perubahan',
        'Fasa 2: Latihan intensif dan bimbingan mentor berterusan',
        'Fasa 3: Penerimaan menyeluruh dan ganjaran pencapaian'
      ],
      coreHighlight: `Peta Jalan Pengurusan Perubahan 4 Peringkat`,
      infographicType: 'TIMELINE_ROADMAP',
      meta: {
        archetype: 'TIMELINE_ROADMAP',
        phases: [
          { phase: 'Fasa 1', milestone: 'Kesedaran Awal', desc: 'Sesi taklimat & pembentukan visi bersama' },
          { phase: 'Fasa 2', milestone: 'Bimbingan & Latihan', desc: 'Program bengkel amali & sokongan mentor' },
          { phase: 'Fasa 3', milestone: 'Penerapan Penuh', desc: 'Penggunaan harian dalam semua aliran kerja' },
          { phase: 'Fasa 4', milestone: 'Kecemerlangan Terbukti', desc: 'Pembudayaan nilai dan amalan terbaik' }
        ]
      }
    },
    {
      title: 'Penyelesaian Masalah Berstruktur',
      summary: `metodologi penyelesaian masalah secara saintifik mengenal pasti punca akar dan mencegah pengulangan.`,
      points: [
        'Analisis punca akar (Root-Cause Analysis) berasaskan fakta',
        'Reka bentuk penyelesaian berperingkat dengan ujian ketat',
        'Dokumentasi penyelesaian untuk rujukan warga organisasi'
      ],
      coreHighlight: `Metodologi 4 Langkah Penyelesaian Masalah`,
      infographicType: 'PROCESS_FLOW',
      meta: {
        archetype: 'PROCESS_FLOW',
        steps: [
          { step: 1, title: 'Diagnosis Punca', desc: 'Kajian mendalam isu menggunakan 5-Why' },
          { step: 2, title: 'Reka Solusi', desc: 'Pembangunan alternatif penyelesaian pintar' },
          { step: 3, title: 'Ujian Terkawal', desc: 'Pengesahan keberkesanan pada skala kecil' },
          { step: 4, title: 'Standardisasi', desc: 'Pengemaskinian SOP bagi cegah berulang' }
        ]
      }
    },
    {
      title: 'Peluasan Skala & Daya Tahan Sistem',
      summary: `infrastruktur awan anjal mampu menampung lonjakan beban trafik tanpa gangguan perkhidmatan.`,
      points: [
        'Penskalaan automatik (Auto-Scaling) mengikut permintaan trafik',
        'Pelayan berlebihan (Multi-Region Redundancy) mencegah ' + 'titik kegagalan tunggal',
        'Ujian beban berkala bagi menjamin kestabilan puncak'
      ],
      coreHighlight: `4 Dimensi Ketahanan & Skala Sistem`,
      infographicType: 'MULTI_PILLAR',
      meta: {
        archetype: 'MULTI_PILLAR',
        pillars: [
          { title: 'Penskalaan Auto', desc: 'Pelarasan sumber pelayan secara dinamik', icon: 'maximize' },
          { title: 'Multi-Region', desc: 'Lebihan geografi mengelakkan kegagalan setempat', icon: 'globe' },
          { title: 'Ujian Tekanan', desc: 'Simulasi beban ekstrem hingga 5x puncak', icon: 'zap' },
          { title: 'Pemulihan Segera', desc: 'Failover automatik dalam <5 saat', icon: 'refresh-cw' }
        ]
      }
    },
    {
      title: 'Langkah Keselamatan Siber Tambahan',
      summary: `penambahbaikan pertahanan proaktif memastikan perlindungan menyeluruh daripada ancaman terkini.`,
      points: [
        'Ujian penembusan (Penetration Testing) secara berkala oleh pihak ketiga',
        'Latihan kesedaran pemancingan data (Phishing Simulation) untuk staf',
        'Sistem sandaran terpencil yang kalis serangan ransomware'
      ],
      coreHighlight: `4 Benteng Keselamatan Siber Tambahan`,
      infographicType: 'MULTI_PILLAR',
      meta: {
        archetype: 'MULTI_PILLAR',
        pillars: [
          { title: 'Ujian Penembusan', desc: 'Audit keselamatan pihak ketiga secara berkala', icon: 'shield-alert' },
          { title: 'Simulasi Phishing', desc: 'Latihan kesedaran keselamatan warga kerja', icon: 'mail' },
          { title: 'Kalis Ransomware', desc: 'Sandaran data luar talian dengan enkripsi kebal', icon: 'lock' },
          { title: 'Pengesanan AI', desc: 'Analisis tingkah laku mencurigakan segera', icon: 'cpu' }
        ]
      }
    },
    {
      title: 'Impak Jangka Panjang & Visi Masa Hadapan',
      summary: `unjuran pencapaian membuktikan kedudukan organisasi sebagai peneraju kecemerlangan serantau.`,
      points: [
        'Pengukuhan kedudukan sebagai peneraju inovasi digital',
        'Peningkatan taraf sosioekonomi dan kemakmuran bersama',
        'Kelestarian ekosistem yang mampan untuk generasi akan datang'
      ],
      coreHighlight: `3 Unjuran Metrik Impak Jangka Panjang`,
      infographicType: 'STAT_METRIC_GAUGE',
      meta: {
        archetype: 'STAT_METRIC_GAUGE',
        stats: [
          { label: 'Nilai Ekonomi Dijana', value: '5.2x', change: 'Unjuran 2030', icon: 'trending-up' },
          { label: 'Kadar Digitalisasi', value: '100%', change: 'Menyeluruh', icon: 'check-circle' },
          { label: 'Indeks Reputasi', value: '98%', change: 'Penanda Aras', icon: 'star' }
        ]
      }
    },
    {
      title: 'Rumusan Eksekutif & Tindakan Susulan',
      summary: `pelan tindakan segera 30 hari memulakan langkah pertama ke arah transformasi yang berjaya.`,
      points: [
        'Pengesahan belanjawan dan kelulusan pengurusan tertinggi',
        'Pembentukan pasukan petugas khas dan pelantikan ketua projek',
        'Sesi taklimat perasmian bersama semua pihak berkepentingan'
      ],
      coreHighlight: `Rumusan Eksekutif & Tindakan Segera`,
      infographicType: 'BENTO_GRID',
      meta: {
        archetype: 'BENTO_GRID',
        stats: [
          { label: 'Pelan Tindakan', value: '30 Hari', change: 'Fasa Pelancaran', icon: 'calendar' },
          { label: 'Status Kelulusan', value: '100% Siap', change: 'Sedia Pelaksanaan', icon: 'check' }
        ]
      }
    }
  ];

  // If user uploaded a PPT, integrate real presentation content while keeping rich archetype variation
  return rawOutlinesMalay.map((defaultItem, idx) => {
    if (idx < pptSlides.length) {
      const pptItem = pptSlides[idx];
      const title = pptItem.title && pptItem.title.trim().length > 0 ? pptItem.title : defaultItem.title;
      
      // Intelligent bullet splitting on pipe (|), newlines, and numbered subtopics (e.g. 13.1, 13.2)
      let parsedPoints: string[] = [];
      if (pptItem.bullets && pptItem.bullets.length > 0) {
        for (const rawB of pptItem.bullets) {
          if (!rawB || !rawB.trim()) continue;
          if (rawB.includes('|')) {
            const splitted = rawB.split('|').map(s => s.trim()).filter(Boolean);
            parsedPoints.push(...splitted);
          } else if (rawB.includes('\n')) {
            const splitted = rawB.split('\n').map(s => s.trim()).filter(Boolean);
            parsedPoints.push(...splitted);
          } else if (/\d+\.\d+\s+/.test(rawB) && rawB.split(/\d+\.\d+\s+/).length > 2) {
            const matches = rawB.match(/\d+\.\d+[^0-9|•\n]+/g);
            if (matches && matches.length > 1) {
              parsedPoints.push(...matches.map(s => s.trim()));
            } else {
              parsedPoints.push(rawB.trim());
            }
          } else {
            parsedPoints.push(rawB.trim());
          }
        }
      }

      const points = parsedPoints.length > 0 ? parsedPoints.slice(0, 4) : defaultItem.points;

      // If we have 3-4 structured subtopics from PPT, create corresponding archetype metadata
      let synthesizedMeta = { ...defaultItem.meta };
      if (points.length >= 3 && points.length <= 4) {
        if (defaultItem.infographicType === 'MULTI_PILLAR') {
          synthesizedMeta = {
            archetype: 'MULTI_PILLAR',
            pillars: points.map((pt, pIdx) => {
              const parts = pt.split(/[:–-]/);
              return {
                title: parts[0]?.trim() || `Pilar 0${pIdx + 1}`,
                desc: parts[1]?.trim() || `Pengurusan dan pelaksanaan strategik ${pt}`,
                icon: 'shield-check'
              };
            })
          };
        } else if (defaultItem.infographicType === 'PROCESS_FLOW') {
          synthesizedMeta = {
            archetype: 'PROCESS_FLOW',
            steps: points.map((pt, sIdx) => {
              const parts = pt.split(/[:–-]/);
              return {
                step: sIdx + 1,
                title: parts[0]?.trim() || `Langkah 0${sIdx + 1}`,
                desc: parts[1]?.trim() || `Pelaksanaan terperinci ${pt}`
              };
            })
          };
        }
      }

      return {
        ...defaultItem,
        title,
        summary: isMalay
          ? `modul '${title}' memperincikan kandungan pembentangan dengan susun atur infografik berimpak tinggi.`
          : `the module '${title}' details the presentation content with high-impact visual structures.`,
        points,
        meta: synthesizedMeta,
        coreHighlight: `${isMalay ? 'Fokus Utama' : 'Key Focus'}: ${title}`
      };
    }

    return defaultItem;
  });
}

interface McqItem {
  shortTitle: string;
  question: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

function generateMcqQuestions(topic: string, isMalay: boolean, _config?: SetupConfig): McqItem[] {
  if (isMalay) {
    return [
      {
        shortTitle: 'Objektif Utama Pelaksanaan',
        question: `Apakah objektif utama dalam menjayakan inisiatif '${topic}'?`,
        options: [
          { label: 'A', text: 'Meningkatkan kecekapan operasi, keselamatan, dan keberhasilan mampan' },
          { label: 'B', text: 'Menambah birokrasi dan memanjangkan tempoh kelulusan dokumen' },
          { label: 'C', text: 'Mengabaikan standard keselamatan bagi menjimatkan kos segera' },
          { label: 'D', text: 'Menyerahkan keseluruhan keputusan kepada pihak ketiga tanpa kawalan' }
        ],
        correctOption: 'A',
        explanation: 'Kejayaan mana-mana transformasi bergantung kepada peningkatan kecekapan, tadbir urus kukuh, dan kelestarian jangka panjang.'
      },
      {
        shortTitle: 'Tadbir Urus & Pematuhan',
        question: 'Antara berikut, yang manakah merupakan teras utama dalam amalan tadbir urus berwibawa?',
        options: [
          { label: 'A', text: 'Merahsiakan data audit daripada pengurusan tertinggi' },
          { label: 'B', text: 'Ketelusan, akauntabiliti, dan pematuhan standard industri' },
          { label: 'C', text: 'Mengurangkan sesi latihan kakitangan untuk jimat kos' },
          { label: 'D', text: 'Mengabaikan penilaian risiko tahunan' }
        ],
        correctOption: 'B',
        explanation: 'Ketelusan dan akauntabiliti adalah tiang asas pembinaan keyakinan dan integriti organisasi.'
      },
      {
        shortTitle: 'Keselamatan Data & Privasi',
        question: 'Apakah langkah terbaik untuk melindungi maklumat sensitif organisasi?',
        options: [
          { label: 'A', text: 'Menggunakan kata laluan yang sama untuk semua akaun' },
          { label: 'B', text: 'Menyimpan salinan sandaran (backup) secara tidak berkunci' },
          { label: 'C', text: 'Pengesahan Dua Faktor (2FA) dan penyulitan data secara end-to-end' },
          { label: 'D', text: 'Menyahaktifkan kemas kini perisian keselamatan' }
        ],
        correctOption: 'C',
        explanation: 'Pengesahan Dua Faktor dan enkripsi moden menghalang pencerobohan siber secara proaktif.'
      },
      {
        shortTitle: 'Pengurusan Risiko Proaktif',
        question: 'Mengapakah analisis risiko perlu dijalankan sebelum pelaksanaan fasa projek?',
        options: [
          { label: 'A', text: 'Untuk mengenal pasti ancaman awal dan merangka pelan mitigasi berkesan' },
          { label: 'B', text: 'Bagi melambatkan jadual kerja tanpa sebab munasabah' },
          { label: 'C', text: 'Untuk memansuhkan tanggungjawab pihak pengurusan' },
          { label: 'D', text: 'Bagi meningkatkan perbelanjaan sampingan semata-mata' }
        ],
        correctOption: 'A',
        explanation: 'Mitigasi awal mengurangkan kebarangkalian kerugian operasi dan gangguan perkhidmatan.'
      },
      {
        shortTitle: 'Pengukuran KPI Strategik',
        question: 'Apakah ciri utama Petunjuk Prestasi Utama (KPI) yang berkesan?',
        options: [
          { label: 'A', text: 'Kabur dan tidak boleh diukur dengan angka' },
          { label: 'B', text: 'Spesifik, boleh diukur, boleh dicapai, relevan, dan terikat masa (SMART)' },
          { label: 'C', text: 'Ditetapkan tanpa berbincang dengan ahli pasukan' },
          { label: 'D', text: 'Ditukar setiap minggu mengikut kehendak rawak' }
        ],
        correctOption: 'B',
        explanation: 'Kriteria SMART memastikan setiap matlamat mempunyai penanda aras kejayaan yang jelas.'
      },
      {
        shortTitle: 'Prinsip Kelestarian ESG',
        question: 'Bagaimanakah integrasi prinsip ESG memberi manfaat kepada masa depan organisasi?',
        options: [
          { label: 'A', text: 'Memastikan kelestarian alam sekitar, tanggungjawab sosial, dan tadbir urus beretika' },
          { label: 'B', text: 'Hanya sebagai gimik pemasaran tanpa tindakan nyata' },
          { label: 'C', text: 'Meningkatkan pelepasan karbon untuk keuntungan segera' },
          { label: 'D', text: 'Menyingkirkan piawaian hak asasi pekerja' }
        ],
        correctOption: 'A',
        explanation: 'ESG mengukuhkan daya tahan syarikat dan menarik pelaburan bertanggungjawab global.'
      },
      {
        shortTitle: 'Pengurusan Perubahan (Change Management)',
        question: 'Apakah faktor penentu kejayaan terbesar dalam pengurusan perubahan budaya kerja?',
        options: [
          { label: 'A', text: 'Komunikasi telus berterusan dan latihan kompetensi menyeluruh' },
          { label: 'B', text: 'Memaksa dasar baharu secara mendadak tanpa sebarang bimbingan' },
          { label: 'C', text: 'Mengabaikan maklum balas daripada kakitangan barisan hadapan' },
          { label: 'D', text: 'Menghapuskan sesi soal jawab interaktif' }
        ],
        correctOption: 'A',
        explanation: 'Penerimaan warga kerja dicapai melalui kefahaman matlamat, sokongan berterusan, dan empati.'
      },
      {
        shortTitle: 'Pemberdayaan Modal Insan',
        question: 'Apakah strategi paling mampan untuk merapatkan jurang kemahiran kakitangan?',
        options: [
          { label: 'A', text: 'Program peningkatan kemahiran (Upskilling) dan latihan berterusan berasaskan data' },
          { label: 'B', text: 'Menggantikan semua pekerja berpengalaman dengan automasi sepenuhnya' },
          { label: 'C', text: 'Menghentikan bajet latihan tahunan' },
          { label: 'D', text: 'Membiarkan pekerja belajar sendiri tanpa bimbingan modul' }
        ],
        correctOption: 'A',
        explanation: 'Upskilling berterusan melahirkan tenaga kerja yang tangkas dan bersedia menghadapi cabaran masa depan.'
      },
      {
        shortTitle: 'Pengoptimuman Kos & ROI',
        question: 'Bagaimanakah organisasi dapat mencapai ROI (Pulangan Pelaburan) optimum dalam transformasi digital?',
        options: [
          { label: 'A', text: 'Melalui automasi proses bernilai tinggi, pengurangan pembaziran, dan penskalaan teratur' },
          { label: 'B', text: 'Membeli perisian paling mahal tanpa menilai kesesuaian operasi' },
          { label: 'C', text: 'Mengurangkan kualiti produk akhir demi margin tinggi' },
          { label: 'D', text: 'Menutup saluran khidmat pelanggan secara drastik' }
        ],
        correctOption: 'A',
        explanation: 'Pelaburan strategik pada automasi mengurangkan kos operasi berulang secara berkekalan.'
      },
      {
        shortTitle: 'Budaya Kerja Tangkas (Agile)',
        question: 'Apakah kelebihan utama metodologi Agile dalam pengurusan projek moden?',
        options: [
          { label: 'A', text: 'Fleksibiliti tinggi, iterasi pantas, dan maklum balas pelanggan secara berkala' },
          { label: 'B', text: 'Tiada perancangan dokumentasi langsung' },
          { label: 'C', text: 'Mengelakkan mesyuarat penyelarasan pasukan' },
          { label: 'D', text: 'Menghalang inovasi idea baharu' }
        ],
        correctOption: 'A',
        explanation: 'Iterasi pantas membolehkan pasukan menyesuaikan hala tuju dengan cepat mengikut perubahan pasaran.'
      },
      {
        shortTitle: 'Papan Pemuka Data Masa Nyata',
        question: 'Mengapakah analitik data masa nyata penting untuk pembuat keputusan eksekutif?',
        options: [
          { label: 'A', text: 'Memberikan gambaran tepat trend prestasi untuk tindakan pembetulan segera' },
          { label: 'B', text: 'Hanya untuk memaparkan visual grafik berwarna-warni' },
          { label: 'C', text: 'Untuk menggantikan peranan pertimbangan manusia secara mutlak' },
          { label: 'D', text: 'Menyukarkan pemantauan kerja harian' }
        ],
        correctOption: 'A',
        explanation: 'Keputusan berpandukan data (Data-driven decisions) meminimumkan kesilapan persepsi dan spekulasi.'
      },
      {
        shortTitle: 'Mitigasi Krisis Siber',
        question: 'Sekiranya berlaku insiden pencerobohan siber, apakah tindakan pertama yang wajib diambil?',
        options: [
          { label: 'A', text: 'Mengasingkan sistem terjejas, mengaktifkan protokol krisis, dan memaklumkan pasukan tindak balas' },
          { label: 'B', text: 'Memadam semua log aktiviti server serta-merta' },
          { label: 'C', text: 'Membayar sebarang wang tebusan tanpa siasatan forensik' },
          { label: 'D', text: 'Meneruskan operasi biasa seolah-olah tiada apa yang berlaku' }
        ],
        correctOption: 'A',
        explanation: 'Pengasingan pantas (containment) menyekat penyebaran serangan ke segmen infrastruktur lain.'
      },
      {
        shortTitle: 'Kerjasama Rentas Sektor',
        question: 'Apakah faedah utama jalinan kerjasama awam-swasta (PPP) dalam inovasi?',
        options: [
          { label: 'A', text: 'Penggabungan kepakaran teknologi, perkongsian sumber, dan impak skala besar' },
          { label: 'B', text: 'Monopoli pasaran oleh satu entiti tunggal' },
          { label: 'C', text: 'Peningkatan pertikaian undang-undang tanpa penyelesaian' },
          { label: 'D', text: 'Mengurangkan peluang pekerjaan tempatan' }
        ],
        correctOption: 'A',
        explanation: 'Sinergi awam-swasta mempercepatkan komersialisasi dan pembaharuan infrastruktur strategik.'
      },
      {
        shortTitle: 'Audit & Jaminan Kualiti (QA)',
        question: 'Apakah peranan audit berkala dalam kitaran hayat sistem?',
        options: [
          { label: 'A', text: 'Memastikan pematuhan standard kawalan kualiti, keselamatan, dan integriti operasi' },
          { label: 'B', text: 'Mencari kesalahan peribadi kakitangan secara sengaja' },
          { label: 'C', text: 'Menghapuskan dasar sedia ada tanpa penilaian' },
          { label: 'D', text: 'Menambah kekeliruan dalam proses kerja' }
        ],
        correctOption: 'A',
        explanation: 'Audit memastikan standard operasi standard (SOP) dipatuhi dan jurang penambahbaikan dikenal pasti.'
      },
      {
        shortTitle: 'Visi Transformasi Berterusan',
        question: 'Apakah kunci utama memastikan kejayaan transformasi kekal relevan dalam tempoh 10 tahun akan datang?',
        options: [
          { label: 'A', text: 'Pembudayaan inovasi berterusan, kepimpinan berwawasan, dan pembelajaran sepanjang hayat' },
          { label: 'B', text: 'Menolak sebarang pembaharuan teknologi masa hadapan' },
          { label: 'C', text: 'Bergantung kepada kaedah konvensional tanpa perubahan' },
          { label: 'D', text: 'Menghentikan kerjasama dengan rakan strategik global' }
        ],
        correctOption: 'A',
        explanation: 'Daya tahan masa depan terbina atas kesediaan untuk terus berevolusi dan berinovasi.'
      }
    ];
  } else {
    // English MCQ Questions
    return [
      {
        shortTitle: 'Primary Implementation Goal',
        question: `What is the paramount objective in executing the '${topic}' initiative?`,
        options: [
          { label: 'A', text: 'Driving operational excellence, robust compliance, and sustainable growth' },
          { label: 'B', text: 'Introducing unnecessary procedural bureaucracy and delays' },
          { label: 'C', text: 'Bypassing compliance controls to cut initial setup costs' },
          { label: 'D', text: 'Outsourcing all core decision-making without oversight' }
        ],
        correctOption: 'A',
        explanation: 'Strategic transformation thrives upon structured efficiency, solid governance, and sustainable impact.'
      },
      {
        shortTitle: 'Governance & Accountability',
        question: 'Which element represents the cornerstone of exemplary corporate governance?',
        options: [
          { label: 'A', text: 'Concealing internal audit logs from leadership' },
          { label: 'B', text: 'Transparency, rigorous accountability, and global compliance standards' },
          { label: 'C', text: 'Cutting essential safety and training sessions' },
          { label: 'D', text: 'Omitting annual enterprise risk reviews' }
        ],
        correctOption: 'B',
        explanation: 'Transparency and accountability establish organizational credibility and trust.'
      },
      {
        shortTitle: 'Data Protection & Privacy',
        question: 'What is the most effective security control for securing confidential corporate assets?',
        options: [
          { label: 'A', text: 'Reusing universal passwords across all enterprise endpoints' },
          { label: 'B', text: 'Storing unencrypted database archives on public networks' },
          { label: 'C', text: 'Multi-Factor Authentication (MFA) and end-to-end cryptographic encryption' },
          { label: 'D', text: 'Disabling automated security firmware patches' }
        ],
        correctOption: 'C',
        explanation: 'Multi-Factor Authentication and encryption actively preempt unauthorized access vectors.'
      },
      {
        shortTitle: 'Proactive Risk Engineering',
        question: 'Why is proactive threat modeling crucial before project rollout?',
        options: [
          { label: 'A', text: 'To detect early vulnerabilities and implement robust mitigation frameworks' },
          { label: 'B', text: 'To artificially delay operational timelines' },
          { label: 'C', text: 'To dissolve managerial accountability' },
          { label: 'D', text: 'To increase arbitrary expenditures' }
        ],
        correctOption: 'A',
        explanation: 'Early mitigation shields organizations against costly disruptions and systemic downtime.'
      },
      {
        shortTitle: 'Strategic KPI Metrics',
        question: 'What defines a high-impact Key Performance Indicator (KPI)?',
        options: [
          { label: 'A', text: 'Vague, untracked, and subjective milestones' },
          { label: 'B', text: 'Specific, Measurable, Achievable, Relevant, and Time-bound (SMART)' },
          { label: 'C', text: 'Arbitrarily configured without team consultation' },
          { label: 'D', text: 'Randomly altered without rationale every week' }
        ],
        correctOption: 'B',
        explanation: 'SMART benchmarks align collective execution toward verifiable outcomes.'
      },
      {
        shortTitle: 'ESG & Sustainability',
        question: 'How does integrating ESG principles elevate long-term enterprise value?',
        options: [
          { label: 'A', text: 'Fostering environmental stewardship, social equity, and ethical governance' },
          { label: 'B', text: 'Serving purely as superficial marketing rhetoric' },
          { label: 'C', text: 'Accelerating carbon footprints for short-term margins' },
          { label: 'D', text: 'Dismantling workplace safety standards' }
        ],
        correctOption: 'A',
        explanation: 'ESG integration builds long-term operational resilience and attracts institutional capital.'
      },
      {
        shortTitle: 'Change Management Dynamics',
        question: 'What is the primary catalyst for frictionless enterprise adoption?',
        options: [
          { label: 'A', text: 'Continuous transparent communication and immersive skill enablement' },
          { label: 'B', text: 'Mandating abrupt changes without onboarding support' },
          { label: 'C', text: 'Dismissing critical feedback from frontline operators' },
          { label: 'D', text: 'Eliminating structured Q&A opportunities' }
        ],
        correctOption: 'A',
        explanation: 'Adoption success relies on clear purpose communication, enablement, and empathy.'
      },
      {
        shortTitle: 'Workforce Upskilling',
        question: 'Which method best bridges emerging capability gaps across teams?',
        options: [
          { label: 'A', text: 'Data-driven upskilling initiatives and structured talent academies' },
          { label: 'B', text: 'Displacing experienced staff abruptly with unvalidated tools' },
          { label: 'C', text: 'Abolishing the continuous learning budget' },
          { label: 'D', text: 'Leaving employees unassisted without curriculum resources' }
        ],
        correctOption: 'A',
        explanation: 'Continuous upskilling cultivates an agile, future-ready talent ecosystem.'
      },
      {
        shortTitle: 'Capital ROI Optimization',
        question: 'How do organizations maximize ROI during digital modernization?',
        options: [
          { label: 'A', text: 'Automating high-friction workflows, reducing waste, and phased scaling' },
          { label: 'B', text: 'Purchasing top-tier tools without evaluating operational fit' },
          { label: 'C', text: 'Degrading output quality to achieve immediate cost savings' },
          { label: 'D', text: 'Abruptly shutting down customer service channels' }
        ],
        correctOption: 'A',
        explanation: 'Targeted automation yields sustainable efficiency and compounding returns.'
      },
      {
        shortTitle: 'Agile Delivery Frameworks',
        question: 'What is the standout advantage of Agile methodologies in high-velocity teams?',
        options: [
          { label: 'A', text: 'Rapid iterative cycles, high responsiveness, and continuous client alignment' },
          { label: 'B', text: 'Total absence of architectural planning' },
          { label: 'C', text: 'Canceling team synchronization ceremonies' },
          { label: 'D', text: 'Suppressing innovative experimental concepts' }
        ],
        correctOption: 'A',
        explanation: 'Iterative delivery enables teams to pivot swiftly based on market dynamics.'
      },
      {
        shortTitle: 'Real-Time Telemetry & Dashboards',
        question: 'Why are real-time telemetry metrics vital for executive leadership?',
        options: [
          { label: 'A', text: 'Providing accurate situational visibility for decisive corrective interventions' },
          { label: 'B', text: 'Merely displaying aesthetic visual embellishments' },
          { label: 'C', text: 'Completely replacing critical human intuition' },
          { label: 'D', text: 'Complicating day-to-day workflow tracking' }
        ],
        correctOption: 'A',
        explanation: 'Real-time telemetry turns raw data into actionable strategic velocity.'
      },
      {
        shortTitle: 'Cyber Incident Containment',
        question: 'What is the immediate priority upon detecting a network security breach?',
        options: [
          { label: 'A', text: 'Isolating compromised vectors, initiating crisis protocols, and alerting forensics' },
          { label: 'B', text: 'Wiping all security audit event logs instantly' },
          { label: 'C', text: 'Paying ransom demands without forensic triage' },
          { label: 'D', text: 'Continuing standard procedures without containment' }
        ],
        correctOption: 'A',
        explanation: 'Immediate containment halts lateral threat propagation across the network.'
      },
      {
        shortTitle: 'Cross-Sector Ecosystems',
        question: 'What is the premier benefit of Public-Private Partnerships (PPP)?',
        options: [
          { label: 'A', text: 'Combining tech ingenuity, pooled capital, and large-scale public impact' },
          { label: 'B', text: 'Establishing monopolistic control for a single player' },
          { label: 'C', text: 'Increasing unresolved legal disputes' },
          { label: 'D', text: 'Constraining regional job creation' }
        ],
        correctOption: 'A',
        explanation: 'Cross-sector synergy accelerates infrastructure delivery and shared innovation.'
      },
      {
        shortTitle: 'Quality Assurance & Audits',
        question: 'What is the primary role of routine quality audits in system lifecycles?',
        options: [
          { label: 'A', text: 'Validating compliance, security posture, and standard operational protocols' },
          { label: 'B', text: 'Intentionally penalizing individual operators' },
          { label: 'C', text: 'Dismantling standard operational workflows' },
          { label: 'D', text: 'Introducing friction into standard delivery' }
        ],
        correctOption: 'A',
        explanation: 'Audits ensure adherence to rigorous benchmark standards and uncover continuous improvements.'
      },
      {
        shortTitle: 'Decade Vision & Endurance',
        question: 'What guarantees that an organization remains resilient over the next decade?',
        options: [
          { label: 'A', text: 'Institutionalized innovation, visionary leadership, and lifelong learning culture' },
          { label: 'B', text: 'Rejecting emerging technological breakthroughs' },
          { label: 'C', text: 'Stagnating on legacy techniques without adaptation' },
          { label: 'D', text: 'Terminating relationships with strategic partners' }
        ],
        correctOption: 'A',
        explanation: 'Enduring resilience is forged by perpetual learning, agility, and visionary foresight.'
      }
    ];
  }
}
