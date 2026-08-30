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
 * Comprehensive 45 unique teaching poses and dynamic lecturing actions for every single slide
 */
export function getPresenterDynamicExplainingPose(slideNumber: number, isMcq: boolean): string {
  if (isMcq) {
    const mcqPoses: Record<number, string> = {
      31: 'Dynamic Quiz-Master intro stance holding an executive illuminated quiz card in left hand, right arm energetically raised pointing toward Question 1 with a bright encouraging smile',
      32: 'Engaging interactive host posture gesturing in a balanced weighing motion between Option A and Option B, encouraging audience critical thinking with open palms',
      33: 'Analytical quiz pose leaning forward slightly, holding a glowing cyan laser pointer aimed directly at Options C and D with an inquisitive expression',
      34: 'Playful countdown stance with one hand resting thoughtfully on hip and index finger tapping chin as if asking "Which choice is the correct answer?"',
      35: 'High-energy game-show host posture with both arms expressively framing all four MCQ options [A, B, C, D], smiling warmly with engaging eye contact',
      36: 'Inquisitive scenario lecturer pose holding a digital smart tablet, pointing at the scenario prompt while inviting students to evaluate the evidence',
      37: 'Authoritative evaluation stance raising one finger in a key reminder gesture, warning students against common distractor traps in the question',
      38: 'Interactive classroom facilitator posture with hand raised inviting a show of hands for Option A, B, C, or D',
      39: 'Focused diagnostic pose holding a digital stylus, pinpointing the critical keyword in the question header with teaching precision',
      40: 'Practical application host pose gesturing dynamically with an open palm towards the real-world case quiz options',
      41: 'Anticipation and reveal stance with hands outstretched in excitement, ready to spotlight the winning answer choice',
      42: 'Deep conceptual clarification pose, nodding encouragingly with hands framing the correct theoretical reasoning',
      43: 'HOTS (High Order Thinking Skills) master challenge pose with confident smile and assertive teaching posture',
      44: 'Pre-final review stance holding presenter remote clicker, motivating students through the final stretch of quiz questions',
      45: 'Grand celebratory finale posture with both arms triumphantly raised in congratulations for mastering the complete course module',
    };
    return mcqPoses[slideNumber] || mcqPoses[31];
  }

  const lecturePoses: Record<number, string> = {
    1: 'Welcoming keynote speaker posture with open arms and a warm confident smile, welcoming students into the lecture module with charismatic poise',
    2: 'Active explanatory stance holding a sleek glowing digital laser stylus in right hand, aiming a crisp pinpoint beam at Card 1 with direct eye contact',
    3: 'Tech-forward lecturer stance holding an executive digital presentation tablet in left arm, right hand making a 2-finger zoom explanatory gesture',
    4: 'Dynamic upward growth gesture, body turned in a 3/4 angle with right hand raised open-palmed pointing towards top metrics and KPI charts with enthusiasm',
    5: 'Comparative analysis posture with both hands elevated at chest height in a balanced weighing motion, bridging between two strategic pillar cards',
    6: 'Process navigation stance with arm extended tracing smoothly along the horizontal workflow arrows from Step 1 to Step 3 with teaching momentum',
    7: 'Thoughtful strategic insight pose with hand lightly touching chin in deep explanation, breaking down foundational principles with clarity',
    8: 'Executive takeaway spotlight posture with both hands open and framing the bottom key takeaway summary banner with authoritative presence',
    9: 'Interactive lecture engagement stance leaning slightly forward with warm smile, hand open inviting reflection and classroom discussion',
    10: 'Roadmap guide posture holding a digital presenter clicker in one hand, other arm extended guiding students along the chronological timeline milestones',
    11: 'Ecosystem framing pose with hands cupped gently in an arc around the central core hub diagram, detailing interconnected network nodes',
    12: 'Assertive principle reinforcement stance with one hand on hip and other hand making a counting-points finger gesture emphasizing golden rules',
    13: 'Quantitative data demonstration pose leaning towards the metric cards, pointing with smart stylus at percentage values with analytical focus',
    14: 'Real-world case study discussion posture with a dynamic open-palm sweep gesture across the comparison cards and engaging storytelling expression',
    15: 'Risk & mitigation advisory stance with a reassuring lecture expression, palm facing outward emphasizing critical security checkpoints',
    16: 'Operational workflow optimization pose tracing circular process loops with smooth fluid hand motion and focused teaching expression',
    17: 'Digital transformation lecturer posture holding a glowing laser stylus highlighting futuristic cyber architecture blocks',
    18: 'Financial growth & capital management pose pointing directly at the financial metrics with a bright encouraging smile',
    19: 'Corporate governance & audit stance with hands clasped politely at waist, nodding confidently while presenting compliance pillars',
    20: 'Strategic decision matrix pose pointing decisively with index finger at the high-priority quadrant card',
    21: 'Problem diagnosis & root cause pose, tilting head slightly while outlining problem-solving flow steps with teaching clarity',
    22: 'Collaborative ecosystem posture with open welcoming arms framing multi-team integration node cards',
    23: '90-day action plan execution pose, forward-leaning energetic stance gesturing across phased milestone delivery cards',
    24: 'Impact & ROI analysis pose with an uplifting hand gesture celebrating positive metric indicators and successful results',
    25: 'Policy & regulatory compliance stance holding presenter remote clicker, explaining key legal frameworks with formal composure',
    26: 'Synthesis of findings posture with two hands gathering inward in a synthesis gesture, drawing conclusions from presented facts',
    27: 'Scalability & market expansion pose with an expansive horizontal arm gesture indicating global scaling and growth reach',
    28: 'Sustainability & resilience posture, balanced standing stance with hands open at waist height explaining longevity pillars',
    29: 'Comprehensive lecture module summary pose, one hand on hip, other gesturing broadly at the executive summary card',
    30: 'High-energy transition posture with wide smile and open hand pointing forward, enthusiastically introducing the upcoming interactive quiz challenge',
  };

  return lecturePoses[slideNumber] || lecturePoses[((slideNumber - 1) % 30) + 1];
}

