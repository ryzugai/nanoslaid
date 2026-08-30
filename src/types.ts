export interface ColorScheme {
  id: number;
  name: string;
  mode: 'Dark Mode' | 'Light Mode';
  bgHex: string;
  accentHexes: string[];
  category: 'Corporate' | 'Tech & Cyber' | 'Clean & Minimal' | 'Luxury & Gold' | 'Nature & Health' | 'Creative & Vibrant';
  description: string;
}

export interface CharacterSheetData {
  fileName: string;
  imageUrl: string; // Base64 / blob data URL
  characterName: string; // e.g. "Dr. Aiman" or "Prof. Siti"
  specs: string; // Detailed visual descriptors (hijab style, glasses, suit, facial expression)
  customCostume?: string;
  gender?: 'Lelaki' | 'Wanita';
}

export interface UploadedPptData {
  fileName: string;
  fileSize: string;
  slideCount: number;
  extractedSlides: {
    slideNumber: number;
    title: string;
    bullets: string[];
    rawText: string;
  }[];
  fullExtractedText: string;
}

export interface SetupConfig {
  useNametag: boolean;
  nametagText: string; // Strictly UPPERCASE
  colorSchemeId: number;
  outputLanguage: 'Bahasa Melayu Baku Malaysia' | 'English';
  presenterStyle: 'Pixar 3D Style' | 'Photorealistic Style';
  topic: string;
  referenceText: string;
  characterSheet?: CharacterSheetData;
  uploadedPpt?: UploadedPptData;
}

export interface McqOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface McqDetails {
  question: string;
  options: McqOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export type InfographicArchetype =
  | 'PROCESS_FLOW'
  | 'STAT_METRIC_GAUGE'
  | 'MULTI_PILLAR'
  | 'COMPARISON_MATRIX'
  | 'RADIAL_ECOSYSTEM'
  | 'TIMELINE_ROADMAP'
  | 'BENTO_GRID';

export interface InfographicMetaData {
  archetype: InfographicArchetype;
  steps?: { step: number; title: string; desc: string }[];
  stats?: { label: string; value: string; change?: string; icon?: string }[];
  pillars?: { title: string; desc: string; icon?: string }[];
  comparison?: {
    leftTitle: string;
    leftItems: string[];
    rightTitle: string;
    rightItems: string[];
  };
  phases?: { phase: string; milestone: string; desc: string }[];
  nodes?: { centerNode: string; satellites: { title: string; desc: string }[] };
}

export interface SlideData {
  slideNumber: number; // 1 to 45
  isMcq: boolean; // false for 1-30, true for 31-45
  title: string;
  characterPosition: 'KIRI' | 'KANAN';
  colorSchemeName: string;
  colorSchemeHex: string;
  accentHexes: string[];
  imageSize: 'Besar' | 'Sederhana' | 'Kecil';
  ethnicity: 'Melayu berhijab' | 'Cina' | 'India';
  typography: string;
  infographicType?: InfographicArchetype;
  infographicPoints?: string[];
  infographicMeta?: InfographicMetaData;
  mcqDetails?: McqDetails;
  promptNanoBanana2: string;
  promptVeo10s: string;
  promptVeo5s: string;
  scriptAvatar30s: string;
  fullFormattedBlock: string;
  generatedImageUrl?: string;
  imageGenerating?: boolean;
  imageError?: string;
  imageSource?: string;
}

export interface GenerationProgress {
  status: 'idle' | 'generating' | 'completed' | 'error';
  currentSlide: number;
  totalSlides: number;
  message: string;
  error?: string;
}
