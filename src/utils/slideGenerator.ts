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
  const isMalay = params.config.outputLanguage === 'Bahasa Melayu Baku Malaysia';
  const position = getSlideCharacterPosition(params.slideNumber);
  const scheme = OFFICIAL_COLOR_SCHEMES.find(s => s.id === params.config.colorSchemeId) || OFFICIAL_COLOR_SCHEMES[0];

  const posMalay = position.toLowerCase(); // 'kiri' or 'kanan'
  const posEn = position === 'KIRI' ? 'left' : 'right';

  const charName = (params.config.characterSheet?.characterName || params.config.nametagText || (isMalay ? 'DR. AIMAN' : 'DR. ALEX')).toUpperCase();
  const nametagSnippet = params.config.useNametag && params.config.nametagText.trim()
    ? (isMalay
        ? `lencana nametag poket dada dengan teks putih tebal: '${params.config.nametagText.trim().toUpperCase()}'`
        : `chest pocket nametag badge with crisp bold white letters: '${params.config.nametagText.trim().toUpperCase()}'`)
    : (isMalay ? `pakaian korporat kemas dan profesional` : `clean tailored corporate attire`);

  const dynamicPose = getPresenterDynamicExplainingPose(params.slideNumber, params.isMcq);

  const characterSheetPrompt = params.config.characterSheet?.imageUrl
    ? `preserving 100% likeness, facial structure, eye shape, hairstyle, glasses, and skin tone from the reference Character Sheet of '${charName}', rendered in ${params.config.presenterStyle}`
    : params.config.characterSheet?.specs
    ? `character identity '${charName}' (${params.config.characterSheet.specs}${params.config.characterSheet.customCostume ? `, Outfit: ${params.config.characterSheet.customCostume}` : ''}) in ${params.config.presenterStyle}`
    : `a charismatic 3D animated presenter in ${params.config.presenterStyle}`;

  // Build high-craft, non-list, eye-catching visual layout descriptions
  let visualLayoutDesc = '';
  const meta = params.infographicMeta;

  if (params.isMcq && params.mcqData) {
    const optsStr = params.mcqData.options.map(o => `[${o.label}] "${o.text}"`).join(' | ');
    visualLayoutDesc = isMalay
      ? `Antara muka kuiz interaktif futuristik dengan Kotak Soalan Kaca Beriluminasi dwitone ("${params.mcqData.question}") dan 4 Kad Pilihan Jawapan melengkung (${optsStr}) berasingan dengan lencana huruf bercahaya cerun (A, B, C, D), tanpa sebarang petunjuk jawapan spoiler.`
      : `An interactive high-tech quiz interface with a dual-tone illuminated glassmorphic Question Container ("${params.mcqData.question}") and 4 elevated option cards (${optsStr}) with vibrant glowing letter badges (A, B, C, D) and zero spoiler indicators.`;
  } else if (params.infographicType === 'PROCESS_FLOW' && meta?.steps) {
    const stepsStr = meta.steps.map(s => `[Langkah 0${s.step}: ${s.title} - ${s.desc}]`).join(' ➔ ');
    visualLayoutDesc = isMalay
      ? `Gambar rajah carta alir proses melintang 4-peringkat (${stepsStr}) yang dihubungkan dengan panah penunjuk bercahaya, lencana nombor 3D bergradien, dan kad kaca terangkat dengan teks penerangan berstruktur yang padat dan mudah difahami.`
      : `A dynamic 4-stage horizontal process workflow diagram (${stepsStr}) connected by illuminated directional arrows, 3D gradient numeric badges, and elevated glassmorphic cards with substantial, highly readable explanatory text.`;
  } else if (params.infographicType === 'STAT_METRIC_GAUGE' && meta?.stats) {
    const statsStr = meta.stats.map(s => `[${s.value} - ${s.label} (${s.change || ''})]`).join(', ');
    visualLayoutDesc = isMalay
      ? `Papan pemuka telemetri data eksekutif dengan 3 tolok metrik radial bercahaya dan angka peratusan besar (${statsStr}), dilengkapi bar kemajuan bergradien, penunjuk trend kenaikan, dan kad pencapaian prestasi tinggi.`
      : `An executive KPI telemetry dashboard featuring 3 illuminated radial metric gauges with prominent numeric values (${statsStr}), dynamic gradient progress arcs, upward trend badges, and high-impact performance cards.`;
  } else if (params.infographicType === 'MULTI_PILLAR' && meta?.pillars) {
    const pillarsStr = meta.pillars.map((p, idx) => `[Teras 0${idx + 1}: ${p.title} - ${p.desc}]`).join(' | ');
    visualLayoutDesc = isMalay
      ? `Infografik senibina 4 tiang asas kukuh (${pillarsStr}) berbentuk kolum kaca frosted dengan jalur aksen bergradien di bahagian atas, lambang vektor 3D, dan perincian isi berstruktur yang mendalam.`
      : `A 4-pillar architectural foundation infographic (${pillarsStr}) featuring elevated frosted glass vertical columns topped with dual-tone gradient banners, 3D vector icons, and detailed explanatory descriptions.`;
  } else if (params.infographicType === 'COMPARISON_MATRIX' && meta?.comparison) {
    const cmp = meta.comparison;
    visualLayoutDesc = isMalay
      ? `Matriks perbandingan dwi-kolum berimpak tinggi mengkontraskan "${cmp.leftTitle}" (${cmp.leftItems.join(', ')}) bertemakan merah ros amaran dengan tanda pangkah ✗, melawan "${cmp.rightTitle}" (${cmp.rightItems.join(', ')}) bertemakan hijau zamrud penyelesaian pintar dengan tanda rait rapi ✓.`
      : `A high-contrast side-by-side dual-column comparison matrix contrasting "${cmp.leftTitle}" (${cmp.leftItems.join(', ')}) in warning rose with ✗ marks, versus "${cmp.rightTitle}" (${cmp.rightItems.join(', ')}) in smart solution emerald with ✓ checkmarks.`;
  } else if (params.infographicType === 'RADIAL_ECOSYSTEM' && meta?.nodes) {
    const nodes = meta.nodes;
    const satsStr = nodes.satellites.map(s => `[${s.title}: ${s.desc}]`).join(', ');
    visualLayoutDesc = isMalay
      ? `Gambar rajah ekosistem jejaring radial dengan Hab Pusat bercahaya ("${nodes.centerNode}") di tengah yang dihubungkan melalui garis orbit bercahaya neon kepada 4 kad nod satelit interaktif (${satsStr}) di sekelilingnya.`
      : `A radial network ecosystem diagram with an illuminated central Core Hub ("${nodes.centerNode}") interconnected via glowing neon orbital conduits to 4 surrounding satellite capability cards (${satsStr}).`;
  } else if (params.infographicType === 'TIMELINE_ROADMAP' && meta?.phases) {
    const phasesStr = meta.phases.map(p => `[${p.phase}: ${p.milestone} - ${p.desc}]`).join(' ➔ ');
    visualLayoutDesc = isMalay
      ? `Pelan hala tuju garis masa fasa strategik (${phasesStr}) memaparkan nod fasa berlampu LED, bar kemajuan bergradien mendatar, lencana fasa masa, dan perincian tindakan pencapaian setiap fasa.`
      : `A strategic milestone roadmap timeline (${phasesStr}) displaying illuminated phase milestone nodes, horizontal gradient progress tracks, and actionable delivery details across consecutive phases.`;
  } else if (params.infographicType === 'QUADRANT_MATRIX' && meta?.quadrants) {
    const q = meta.quadrants;
    visualLayoutDesc = isMalay
      ? `Matriks 4-kuadran grid 2x2 [Kuadran 1: "${q.q1.title}" - ${q.q1.desc} | Kuadran 2: "${q.q2.title}" - ${q.q2.desc} | Kuadran 3: "${q.q3.title}" - ${q.q3.desc} | Kuadran 4: "${q.q4.title}" - ${q.q4.desc}] dengan kod warna strategik berasingan, lencana keutamaan, dan sempadan kaca beriluminasi.`
      : `A 2x2 strategic 4-quadrant decision matrix [Q1: "${q.q1.title}" - ${q.q1.desc} | Q2: "${q.q2.title}" - ${q.q2.desc} | Q3: "${q.q3.title}" - ${q.q3.desc} | Q4: "${q.q4.title}" - ${q.q4.desc}] with color-coded category headers and priority badges.`;
  } else if (params.infographicType === 'PYRAMID_HIERARCHY' && meta?.pyramid) {
    const pyr = meta.pyramid;
    visualLayoutDesc = isMalay
      ? `Piramid hierarki berlapis 3-aras [Aras 1 (Atas): "${pyr.top.title}" - ${pyr.top.desc} | Aras 2 (Tengah): "${pyr.middle.title}" - ${pyr.middle.desc} | Aras 3 (Asas): "${pyr.base.title}" - ${pyr.base.desc}] dengan lebar bertingkat, kod cerun warna, dan garis penunjuk hubungan strategik.`
      : `A 3-tier stepped strategic hierarchy pyramid [Top Tier: "${pyr.top.title}" - ${pyr.top.desc} | Middle Tier: "${pyr.middle.title}" - ${pyr.middle.desc} | Base Tier: "${pyr.base.title}" - ${pyr.base.desc}] with tiered horizontal geometry and illuminated gradient levels.`;
  } else if (params.infographicType === 'CIRCULAR_CYCLE' && meta?.cycle) {
    const cycStr = meta.cycle.stages.map(s => `[Peringkat 0${s.stage}: ${s.title} - ${s.desc}]`).join(' ➔ ');
    visualLayoutDesc = isMalay
      ? `Kitaran gelung berterusan 4-peringkat PDCA (${cycStr}) dengan susun atur putaran sehala, panah lengkung penyambung bercahaya, dan kad aktiviti dengan huraian padat bagi setiap peringkat.`
      : `A 4-stage continuous circular cycle loop (${cycStr}) with curved orbital arrows, numbered cyclical badge nodes, and descriptive operational action cards.`;
  } else if (params.infographicType === 'CASE_STUDY_SHOWCASE' && meta?.caseStudy) {
    const cs = meta.caseStudy;
    visualLayoutDesc = isMalay
      ? `Paparan kajian kes 3-bahagian berimpak tinggi [1. Cabaran: "${cs.challenge}" - ${cs.challengeDesc} | 2. Solusi: "${cs.solution}" - ${cs.solutionDesc} | 3. Hasil & Metrik: "${cs.result}" - ${cs.resultDesc} (${cs.impactMetric})] dengan lencana statistik kejayaan besar.`
      : `A 3-column structured case study showcase [1. Challenge: "${cs.challenge}" - ${cs.challengeDesc} | 2. Applied Solution: "${cs.solution}" - ${cs.solutionDesc} | 3. Verified Impact & Metric: "${cs.result}" - ${cs.resultDesc} (${cs.impactMetric})].`;
  } else if (meta?.bento) {
    const b = meta.bento;
    visualLayoutDesc = isMalay
      ? `Papan pemuka grid bento moden asimetrik: Kad Utama Sorotan ("${b.spotlightTitle}" - ${b.spotlightDesc}), 2 Modul Metrik Khas (${b.metric1.label}: ${b.metric1.value}, ${b.metric2.label}: ${b.metric2.value}), dan Jalur Rumusan Eksekutif ("${b.takeaway}").`
      : `An asymmetric modern bento grid layout: Primary Spotlight Card ("${b.spotlightTitle}" - ${b.spotlightDesc}), 2 Secondary Metric Modules (${b.metric1.label}: ${b.metric1.value}, ${b.metric2.label}: ${b.metric2.value}), and Executive Takeaway Banner ("${b.takeaway}").`;
  } else {
    visualLayoutDesc = isMalay
      ? `Papan pemuka visual moden berbilang kad bertingkat dengan kad sorotan maklumat mendalam: "${params.pointsOrContent}". Menggunakan tipografi besar, jelas, dan kontras tinggi (minimum saiz 16pt+).`
      : `A modern multi-card visual dashboard layout highlighting comprehensive content: "${params.pointsOrContent}". Rendered with large, high-contrast, highly legible typography.`;
  }

  // Pure language Nano Banana 2 Image Prompt
  const promptNanoBanana2 = isMalay
    ? `Slaid pembentangan infografik nisbah 16:9 widescreen bertajuk '${params.title}' bagi topik '${params.config.topic || params.title}'.

[ARAHAN WATAK PENSYARAH 3D DINAMIK (SLAID ${params.slideNumber})]:
Di sebelah ${posMalay} berdiri watak pensyarah animasi 3D (${characterSheetPrompt}) yang sedang AKTIF MENGAJAR slaid ini dalam aksi pengajaran unik:
- GAYA PENGAJARAN: ${dynamicPose}.
- ALAT BANTUAN & INTERAKSI: Memegang penunjuk laser pintar bercahaya, stylus sentuh, atau tablet interaktif; tubuh menghadap slaid dengan isyarat tangan menerangkan kad infografik secara karismatik.
- PAKAIAN: Sut korporat kemas mengikut warna tema dengan ${nametagSnippet}.
- KOMPOSISI: Sudut paras paha ke atas (thigh-up), berdiri di atas lantai slaid dengan bayang-bayang realistik dan pencahayaan studio. Jangan tampal gambar kaku potong; jana watak 3D penuh beraksi aktif.

[REKA BENTUK INFOGRAFIK & KANDUNGAN VISUAL]:
- TEMA WARNA: ${scheme.name} (Warna Utama: ${scheme.accentHexes[0] || '#06B6D4'}, Warna Kedua: ${scheme.accentHexes[1] || '#3B82F6'}, Latar Belakang: ${scheme.bgHex}).
- LATAR BELAKANG: Corak geometri 3D moden, grid titik isometrik halus, cahaya studio sekeliling.
- KAWASAN KANDUNGAN UTAMA: Tipografi besar, jelas, dan berkontras tinggi dengan huraian kandungan yang lengkap, padat, dan membantu pemahaman audiens. ${visualLayoutDesc}
- TAJUK UTAMA: Tajuk bergradien tebal '${params.title}' dengan ejaan bahasa Melayu yang tepat tanpa cacat.
- NOMBOR SLAID: Sudut bawah memaparkan '${params.slideNumber}'.
Resolusi 8K, pencahayaan volumetrik fotorealistik, susun atur infografik premium bertaraf antarabangsa.`
    : `A commercial-grade 16:9 widescreen presentation slide titled '${params.title}' on the topic '${params.config.topic || params.title}'.

[CRITICAL INSTRUCTION - DYNAMIC TEACHING AVATAR IN ACTIVE LECTURE POSE (SLIDE ${params.slideNumber})]:
On the ${posEn} stands a 3D animated lecturer avatar (${characterSheetPrompt}) actively TEACHING this slide in a UNIQUE dynamic lecturing pose:
- ACTION & GESTURE: ${dynamicPose}.
- PROPS & INTERACTION: Holding an illuminated laser pointer, stylus, or interactive tablet; body angled naturally toward the slide content with expressive hand gestures interacting with the infographic cards.
- ATTIRE: Tailored executive suit in theme colors with ${nametagSnippet}.
- COMPOSITION: Thigh-up view, standing naturally on the slide floor with soft contact shadow and studio rim lighting. Do NOT paste a static cutout; render a fully animated, dynamic 3D lecturer in action.

[SLIDE CONTENT & INFOGRAPHIC DESIGN]:
- COLOR THEME: ${scheme.name} (Primary: ${scheme.accentHexes[0] || '#06B6D4'}, Secondary: ${scheme.accentHexes[1] || '#3B82F6'}, Background: ${scheme.bgHex}).
- BACKGROUND: Modern 3D abstract fluid curves, subtle isometric grid dots, soft ambient studio glow.
- MAIN CONTENT AREA: Large legible typography (minimum 16pt+ equivalent) with substantial, informative, educational content. ${visualLayoutDesc}
- HEADER: Bold gradient headline '${params.title}' with flawless spelling and crisp kerning.
- SLIDE NUMBER: Bottom corner displays '${params.slideNumber}'.
8K resolution, photorealistic volumetric lighting, ultra-detailed graphic design render, perfectly integrated character.`;

  // Pure language Veo 10s Motion Graphics Video Prompt
  let promptVeo10s = '';
  if (params.isMcq && params.mcqData) {
    promptVeo10s = isMalay
      ? `Video grafik animasi 10 saat 60fps menggunakan Veo dengan audio narasi segerak. Dari 0-2s, watak pensyarah (${charName}, ${characterSheetPrompt}) di sebelah ${posMalay} aktif mengajar (${dynamicPose}) sambil bertutur: '${params.scriptNarration10s}'. Dari 3-4s, tajuk soalan '${params.title}' meluncur masuk. Dari 5-6s, kad pilihan jawapan A, B, C, D muncul berturutan. Dari 7-8s, jawapan tepat Pilihan ${params.mcqData.correctOption} (${params.mcqData.options.find(o => o.label === params.mcqData?.correctOption)?.text}) beriluminasi dengan denyutan cahaya terang dan tanda rait. Dari 9-10s, pensyarah tersenyum dan mengesahkan jawapan tepat.`
      : `A high-quality 60fps 10-second motion graphics presentation video using Veo with synchronized narration audio. From 0-2s, presenter character (${charName}, ${characterSheetPrompt}) on ${posEn} actively animates in dynamic teaching pose (${dynamicPose}) while speaking script: '${params.scriptNarration10s}'. From 3-4s, question heading '${params.title}' slides in. From 5-6s, MCQ options A, B, C, D slide in sequentially. From 7-8s, correct answer Option ${params.mcqData.correctOption} (${params.mcqData.options.find(o => o.label === params.mcqData?.correctOption)?.text}) illuminates with a vibrant pulse glow and checkmark highlight. From 9-10s, layout completes as presenter gestures to the revealed answer.`;
  } else {
    promptVeo10s = isMalay
      ? `Video grafik animasi 10 saat 60fps menggunakan Veo dengan audio narasi segerak. Dari 0-2s, watak pensyarah (${charName}, ${characterSheetPrompt}) di sebelah ${posMalay} aktif mengajar (${dynamicPose}) sambil bertutur: '${params.scriptNarration10s}'. Dari 3-4s, tajuk bergradien '${params.title}' muncul kemas. Dari 5-6s, modul infografik dan data utama meluncur masuk secara berkasualiti: '${params.pointsOrContent.slice(0, 140)}'. Dari 7-8s, elemen sorotan teras beriluminasi dengan kilauan aksen. Dari 9-10s, komposisi visual mencapai keseimbangan harmoni.`
      : `A high-quality 60fps 10-second motion graphics presentation video using Veo with synchronized narration audio. From 0-2s, presenter character (${charName}, ${characterSheetPrompt}) on ${posEn} actively animates in dynamic teaching pose (${dynamicPose}) while speaking script: '${params.scriptNarration10s}'. From 3-4s, gradient heading '${params.title}' slides in with kinetic easing. From 5-6s, core infographic data points smoothly cascade in: '${params.pointsOrContent.slice(0, 140)}'. From 7-8s, central key takeaway dynamically highlights with accent glow. From 9-10s, visual composition achieves balanced completeness.`;
  }

  // Pure language Veo 5s Fast Motion Graphics Prompt
  let promptVeo5s = '';
  if (params.isMcq && params.mcqData) {
    promptVeo5s = isMalay
      ? `Video grafik animasi 5 saat 60fps menggunakan Veo berfokuskan pendedahan jawapan kuiz pantas. Dari 0-2s, pensyarah (${charName}) dalam gaya mengajar (${dynamicPose}) membaca skrip padat: '${params.scriptConcise5s}'. Dari 2-3s, soalan muncul pantas. Dari 3-5s, jawapan tepat Pilihan ${params.mcqData.correctOption} serta-merta disinari cahaya terang dengan bunyi isyarat selesai.`
      : `A high-quality 60fps 5-second motion graphics presentation video using Veo focusing on instant MCQ answer reveal with narration. From 0-2s, presenter (${charName}) in active teaching stance (${dynamicPose}) speaks concise script: '${params.scriptConcise5s}'. From 2-3s, quiz question slides in rapidly. From 3-5s, correct answer Option ${params.mcqData.correctOption} instantly spotlights with bright glowing highlight and chime cue.`;
  } else {
    promptVeo5s = isMalay
      ? `Video grafik animasi 5 saat 60fps menggunakan Veo menumpukan intipati teras dengan narasi. Dari 0-2s, pensyarah (${charName}) dalam gaya mengajar (${dynamicPose}) membaca skrip padat: '${params.scriptConcise5s}'. Dari 2-3s, tajuk '${params.title}' meluncur masuk. Dari 3-5s, sorotan infografik utama (${params.pointsOrContent.slice(0, 80)}) serta-merta disinari pencahayaan aksen kemas.`
      : `A high-quality 60fps 5-second motion graphics presentation video using Veo focusing on core key points with narration. From 0-2s, presenter (${charName}) in active teaching stance (${dynamicPose}) speaks concise script: '${params.scriptConcise5s}'. From 2-3s, heading '${params.title}' slides in. From 3-5s, essential key highlights (${params.pointsOrContent.slice(0, 80)}) instantly spotlight with crisp accent illumination.`;
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
 * Automatically detects the best matching infographic archetype based on actual content,
 * ensuring rich diversity across 11 non-list, eye-catching archetypes without repetition.
 */
function detectArchetypeFromContent(title: string, points: string[], idx: number, isMalay = true): {
  infographicType: InfographicArchetype;
  meta: InfographicMetaData;
} {
  const combined = (title + ' ' + points.join(' ')).toLowerCase();

  // 1. Process / Steps / Flowchart (Stepped Horizontal Flow)
  if (/proses|langkah|aliran|step|flow|stage|procedure|kaedah/i.test(combined) || idx % 11 === 0) {
    const steps = (points.length >= 2 ? points : [
      isMalay ? 'Perancangan Awal: Penilaian keperluan & analisis skop pelaksanaan.' : 'Initial Planning: Requirements assessment and scope analysis.',
      isMalay ? 'Pelaksanaan Teras: Penggunaan automasi dan integrasi teknologi moden.' : 'Core Execution: Deployment of automation and modern technology.',
      isMalay ? 'Kawalan Kualiti: Pengesahan standard keselamatan dan ketepatan data.' : 'Quality Assurance: Verification of security standards and data accuracy.',
      isMalay ? 'Penilaian Impak: Pengukuran keberhasilan dan laporan prestasi berkala.' : 'Impact Review: Performance reporting and milestone evaluation.'
    ]).slice(0, 4).map((pt, sIdx) => {
      const parts = pt.split(/[:–-]/);
      return {
        step: sIdx + 1,
        title: parts[0]?.trim() || (isMalay ? `Langkah 0${sIdx + 1}` : `Step 0${sIdx + 1}`),
        desc: parts.length > 1 ? parts.slice(1).join(' ').trim() : pt
      };
    });
    return {
      infographicType: 'PROCESS_FLOW',
      meta: { archetype: 'PROCESS_FLOW', steps }
    };
  }

  // 2. Stat / Metric Gauge (Radial Gauges & KPI Telemetry)
  if (/peratus|kadar|metrik|statistik|%|kpi|angka|jumlah|kos|unjuran|pencapaian/i.test(combined) || idx % 11 === 1) {
    const stats = (points.length >= 2 ? points : [
      isMalay ? '94% Peningkatan Kecekapan Operasi' : '94% Operational Efficiency Gain',
      isMalay ? '99.8% Ketepatan & Kebolehpercayaan Data' : '99.8% Data Accuracy & Reliability',
      isMalay ? '65% Penjimatan Masa & Kos Pelaksanaan' : '65% Time & Cost Savings'
    ]).slice(0, 3).map((pt, sIdx) => {
      const numMatch = pt.match(/(\d+(?:\.\d+)?%?|\$\d+|\b\d+x\b)/i);
      const val = numMatch ? numMatch[1] : sIdx === 0 ? '94%' : sIdx === 1 ? '99.8%' : '65%';
      const cleanLabel = pt.replace(val, '').replace(/^[:–-\s]+/, '').trim() || (isMalay ? 'Pencapaian Utama' : 'Key Benchmark');
      return {
        label: cleanLabel,
        value: val,
        change: isMalay ? '+35% Kenaikan' : '+35% Growth',
        icon: 'trending-up'
      };
    });
    return {
      infographicType: 'STAT_METRIC_GAUGE',
      meta: { archetype: 'STAT_METRIC_GAUGE', stats }
    };
  }

  // 3. Multi-Pillar (Architectural Columns with 3D Emblems)
  if (/pilar|tonggak|teras|komponen|prinsip|pillar|dimension|dimensi|elemen|aspek/i.test(combined) || idx % 11 === 2) {
    const pillars = (points.length >= 2 ? points : [
      isMalay ? 'Tadbir Urus: Pematuhan standard integriti data tertinggi.' : 'Governance: Strict adherence to high integrity data standards.',
      isMalay ? 'Inovasi Digital: Pemanfaatan algoritma pintar & automasi.' : 'Digital Innovation: Leveraging smart algorithms and automation.',
      isMalay ? 'Pemberdayaan Bakat: Latihan kemahiran berterusan untuk pasukan.' : 'Talent Enablement: Continuous upskilling and team training.',
      isMalay ? 'Sinergi Ekosistem: Jalinan kerjasama strategik jangka panjang.' : 'Ecosystem Synergy: Long-term strategic partnership alignment.'
    ]).slice(0, 4).map((pt, pIdx) => {
      const parts = pt.split(/[:–-]/);
      return {
        title: parts[0]?.trim() || (isMalay ? `Teras 0${pIdx + 1}` : `Pillar 0${pIdx + 1}`),
        desc: parts.length > 1 ? parts.slice(1).join(' ').trim() : pt,
        icon: 'shield-check'
      };
    });
    return {
      infographicType: 'MULTI_PILLAR',
      meta: { archetype: 'MULTI_PILLAR', pillars }
    };
  }

  // 4. Comparison Matrix (Side-by-Side Contrast: Challenges vs Smart Solutions)
  if (/banding|vs|versus|cabaran|lawan|matrix|perbezaan|tradisional/i.test(combined) || idx % 11 === 3) {
    return {
      infographicType: 'COMPARISON_MATRIX',
      meta: {
        archetype: 'COMPARISON_MATRIX',
        comparison: {
          leftTitle: isMalay ? 'Cabaran & Kaedah Tradisional' : 'Legacy Challenges',
          leftItems: isMalay ? [
            'Proses manual yang perlahan dan berisiko tinggi',
            'Silo data yang menyukarkan ketelusan maklumat',
            'Kos penyelenggaraan tinggi tanpa automasi moden'
          ] : [
            'Slow manual workflows prone to errors',
            'Data silos hindering institutional transparency',
            'High operational overhead without modern automation'
          ],
          rightTitle: isMalay ? 'Solusi & Transformasi Pintar' : 'Smart Digital Transformation',
          rightItems: isMalay ? [
            'Automasi pintar mempercepat kitaran kerja sehingga 3x',
            'Pangkalan data berpusat dengan akses masa nyata',
            'Keberkesanan kos jangka panjang dan ketahanan tinggi'
          ] : [
            'Intelligent automation accelerating cycles 3x',
            'Centralized architecture with real-time analytics',
            'Long-term cost efficiency and operational resilience'
          ]
        }
      }
    };
  }

  // 5. Radial Ecosystem (Central Hub & 4 Orbiting Satellites)
  if (/ekosistem|hab|pusat|satelit|jejaring|integrasi|hub|network/i.test(combined) || idx % 11 === 4) {
    return {
      infographicType: 'RADIAL_ECOSYSTEM',
      meta: {
        archetype: 'RADIAL_ECOSYSTEM',
        nodes: {
          centerNode: title.length < 35 ? title : (isMalay ? 'Hab Strategik Bersepadu' : 'Integrated Strategic Hub'),
          satellites: [
            {
              title: isMalay ? 'Modul Analisis Pintar' : 'Smart Analytics Module',
              desc: isMalay ? 'Pemprosesan data masa nyata untuk membuat keputusan tepat.' : 'Real-time telemetry for precision decision making.'
            },
            {
              title: isMalay ? 'Gerbang Keselamatan' : 'Security Gateway',
              desc: isMalay ? 'Penyulitan end-to-end dengan kawalan akses ketat.' : 'End-to-end encryption with zero-trust access control.'
            },
            {
              title: isMalay ? 'Enjin Automasi' : 'Automation Engine',
              desc: isMalay ? 'Penyelarasan aliran kerja berulang secara konsisten.' : 'Orchestrating repetitive workflows consistently.'
            },
            {
              title: isMalay ? 'Papan Pemuka Pantau' : 'Monitoring Dashboard',
              desc: isMalay ? 'Visualisasi KPI holistik untuk pengurusan eksekutif.' : 'Holistic executive KPI telemetry visualization.'
            }
          ]
        }
      }
    };
  }

  // 6. Timeline Roadmap (Phased Milestone Roadmap)
  if (/garis masa|hala tuju|milestone|road\s*map|fasa|jangka\s*masa|timeline/i.test(combined) || idx % 11 === 5) {
    return {
      infographicType: 'TIMELINE_ROADMAP',
      meta: {
        archetype: 'TIMELINE_ROADMAP',
        phases: [
          {
            phase: isMalay ? 'Fasa 1: Q1' : 'Phase 1: Q1',
            milestone: isMalay ? 'Penjajaran & Asas' : 'Alignment & Foundation',
            desc: isMalay ? 'Menetapkan rangka kerja tadbir urus dan audit kesediaan.' : 'Establishing governance frameworks and readiness audit.'
          },
          {
            phase: isMalay ? 'Fasa 2: Q2' : 'Phase 2: Q2',
            milestone: isMalay ? 'Pembangunan & Integrasi' : 'Build & Integration',
            desc: isMalay ? 'Melancarkan modul teras dan penyelarasan pangkalan data.' : 'Deploying core modules and aligning primary databases.'
          },
          {
            phase: isMalay ? 'Fasa 3: Q3' : 'Phase 3: Q3',
            milestone: isMalay ? 'Pengujian & Pelancaran' : 'Testing & Rollout',
            desc: isMalay ? 'Ujian penerimaan pengguna menyeluruh dan latihan intensif.' : 'Comprehensive user acceptance testing and team training.'
          },
          {
            phase: isMalay ? 'Fasa 4: Q4' : 'Phase 4: Q4',
            milestone: isMalay ? 'Pengoptimuman Mampan' : 'Sustainable Scale',
            desc: isMalay ? 'Penambahbaikan berterusan berasaskan maklum balas audiens.' : 'Continuous refinement driven by real audience feedback.'
          }
        ]
      }
    };
  }

  // 7. Quadrant Matrix (2x2 Strategic Priority Matrix)
  if (/kuadran|quadrant|matriks|matrix|keutamaan|swot|keputusan|priority/i.test(combined) || idx % 11 === 6) {
    return {
      infographicType: 'QUADRANT_MATRIX',
      meta: {
        archetype: 'QUADRANT_MATRIX',
        quadrants: {
          q1: {
            title: isMalay ? 'Keutamaan Segera' : 'Immediate Priority',
            desc: isMalay ? 'Impak tinggi dan kebolehlaksanaan pantas untuk pulangan cepat.' : 'High impact, rapid execution delivering immediate ROI.',
            badge: isMalay ? 'Tindakan Serta-Merta' : 'Act Now'
          },
          q2: {
            title: isMalay ? 'Inovasi Strategik' : 'Strategic Innovation',
            desc: isMalay ? 'Pelaburan jangka panjang bagi kepimpinan masa depan.' : 'Long-term investment securing future market leadership.',
            badge: isMalay ? 'Rancang Rapi' : 'Plan Ahead'
          },
          q3: {
            title: isMalay ? 'Pelaksanaan Taktikal' : 'Tactical Wins',
            desc: isMalay ? 'Tugasan mudah yang menyokong kestabilan harian.' : 'Straightforward tasks maintaining daily operational stability.',
            badge: isMalay ? 'Automasi Cekap' : 'Automate'
          },
          q4: {
            title: isMalay ? 'Kawalan Kualiti & Audit' : 'Quality Assurance',
            desc: isMalay ? 'Penandaarasan berterusan untuk menghapuskan pembaziran.' : 'Continuous benchmarking eliminating resource waste.',
            badge: isMalay ? 'Pantau Rapi' : 'Audit'
          }
        }
      }
    };
  }

  // 8. Pyramid Hierarchy (3-Tier Layered Strategic Pyramid)
  if (/piramid|pyramid|hierarki|hierarchy|aras|lapisan|tier|struktur|level/i.test(combined) || idx % 11 === 7) {
    return {
      infographicType: 'PYRAMID_HIERARCHY',
      meta: {
        archetype: 'PYRAMID_HIERARCHY',
        pyramid: {
          top: {
            level: isMalay ? 'Aras 1: Strategik' : 'Tier 1: Strategic',
            title: isMalay ? 'Visi & Hala Tuju Kepimpinan' : 'Leadership Vision & Purpose',
            desc: isMalay ? 'Menetapkan hala tuju makro, falsafah organisasi, dan standard kecemerlangan.' : 'Setting macro direction, core philosophy, and standards of excellence.'
          },
          middle: {
            level: isMalay ? 'Aras 2: Taktikal' : 'Tier 2: Tactical',
            title: isMalay ? 'Sistem & Operasi Pintar' : 'Smart Systems & Operations',
            desc: isMalay ? 'Penyelarasan aliran kerja antara jabatan dengan automasi proses.' : 'Cross-functional workflow orchestration and process automation.'
          },
          base: {
            level: isMalay ? 'Aras 3: Asas' : 'Tier 3: Foundation',
            title: isMalay ? 'Infrastruktur & Integriti Data' : 'Infrastructure & Data Integrity',
            desc: isMalay ? 'Pangkalan data selamat, keselamatan maklumat, dan pematuhan peraturan.' : 'Secure databases, information security, and governance compliance.'
          }
        }
      }
    };
  }

  // 9. Circular Cycle (4-Stage Continuous PDCA Loop)
  if (/kitaran|cycle|gelung|loop|pdca|pusingan|berterusan|continuous/i.test(combined) || idx % 11 === 8) {
    return {
      infographicType: 'CIRCULAR_CYCLE',
      meta: {
        archetype: 'CIRCULAR_CYCLE',
        cycle: {
          stages: [
            {
              stage: 1,
              title: isMalay ? 'Rancang (Plan)' : 'Plan',
              desc: isMalay ? 'Menentukan matlamat jelas, KPI terukur, dan pengagihan sumber optimum.' : 'Defining clear goals, measurable KPIs, and optimal resource allocation.'
            },
            {
              stage: 2,
              title: isMalay ? 'Laksana (Do)' : 'Execute',
              desc: isMalay ? 'Menggerakkan pelan operasi berpandukan standard prosedur kerja piawai.' : 'Mobilizing operational execution guided by standard operating procedures.'
            },
            {
              stage: 3,
              title: isMalay ? 'Nilai (Check)' : 'Evaluate',
              desc: isMalay ? 'Menganalisis hasil sebenar berbanding sasaran menggunakan data analitik.' : 'Benchmarking actual outcomes against targets with rigorous analytics.'
            },
            {
              stage: 4,
              title: isMalay ? 'Tambah Baik (Act)' : 'Optimize',
              desc: isMalay ? 'Membuat penyesuaian strategi dan memperkukuh kecekapan keseluruhan.' : 'Iterating strategic refinements to maximize ongoing performance.'
            }
          ]
        }
      }
    };
  }

  // 10. Case Study Showcase (3-Panel Problem -> Solution -> Impact)
  if (/kajian kes|case study|impak|masalah|solusi|bukti|hasil|pembuktian/i.test(combined) || idx % 11 === 9) {
    return {
      infographicType: 'CASE_STUDY_SHOWCASE',
      meta: {
        archetype: 'CASE_STUDY_SHOWCASE',
        caseStudy: {
          challenge: isMalay ? 'Cabaran Operasi Utama' : 'Primary Operational Challenge',
          challengeDesc: isMalay ? 'Kerumitan pengurusan manual menyebabkan kelewatan 40% dan ketidaktelusan aliran maklumat.' : 'Manual overhead causing 40% delays and fragmented communication across teams.',
          solution: isMalay ? 'Penyelesaian Holistik Dilaksana' : 'Applied Holistic Solution',
          solutionDesc: isMalay ? 'Penyepaduan platform pintar berpusat dengan automasi pengesahan dan papan pemuka analitik.' : 'Centralized digital workflow platform with automated validation and real-time oversight.',
          result: isMalay ? 'Impak & Hasil Terbukti' : 'Verified Measurable Impact',
          resultDesc: isMalay ? 'Peningkatan produktiviti menyeluruh, penjimatan kos operasi, dan kepuasan audiens 98%.' : 'Total productivity boost, direct operational savings, and 98% user satisfaction.',
          impactMetric: isMalay ? '+85% Keberhasilan Mampan' : '+85% Sustainable Gain'
        }
      }
    };
  }

  // 11. Asymmetric Modern Bento Grid (Default Master Highlight + Dual Metrics + Takeaway)
  return {
    infographicType: 'BENTO_GRID',
    meta: {
      archetype: 'BENTO_GRID',
      bento: {
        spotlightTitle: isMalay ? 'Sorotan Strategik Utama' : 'Core Strategic Spotlight',
        spotlightDesc: points.length > 0 ? points[0] : (isMalay ? 'Pelaksanaan rangka kerja berimpak tinggi yang menggabungkan automasi pintar dan tadbir urus mampan.' : 'Deployment of high-impact frameworks combining smart automation with sustainable governance.'),
        metric1: {
          label: isMalay ? 'Peningkatan Produktiviti' : 'Productivity Rate',
          value: '96.4%',
          badge: isMalay ? 'Sasaran Tercapai' : 'Target Exceeded'
        },
        metric2: {
          label: isMalay ? 'Ketepatan Standard' : 'Standard Accuracy',
          value: '99.9%',
          badge: isMalay ? 'Standard ISO' : 'ISO Benchmark'
        },
        takeaway: points.length > 1 ? points[1] : (isMalay ? 'Kejayaan pelaksanaan bersandarkan kepada penjajaran strategi yang teliti dan pemantauan berterusan.' : 'Successful delivery relies on meticulous alignment and persistent verification.')
      }
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
      const points = item.points.length > 0 ? item.points : [
        isMalay ? `Analisis mendalam dan ketetapan matlamat bagi ${title}.` : `Comprehensive analysis and strategic target alignment for ${title}.`,
        isMalay ? `Penyelarasan aliran kerja operasi dengan automasi dan tadbir urus berkesan.` : `Operational workflow orchestration with smart automation and governance.`,
        isMalay ? `Pemantauan berterusan metrik kualiti bagi memastikan hasil berimpak tinggi.` : `Continuous monitoring of quality metrics to ensure sustainable outcomes.`
      ];
      const { infographicType, meta } = detectArchetypeFromContent(title, points, i, isMalay);

      generatedOutlines.push({
        title: i >= slidesPool.length ? `${title} (${isMalay ? 'Fasa' : 'Phase'} ${Math.floor(i / slidesPool.length) + 1})` : title,
        summary: isMalay
          ? `modul '${title}' membentangkan maklumat penting berasaskan kandungan fail yang dimuat naik.`
          : `the section '${title}' presents crucial insights derived from the uploaded presentation.`,
        points,
        coreHighlight: isMalay ? `Fokus: ${title}` : `Focus: ${title}`,
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
      const title = lines[0].replace(/^[#\[\]\d+\.\-\*:]\s*/, '') || (isMalay ? `Bahagian ${pIdx + 1}` : `Section ${pIdx + 1}`);
      const bullets = cleanAndExtractBullets(lines.slice(1));
      parsedSections.push({
        title,
        points: bullets.length > 0 ? bullets : [lines.join(' ')]
      });
    }

    if (parsedSections.length > 0) {
      for (let i = 0; i < 30; i++) {
        const item = parsedSections[i % parsedSections.length];
        const title = i >= parsedSections.length ? `${item.title} (${isMalay ? 'Lanjutan' : 'Deep Dive'} ${Math.floor(i / parsedSections.length) + 1})` : item.title;
        const points = item.points.length > 0 ? item.points : [
          isMalay ? `Meneliti prinsip utama dan aplikasi praktikal bagi ${title}.` : `Examining foundational principles and practical applications for ${title}.`,
          isMalay ? `Penyelarasan langkah taktikal ke arah standard kecemerlangan.` : `Tactical alignment towards high-tier performance benchmarks.`,
          isMalay ? `Pengukuhan jaminan kualiti dan impak jangka panjang.` : `Strengthening quality assurance and long-term impact.`
        ];
        const { infographicType, meta } = detectArchetypeFromContent(title, points, i, isMalay);

        generatedOutlines.push({
          title,
          summary: isMalay
            ? `perbincangan '${title}' menghuraikan aspek teras daripada teks rujukan yang dibekalkan.`
            : `the module '${title}' details the key principles from the reference text.`,
          points,
          coreHighlight: isMalay ? `Fokus: ${title}` : `Focus: ${title}`,
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
    'Tadbir Urus & Pematuhan Integriti',
    'Pelaksanaan Operasi Pintar',
    'Pembangunan Modal Insan & Bakat',
    'Kolaborasi & Sinergi Ekosistem',
    'Aliran Proses Pelaksanaan Berperingkat',
    'Analisis Risiko & Pelan Mitigasi',
    'Metrik Prestasi & Sasaran KPI',
    'Pengoptimuman Sumber & Belanjawan',
    'Integrasi Teknologi & Keselamatan Data',
    'Pengurusan Perubahan & Budaya Kerja',
    'Kawalan Kualiti & Penandaarasan',
    'Kajian Impak & Nilai Pemegang Taruh',
    'Struktur Pasukan & Peranan Utama',
    'Pelan Hala Tuju Garis Masa Strategik',
    'Strategi Komunikasi & Penyampaian',
    'Audit Prestasi & Ketelusan Maklumat',
    'Automasi Proses & Peningkatan Kecekapan',
    'Dasar Keselamatan & Privasi Digital',
    'Pemerkasaan Bakat & Latihan Berterusan',
    'Pengukuran Kepuasan & Maklum Balas',
    'Inovasi Berterusan & Penyelidikan',
    'Ketahanan Operasi & Pelan Kontingensi',
    'Kelestarian & Pertumbuhan Mampan',
    'Pelan Tindakan Segera 30 Hari',
    'Faktor Kejayaan Kritikal Organisasi',
    'Rumusan Eksekutif & Penutup'
  ];

  const defaultModulesEnglish = [
    'Executive Introduction & Strategic Vision',
    'Background & Needs Assessment',
    'Core Objectives & Goals',
    'Foundational Principles & Architecture',
    'Governance & Integrity Compliance',
    'Smart Operational Execution',
    'Talent Development & Human Capital',
    'Ecosystem Collaboration & Synergy',
    'Phased Process Workflow Delivery',
    'Risk Analysis & Mitigation Framework',
    'Performance Metrics & KPI Targets',
    'Resource Allocation & Budget Optimization',
    'Technology Integration & Data Security',
    'Change Management & Organizational Culture',
    'Quality Control & Benchmarking',
    'Stakeholder Impact & Community Value',
    'Team Structure & Key Responsibilities',
    'Strategic Timeline & Milestone Roadmap',
    'Communication & Delivery Strategy',
    'Performance Audit & Information Transparency',
    'Process Automation & Operational Efficiency',
    'Security Policy & Digital Privacy',
    'Talent Enablement & Continuous Upskilling',
    'Satisfaction Measurement & Feedback Loops',
    'Continuous Innovation & R&D',
    'Operational Resilience & Contingency Plan',
    'Sustainability & Long-Term Growth',
    'Immediate 30-Day Action Plan',
    'Critical Success Factors (CSF)',
    'Executive Summary & Conclusion'
  ];

  for (let i = 0; i < 30; i++) {
    const modTitle = isMalay
      ? (defaultModulesMalay[i] || `Modul ${i + 1}`)
      : (defaultModulesEnglish[i] || `Module ${i + 1}`);
    const fullTitle = `${modTitle}: ${mainTopic}`;
    const points = isMalay ? [
      `Menetapkan kerangka kerja asas bagi ${modTitle} dalam inisiatif ${mainTopic} secara menyeluruh.`,
      `Menyelaraskan strategi pelaksanaan berkesan bersama semua pemegang taruh untuk hasil maksimum.`,
      `Memastikan pematuhan standard kualiti tinggi dan pemantauan metrik secara telus dan berterusan.`
    ] : [
      `Establishing core foundational frameworks for ${modTitle} within the ${mainTopic} initiative.`,
      `Aligning execution strategies with cross-functional teams to maximize sustainable impact.`,
      `Ensuring strict adherence to high-tier benchmarks and ongoing transparent metric tracking.`
    ];
    const { infographicType, meta } = detectArchetypeFromContent(fullTitle, points, i, isMalay);

    generatedOutlines.push({
      title: fullTitle,
      summary: isMalay
        ? `modul '${fullTitle}' menggariskan tindakan strategik bagi mencapai hasil optimum.`
        : `the segment '${fullTitle}' outlines strategic execution for optimal impact.`,
      points,
      coreHighlight: isMalay ? `Fokus: ${modTitle}` : `Focus: ${modTitle}`,
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