/**
 * Returns Malay title of the specific dynamic teaching action for UI badges
 */
export function getPresenterTeachingPoseMalay(slideNumber: number, isMcq: boolean): { title: string; iconType: string } {
  if (isMcq) {
    const mcqTitles: Record<number, { title: string; iconType: string }> = {
      31: { title: 'Hos Kuiz • Pengenalan Soalan 1', iconType: 'HelpCircle' },
      32: { title: 'Hos Kuiz • Perbandingan Pilihan A vs B', iconType: 'Scale' },
      33: { title: 'Hos Kuiz • Penunjuk Pintar Pilihan C & D', iconType: 'Radio' },
      34: { title: 'Hos Kuiz • Detik Fikir & Kiraan Masa', iconType: 'Clock' },
      35: { title: 'Hos Kuiz • Sorotan 4 Pilihan Jawapan', iconType: 'Sparkles' },
      36: { title: 'Hos Kuiz • Pembacaan Senario Kes', iconType: 'FileText' },
      37: { title: 'Hos Kuiz • Amaran Perangkap Pilihan', iconType: 'AlertCircle' },
      38: { title: 'Hos Kuiz • Undian Jawapan Kelas', iconType: 'CheckCircle2' },
      39: { title: 'Hos Kuiz • Petunjuk Kata Kunci', iconType: 'Zap' },
      40: { title: 'Hos Kuiz • Soalan Aplikasi Praktikal', iconType: 'TrendingUp' },
      41: { title: 'Hos Kuiz • Debaran Pendedahan Jawapan', iconType: 'Eye' },
      42: { title: 'Hos Kuiz • Penjelasan Konsep Jawapan', iconType: 'BookOpen' },
      43: { title: 'Hos Kuiz • Cabaran Minda Aras Tinggi (KBAT)', iconType: 'Brain' },
      44: { title: 'Hos Kuiz • Pusingan Akhir Uji Minda', iconType: 'Target' },
      45: { title: 'Hos Kuiz • Sambutan Penguasaan Penuh', iconType: 'Trophy' },
    };
    return mcqTitles[slideNumber] || { title: `Hos Kuiz • Soalan ${slideNumber}`, iconType: 'HelpCircle' };
  }

  const titles: Record<number, { title: string; iconType: string }> = {
    1: { title: 'Ucaptama & Pengenalan Modul', iconType: 'Sparkles' },
    2: { title: 'Penunjuk Laser Pintar • Poin 1', iconType: 'Radio' },
    3: { title: 'Pengajaran Tablet Digital', iconType: 'Smartphone' },
    4: { title: 'Sorotan Metrik & Pertumbuhan', iconType: 'TrendingUp' },
    5: { title: 'Perbandingan Dua Tiang Utama', iconType: 'Scale' },
    6: { title: 'Navigasi Carta Alir Proses', iconType: 'GitFork' },
    7: { title: 'Kupasan Strategik Mendalam', iconType: 'Brain' },
    8: { title: 'Sorotan Rumusan Utama', iconType: 'Bookmark' },
    9: { title: 'Interaksi & Refleksi Kelas', iconType: 'MessageSquare' },
    10: { title: 'Panduan Garis Masa (Roadmap)', iconType: 'Calendar' },
    11: { title: 'Penjelasan Hab Ekosistem', iconType: 'Share2' },
    12: { title: 'Pengukuhan Prinsip Emas', iconType: 'ShieldCheck' },
    13: { title: 'Demonstrasi Data Kuantitatif', iconType: 'BarChart3' },
    14: { title: 'Kajian Kes & Penceritaan', iconType: 'Presentation' },
    15: { title: 'Nasihat Risiko & Kawalan', iconType: 'AlertTriangle' },
    16: { title: 'Pengoptimuman Aliran Kerja', iconType: 'RotateCw' },
    17: { title: 'Transformasi & Seni Bina Digital', iconType: 'Cpu' },
    18: { title: 'Pengurusan Modal & Pembiayaan', iconType: 'DollarSign' },
    19: { title: 'Piawaian Tadbir Urus & Audit', iconType: 'Award' },
    20: { title: 'Keputusan Matriks Keutamaan', iconType: 'Grid' },
    21: { title: 'Diagnosis Punca & Solusi', iconType: 'Search' },
    22: { title: 'Integrasi Ekosistem Rakan Kongsi', iconType: 'Users' },
    23: { title: 'Pelan Tindakan Pelaksanaan 90 Hari', iconType: 'CheckSquare' },
    24: { title: 'Analisis Pulangan Pelaburan (ROI)', iconType: 'TrendingUp' },
    25: { title: 'Panduan Pematuhan Polisi', iconType: 'FileCheck' },
    26: { title: 'Sintesis & Kesimpulan Dapatan', iconType: 'Layers' },
    27: { title: 'Pengembangan & Skalabiliti', iconType: 'Maximize2' },
    28: { title: 'Kelestarian & Daya Tahan', iconType: 'Leaf' },
    29: { title: 'Rumusan Komprehensif Bab', iconType: 'CheckCircle2' },
    30: { title: 'Transisi Ke Sesi Uji Minda', iconType: 'Flame' },
  };

  return titles[slideNumber] || { title: `Gaya Mengajar Slaid ${slideNumber}`, iconType: 'Presentation' };
}

