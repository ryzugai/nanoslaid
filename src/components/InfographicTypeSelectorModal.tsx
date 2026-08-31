import React, { useState } from 'react';
import {
  InfographicArchetype,
  SetupConfig,
  SlideData,
  InfographicMetaData
} from '../types';
import { buildInfographicMetaForArchetype } from '../utils/slideGenerator';
import { OFFICIAL_COLOR_SCHEMES } from '../data/colorSchemes';
import { SlideVisualMockup } from './SlideVisualMockup';
import {
  Sparkles,
  GitCommit,
  LayoutGrid,
  Columns3,
  Milestone,
  Scale,
  BarChart3,
  Grid2X2,
  Share2,
  Triangle,
  RotateCw,
  Award,
  CheckCircle2,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export interface InfographicArchetypeOption {
  archetype: InfographicArchetype;
  label: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isRecommended?: boolean;
}

export const TOP_4_RECOMMENDED_ARCHETYPES: InfographicArchetypeOption[] = [
  {
    archetype: 'PROCESS_FLOW',
    label: 'Aliran Proses (Process Flow)',
    badge: 'Paling Popular • Langkah 1-2-3-4',
    description: 'Menyusun maklumat dalam aliran langkah berturutan yang mudah difahami dan teratur.',
    icon: GitCommit,
    isRecommended: true,
  },
  {
    archetype: 'BENTO_GRID',
    label: 'Bento Grid Moden (Bento Grid)',
    badge: 'Gaya Apple/SaaS • Kad Modular',
    description: 'Susun atur kotak modular berhierarki dengan kad sorotan besar, metrik kecil, dan rumusan kunci.',
    icon: LayoutGrid,
    isRecommended: true,
  },
  {
    archetype: 'MULTI_PILLAR',
    label: 'Tiang Strategi (Multi-Pillar)',
    badge: '3-4 Lajur Vertikal • Tonggak Teras',
    description: 'Membahagikan poin kepada 3 lajur tegak dengan lencana dan huraian yang kukuh.',
    icon: Columns3,
    isRecommended: true,
  },
  {
    archetype: 'TIMELINE_ROADMAP',
    label: 'Garis Masa & Fasa (Roadmap)',
    badge: 'Fasa Berturutan • Peta Hala Tuju',
    description: 'Menyusun peristiwa atau strategi mengikut Fasa 01 hingga 04 dengan penanda pencapaian.',
    icon: Milestone,
    isRecommended: true,
  },
];

export const OTHER_ARCHETYPES: InfographicArchetypeOption[] = [
  {
    archetype: 'COMPARISON_MATRIX',
    label: 'Matriks Perbandingan',
    badge: 'Kontras Kiri vs Kanan',
    description: 'Membandingkan 2 aspek atau keadaan sedia ada lawan cadangan solusi secara selari.',
    icon: Scale,
  },
  {
    archetype: 'STAT_METRIC_GAUGE',
    label: 'Metrik & Statistik',
    badge: 'Kad KPI & Tolok Angka',
    description: 'Memberi tumpuan kepada angka pencapaian besar, metrik peratusan, dan tolok kuantitatif.',
    icon: BarChart3,
  },
  {
    archetype: 'QUADRANT_MATRIX',
    label: 'Matriks Kuadran 2x2',
    badge: '4 Zon Keutamaan',
    description: 'Membahagikan strategi kepada 4 kuadran: Segera, Rancang, Laksana, dan Pantau.',
    icon: Grid2X2,
  },
  {
    archetype: 'RADIAL_ECOSYSTEM',
    label: 'Ekosistem Jejari',
    badge: 'Hab Pusat & Satelit',
    description: 'Menempatkan fokus utama di tengah dengan nod-nod satelit mengelilingi hab.',
    icon: Share2,
  },
  {
    archetype: 'PYRAMID_HIERARCHY',
    label: 'Hierarki Piramid',
    badge: '3 Aras Bertingkat',
    description: 'Menyusun konsep dari aras Kemuncak Visi, Pelaksanaan, hingga Asas.',
    icon: Triangle,
  },
  {
    archetype: 'CIRCULAR_CYCLE',
    label: 'Kitaran Gelung 360°',
    badge: 'Pusingan Berterusan',
    description: 'Kitaran proses berulang tanpa henti (PDCA / Continuous Improvement Loop).',
    icon: RotateCw,
  },
  {
    archetype: 'CASE_STUDY_SHOWCASE',
    label: 'Kajian Kes & Impak',
    badge: 'Isu → Solusi → Hasil',
    description: 'Struktur naratif berasaskan bukti: Cabaran Sebenar, Solusi Dilaksana, dan Impak Kejayaan.',
    icon: Award,
  },
];

interface InfographicTypeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  slideNumber: number;
  slideTitle: string;
  slidePoints: string[];
  currentArchetype: InfographicArchetype;
  config: SetupConfig;
  onSelectArchetype: (archetype: InfographicArchetype) => void;
  onApplyToAllRemainingInfographics?: (archetype: InfographicArchetype) => void;
}