/**
 * Returns broad visual pose archetype for canvas and mockup renderers
 */
export function getPresenterPoseArchetype(slideNumber: number, isMcq: boolean): string {
  if (isMcq) return 'QUIZ_HOST';
  const mod = slideNumber % 7;
  switch (mod) {
    case 1: return 'WELCOMING_KEYNOTE';
    case 2: return 'POINTING_STYLUS';
    case 3: return 'HOLDING_TABLET';
    case 4: return 'UPWARD_METRIC';
    case 5: return 'COMPARISON_GESTURE';
    case 6: return 'STEP_BY_STEP';
    case 0:
    default: return 'THOUGHTFUL_EXPLANATION';
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
    ? `chest pocket nametag badge with crisp bold white letters: '${params.config.nametagText.trim().toUpperCase()}'`
    : `clean corporate attire`;

  const dynamicPose = getPresenterDynamicExplainingPose(params.slideNumber, params.isMcq);

  const charName = (params.config.characterSheet?.characterName || params.config.nametagText || 'DR. AIMAN').toUpperCase();
  const characterSheetPrompt = params.config.characterSheet?.imageUrl
    ? `preserving 100% likeness, facial structure, eye shape, hairstyle, glasses, and skin tone from the reference Character Sheet of '${charName}', rendered in ${params.config.presenterStyle}`
    : params.config.characterSheet?.specs
    ? `character identity '${charName}' (${params.config.characterSheet.specs}${params.config.characterSheet.customCostume ? `, Outfit: ${params.config.characterSheet.customCostume}` : ''}) in ${params.config.presenterStyle}`
    : `a charismatic 3D animated presenter in ${params.config.presenterStyle}`;

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

  const promptNanoBanana2 = `A commercial-grade 16:9 widescreen presentation slide titled '${params.title}' on the topic '${params.config.topic || params.title}'.

[CRITICAL INSTRUCTION - DYNAMIC TEACHING AVATAR IN ACTIVE LECTURE POSE (SLIDE ${params.slideNumber})]:
On the ${posMalay} (${posEn}) stands a 3D animated lecturer avatar (${characterSheetPrompt}) actively TEACHING this slide in a UNIQUE dynamic lecturing pose:
- ACTION & GESTURE: ${dynamicPose}.
- PROPS & INTERACTION: Holding a glowing digital laser pointer, smart stylus, or interactive tablet; body angled naturally toward the slide content with expressive hand gestures interacting with the infographic cards.
- ATTIRE: Tailored executive suit in theme colors with ${nametagSnippet}.
- COMPOSITION: Thigh-up view, standing naturally on the slide floor with soft contact shadow and studio rim lighting. Do NOT paste a static cropped character sheet cutout; render a fully animated, dynamic 3D lecturer in action.

[SLIDE CONTENT & INFOGRAPHIC DESIGN]:
- COLOR THEME: ${scheme.name} (Primary: ${scheme.accentHexes[0] || '#06B6D4'}, Secondary: ${scheme.accentHexes[1] || '#3B82F6'}, Background: ${scheme.bgHex}).
- BACKGROUND: Modern 3D abstract fluid curves, subtle isometric grid dots, soft ambient studio glow.
- MAIN CONTENT AREA: Large legible typography (minimum 16pt+ font size equivalent) with high contrast. ${visualLayoutDesc}
- HEADER: Bold gradient headline '${params.title}' with flawless spelling and crisp kerning.
- SLIDE NUMBER: Bottom corner displays '${params.slideNumber}'.
8K resolution, photorealistic volumetric lighting, ultra-detailed graphic design render, perfectly integrated character.`;

  // 2. Veo 10s Motion Graphics Video Prompt
  let promptVeo10s = '';
  if (params.isMcq && params.mcqData) {
    promptVeo10s = `A high-quality 60fps 10-second motion graphics presentation video using Veo with synchronized narration audio. From 0-2s, presenter character (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}, ${characterSheetPrompt}) on ${posMalay} (${posEn}) actively animates in dynamic teaching pose (${dynamicPose}) while speaking script: '${params.scriptNarration10s}'. From 3-4s, question heading '${params.title}' slides in. From 5-6s, MCQ options A, B, C, D slide in one by one. From 7-8s, correct answer Option ${params.mcqData.correctOption} (${params.mcqData.options.find(o => o.label === params.mcqData?.correctOption)?.text}) illuminates with a vibrant pulse glow and checkmark highlight. From 9-10s, layout completes as presenter smiles and gestures to the revealed answer.`;
  } else {
    promptVeo10s = `A high-quality 60fps 10-second motion graphics presentation video using Veo with synchronized narration audio. From 0-2s, presenter character (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}, ${characterSheetPrompt}) on ${posMalay} (${posEn}) actively animates in dynamic teaching pose (${dynamicPose}) while speaking script: '${params.scriptNarration10s}'. From 3-4s, gradient heading '${params.title}' slides in with elegant kinetic easing. From 5-6s, core infographic data points smoothly cascade in: '${params.pointsOrContent.slice(0, 140)}'. From 7-8s, central key takeaway metric dynamically highlights with accent glow. From 9-10s, visual composition achieves balanced completeness.`;
  }

  // 3. Veo 5s Fast Motion Graphics Prompt
  let promptVeo5s = '';
  if (params.isMcq && params.mcqData) {
    promptVeo5s = `A high-quality 60fps 5-second motion graphics presentation video using Veo focusing on core key points or instant MCQ answer reveal with narration. From 0-2s, presenter (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}) in active teaching stance (${dynamicPose}) speaks concise script: '${params.scriptConcise5s}'. From 2-3s, quiz question slides in rapidly. From 3-5s, correct answer Option ${params.mcqData.correctOption} instantly spotlights with bright glowing highlight and sound chime cue.`;
  } else {
    promptVeo5s = `A high-quality 60fps 5-second motion graphics presentation video using Veo focusing on core key points or instant MCQ answer reveal with narration. From 0-2s, presenter (${params.config.characterSheet ? params.config.characterSheet.characterName : 'avatar'}) in active teaching stance (${dynamicPose}) speaks concise script: '${params.scriptConcise5s}'. From 2-3s, heading '${params.title}' slides in. From 3-5s, essential key highlights and focal infographic point (${params.pointsOrContent.slice(0, 80)}) instantly spotlight with crisp accent illumination.`;
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