export const InfographicTypeSelectorModal: React.FC<InfographicTypeSelectorModalProps> = ({
  isOpen,
  onClose,
  slideNumber,
  slideTitle,
  slidePoints,
  currentArchetype,
  config,
  onSelectArchetype,
  onApplyToAllRemainingInfographics,
}) => {
  const [selectedArchetype, setSelectedArchetype] = useState<InfographicArchetype>(currentArchetype);
  const [activeTab, setActiveTab] = useState<'recommended' | 'all'>('recommended');

  React.useEffect(() => {
    setSelectedArchetype(currentArchetype);
  }, [currentArchetype, isOpen]);

  if (!isOpen) return null;

  const isMalay = config.outputLanguage === 'Bahasa Melayu Baku Malaysia';
  const colorScheme = OFFICIAL_COLOR_SCHEMES.find((s) => s.id === config.colorSchemeId) || OFFICIAL_COLOR_SCHEMES[0];

  // Helper to build a preview mock slide
  const createPreviewSlide = (arch: InfographicArchetype): SlideData => {
    const meta = buildInfographicMetaForArchetype(arch, slideTitle, slidePoints, isMalay);
    return {
      slideNumber,
      title: slideTitle,
      colorSchemeName: colorScheme.name,
      colorSchemeHex: colorScheme.bgHex,
      accentHexes: colorScheme.accentHexes,
      typography: 'Plus Jakarta Sans & Inter Sans-Serif',
      ethnicity: 'Melayu berhijab',
      imageSize: 'Sederhana',
      characterPosition: 'KIRI',
      infographicType: arch,
      infographicPoints: slidePoints,
      infographicMeta: meta,
      isMcq: false,
      scriptAvatar30s: '',
      promptNanoBanana2: '',
      promptVeo10s: '',
      promptVeo5s: '',
      fullFormattedBlock: '',
    };
  };

  const handleConfirm = () => {
    onSelectArchetype(selectedArchetype);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#070F1E] border border-cyan-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0B1729]/95 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Slaid {slideNumber} • Pilihan Reka Bentuk Infografik
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Semasa: <strong className="text-cyan-300">{currentArchetype.replace('_', ' ')}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#06B6D4]" />
              Pilih Gaya Infografik Slaid {slideNumber}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Pilih daripada <strong>4 Cadangan Infografik Utama</strong> dengan live preview di bawah untuk memastikan susun atur visual paling memukau bagi isi kandungan anda.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors self-start sm:self-center"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Archetype Tab Switcher */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-white/10 bg-[#091322] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('recommended')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                activeTab === 'recommended'
                  ? 'bg-gradient-to-r from-[#06B6D4] to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4 Cadangan Infografik Utama</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-[#06B6D4] to-blue-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semua 11 Gaya Infografik ({OTHER_ARCHETYPES.length} Tambahan)</span>
            </button>
          </div>

          <span className="hidden sm:inline-block text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-800/40">
            Pilihan: {selectedArchetype.replace('_', ' ')}
          </span>
        </div>

        {/* Scrollable Archetype Options Grid with Live Previews */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'recommended' ? (
            /* TOP 4 RECOMMENDATIONS WITH LARGE LIVE PREVIEWS */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  4 Cadangan Infografik Terbaik Untuk Slaid Ini
                </h3>
                <span className="text-xs text-slate-400">
                  Klik mana-mana kad untuk memilih gaya
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {TOP_4_RECOMMENDED_ARCHETYPES.map((opt) => {
                  const isSelected = selectedArchetype === opt.archetype;
                  const IconComp = opt.icon;
                  const previewSlide = createPreviewSlide(opt.archetype);

                  return (
                    <div
                      key={opt.archetype}
                      onClick={() => setSelectedArchetype(opt.archetype)}
                      className={`group cursor-pointer rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0B1E38] border-[#06B6D4] ring-2 ring-[#06B6D4]/50 shadow-xl shadow-[#06B6D4]/10'
                          : 'bg-[#081326]/90 border-slate-800 hover:border-slate-600 hover:bg-[#0A1830]'
                      }`}
                    >
                      {/* Top Info Bar */}
                      <div className="p-3.5 border-b border-white/10 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`p-2 rounded-xl border ${
                              isSelected
                                ? 'bg-[#06B6D4] text-slate-950 border-[#06B6D4]'
                                : 'bg-slate-800 text-cyan-400 border-slate-700'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                                {opt.label}
                              </h4>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500 text-slate-950 flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> Dipilih
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-cyan-400 block">
                              {opt.badge}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedArchetype(opt.archetype);
                              onSelectArchetype(opt.archetype);
                              onClose();
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              isSelected
                                ? 'bg-cyan-400 text-slate-950 shadow-sm'
                                : 'bg-white/10 hover:bg-white/20 text-slate-200'
                            }`}
                          >
                            <span>Guna Gaya Ini</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Live Visual Preview of Slide Mockup */}
                      <div className="p-3 bg-black/40">
                        <div className="rounded-xl overflow-hidden border border-white/10 shadow-md transform-gpu transition-transform group-hover:scale-[1.01]">
                          <SlideVisualMockup slide={previewSlide} config={config} />
                        </div>
                      </div>

                      {/* Bottom Description */}
                      <div className="p-3 border-t border-white/5 bg-[#050E1C] flex items-center justify-between text-xs text-slate-400">
                        <p className="line-clamp-2 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ALL 11 ARCHETYPES WITH PREVIEWS */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Semua 11 Gaya Infografik Tersedia
                </h3>
                <span className="text-xs text-slate-400">
                  Pilih mana-mana gaya untuk diaplikasikan pada slaid {slideNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[...TOP_4_RECOMMENDED_ARCHETYPES, ...OTHER_ARCHETYPES].map((opt) => {
                  const isSelected = selectedArchetype === opt.archetype;
                  const IconComp = opt.icon;
                  const previewSlide = createPreviewSlide(opt.archetype);

                  return (
                    <div
                      key={`all-${opt.archetype}`}
                      onClick={() => setSelectedArchetype(opt.archetype)}
                      className={`group cursor-pointer rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0B1E38] border-[#06B6D4] ring-2 ring-[#06B6D4]/50 shadow-lg'
                          : 'bg-[#081326]/90 border-slate-800 hover:border-slate-600 hover:bg-[#0A1830]'
                      }`}
                    >
                      <div className="p-3 border-b border-white/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`p-1.5 rounded-lg border ${
                              isSelected
                                ? 'bg-[#06B6D4] text-slate-950 border-[#06B6D4]'
                                : 'bg-slate-800 text-cyan-400 border-slate-700'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-black text-white truncate">
                              {opt.label}
                            </h4>
                            <span className="text-[9px] font-mono text-cyan-400 truncate block">
                              {opt.badge}
                            </span>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950 shrink-0">
                            ✓
                          </span>
                        ) : null}
                      </div>

                      {/* Compact Preview */}
                      <div className="p-2.5 bg-black/40">
                        <div className="rounded-lg overflow-hidden border border-white/10 shadow-xs">
                          <SlideVisualMockup slide={previewSlide} config={config} />
                        </div>
                      </div>

                      <div className="p-2.5 border-t border-white/5 bg-[#050E1C] flex items-center justify-between text-[11px] text-slate-400">
                        <p className="line-clamp-1">{opt.description}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArchetype(opt.archetype);
                            onSelectArchetype(opt.archetype);
                            onClose();
                          }}
                          className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 ml-2 shrink-0"
                        >
                          Pilih →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-white/10 bg-[#0B1729] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Susun atur visual dan teks prompt imej/video akan dikemas kini secara automatik.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {onApplyToAllRemainingInfographics && (
              <button
                type="button"
                onClick={() => {
                  onApplyToAllRemainingInfographics(selectedArchetype);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold transition-colors"
                title="Guna gaya ini untuk semua 30 slaid infografik"
              >
                Guna Pada Semua 30 Slaid
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 text-slate-300 text-xs font-bold transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#06B6D4]/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sahkan Gaya Slaid Ini</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
