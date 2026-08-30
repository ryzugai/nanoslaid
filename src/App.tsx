import React, { useState, useEffect, useMemo } from 'react';
import { SetupConfig, SlideData } from './types';
import { generateCurated45Slides } from './utils/slideGenerator';
import { OFFICIAL_COLOR_SCHEMES } from './data/colorSchemes';
import { Header } from './components/Header';
import { SlideCard } from './components/SlideCard';
import { MandatorySetupModal } from './components/MandatorySetupModal';
import { MCQQuizModal } from './components/MCQQuizModal';
import { ExportModal } from './components/ExportModal';
import { TeleprompterModal } from './components/TeleprompterModal';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Layers,
  HelpCircle,
  Filter,
  CheckCircle2,
  RefreshCw,
  Eye,
  FileDown,
  Info,
  ChevronDown
} from 'lucide-react';

export default function App() {
  // Default configuration
  const [config, setConfig] = useState<SetupConfig>({
    topic: 'Transformasi AI & Keselamatan Siber Malaysia',
    referenceText: `Modul Latihan: AI & Keselamatan Siber 2026\nBahagian 1: Ekosistem AI Generatif dan Model Bahasa Besar.\nBahagian 2: Ancaman Siber Moden: Phishing, Deepfake, dan Ransomware.\nBahagian 3: Garis Panduan Tadbir Urus AI Kebangsaan dan Etika Data.\nBahagian 4: Langkah Perlindungan Praktikal Kakitangan Awam & Korporat.`,
    useNametag: true,
    nametagText: 'DR. AIMAN',
    colorSchemeId: 1, // Corporate Blue Luxury
    outputLanguage: 'Bahasa Melayu Baku Malaysia',
    presenterStyle: 'Pixar 3D Style',
  });

  const [hasSetupCompleted, setHasSetupCompleted] = useState(true);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [teleprompterSlide, setTeleprompterSlide] = useState<SlideData | null>(null);

  const [slides, setSlides] = useState<SlideData[]>(() => generateCurated45Slides(config));
  const [filterType, setFilterType] = useState<'all' | 'infographic' | 'mcq' | 'left' | 'right' | 'withImage'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  // Update slide with generated image
  const handleUpdateSlideImage = (slideNumber: number, imageUrl: string, source: string) => {
    setSlides((prev) =>
      prev.map((s) =>
        s.slideNumber === slideNumber
          ? { ...s, generatedImageUrl: imageUrl, imageSource: source }
          : s
      )
    );
  };

  // Generate slides when config changes
  const handleSaveAndGenerate = (newConfig: SetupConfig) => {
    setConfig(newConfig);
    const generated = generateCurated45Slides(newConfig);
    setSlides(generated);
    setIsSetupModalOpen(false);
    setHasSetupCompleted(true);
  };

  const handleCopyAll = async () => {
    let fullOutput = `========================================================================
PENJANA PROMPT 45 SLAID & VIDEO VEO RASMI
Topik: ${config.topic}
Skim Warna: Skim #${config.colorSchemeId} (${slides[0]?.colorSchemeName || 'Corporate'})
Bahasa: ${config.outputLanguage}
Gaya Watak: ${config.presenterStyle}
Nametag: ${config.useNametag ? config.nametagText.toUpperCase() : 'Tiada'}
Jumlah Slaid: 45 Slaid Lengkap
========================================================================\n\n`;

    slides.forEach((s) => {
      fullOutput += `${s.fullFormattedBlock}\n\n------------------------------------------------------------------------\n\n`;
    });

    try {
      await navigator.clipboard.writeText(fullOutput);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter and search slides
  const filteredSlides = useMemo(() => {
    return slides.filter((slide) => {
      // Type filter
      if (filterType === 'infographic' && slide.isMcq) return false;
      if (filterType === 'mcq' && !slide.isMcq) return false;
      if (filterType === 'left' && slide.characterPosition !== 'KIRI') return false;
      if (filterType === 'right' && slide.characterPosition !== 'KANAN') return false;
      if (filterType === 'withImage' && !slide.generatedImageUrl) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = slide.title.toLowerCase().includes(q);
        const matchesScript = slide.scriptAvatar30s.toLowerCase().includes(q);
        const matchesNumber = slide.slideNumber.toString() === q;
        const matchesMcq = slide.mcqDetails?.question.toLowerCase().includes(q);
        return matchesTitle || matchesScript || matchesNumber || matchesMcq;
      }

      return true;
    });
  }, [slides, filterType, searchQuery]);

  const currentScheme = OFFICIAL_COLOR_SCHEMES.find((s) => s.id === config.colorSchemeId) || OFFICIAL_COLOR_SCHEMES[0];
  const mcqSlides = useMemo(() => slides.filter((s) => s.isMcq), [slides]);
  const generatedCount = useMemo(() => slides.filter((s) => !!s.generatedImageUrl).length, [slides]);

  return (
    <div className="min-h-screen bg-[#091322] text-slate-200 transition-colors">
      {/* Top Main Navigation */}
      <Header
        config={config}
        slidesCount={slides.length}
        onOpenSetup={() => setIsSetupModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenQuiz={() => setIsQuizModalOpen(true)}
        onCopyAll={handleCopyAll}
        copiedAll={copiedAll}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Executive Overview Banner */}
        <div className="p-6 rounded-2xl border border-white/10 bg-[#0B1729] shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Subtle Accent Glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: currentScheme.accentHexes[0] || '#06B6D4' }}
          />

          <div className="space-y-2 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#06B6D4] text-[#091322] shadow-sm">
                45 SLAID TERJANA
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#091322] text-slate-300 border border-white/10">
                30 Infografik + 15 MCQ
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#091322] text-slate-300 border border-white/10">
                {config.outputLanguage}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#091322] text-slate-300 border border-white/10">
                {config.presenterStyle}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {config.topic}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Sistem prompt rasmi Nano Banana 2 &amp; Veo siap dijana dengan kedudukan avatar berselang-seli (Ganjil=KIRI, Genap=KANAN), kepelbagaian etnik Malaysia, tipografi sempurna tanpa ralat, serta skrip avatar 30 saat.
            </p>
          </div>

          {/* Quick Metrics / Action */}
          <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
            <button
              type="button"
              onClick={() => setIsSetupModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#091322] hover:border-[#06B6D4]/40 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-xs transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#06B6D4]" />
              <span>Tukar Konfigurasi 4 Soalan</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveAndGenerate(config)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#34D399] text-[#091322] hover:opacity-90 text-xs font-bold flex items-center gap-2 shadow-md transition-all font-sans"
            >
              <RefreshCw className="w-4 h-4 text-[#091322]" />
              <span>Jana Semula 45 Slaid</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl border border-white/10 bg-[#0B1729] shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === 'all'
                  ? 'bg-[#06B6D4] text-[#091322] font-bold shadow-xs'
                  : 'bg-[#091322] text-slate-300 hover:bg-[#13233a] border border-white/5'
              }`}
            >
              Semua Slaid (45)
            </button>

            <button
              type="button"
              onClick={() => setFilterType('infographic')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === 'infographic'
                  ? 'bg-[#06B6D4] text-[#091322] font-bold shadow-xs'
                  : 'bg-[#091322] text-slate-300 hover:bg-[#13233a] border border-white/5'
              }`}
            >
              Infografik Utama (1 - 30)
            </button>

            <button
              type="button"
              onClick={() => setFilterType('mcq')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === 'mcq'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-[#091322] text-slate-300 hover:bg-[#13233a] border border-white/5'
              }`}
            >
              Soalan MCQ (31 - 45)
            </button>

            <button
              type="button"
              onClick={() => setFilterType('left')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === 'left'
                  ? 'bg-[#34D399] text-[#091322] font-bold shadow-xs'
                  : 'bg-[#091322] text-slate-300 hover:bg-[#13233a] border border-white/5'
              }`}
            >
              Avatar KIRI (Ganjil)
            </button>

            <button
              type="button"
              onClick={() => setFilterType('right')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filterType === 'right'
                  ? 'bg-[#34D399] text-[#091322] font-bold shadow-xs'
                  : 'bg-[#091322] text-slate-300 hover:bg-[#13233a] border border-white/5'
              }`}
            >
              Avatar KANAN (Genap)
            </button>

            {generatedCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterType('withImage')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  filterType === 'withImage'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Imej Terjana ({generatedCount})</span>
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari slaid / soalan / skrip..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-white/10 bg-[#091322] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#06B6D4] focus:outline-none"
            />
          </div>
        </div>

        {/* Slides Count Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
          <div className="flex items-center gap-3">
            <span>
              MEMAPARKAN <strong className="text-white">{filteredSlides.length}</strong> DARIPADA <strong className="text-white">45</strong> SLAID
            </span>
            {generatedCount > 0 && (
              <span className="text-amber-400 font-bold">
                • {generatedCount} / 45 Imej Nano Banana 2 Terjana
              </span>
            )}
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#06B6D4] font-semibold hover:underline font-sans"
            >
              Kosongkan Carian
            </button>
          )}
        </div>

        {/* Slides Grid List */}
        <div className="space-y-6">
          {filteredSlides.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-[#0B1729] space-y-3">
              <Info className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-200">
                Tiada slaid yang sepadan dengan carian "{searchQuery}"
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#06B6D4] text-[#091322]"
              >
                Tunjukkan Semua Slaid
              </button>
            </div>
          ) : (
            filteredSlides.map((slide) => (
              <SlideCard
                key={slide.slideNumber}
                slide={slide}
                config={config}
                onOpenTeleprompter={(s) => setTeleprompterSlide(s)}
                onUpdateSlideImage={handleUpdateSlideImage}
              />
            ))
          )}
        </div>
      </main>

      {/* Mandatory First-Step Setup Modal */}
      <MandatorySetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        config={config}
        onSaveAndGenerate={handleSaveAndGenerate}
        isInitial={false}
      />

      {/* Interactive MCQ Mind-Check Quiz Modal */}
      <MCQQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        mcqSlides={mcqSlides}
      />

      {/* Export Master Prompts Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        slides={slides}
        config={config}
      />

      {/* 30-Second Teleprompter Modal */}
      <TeleprompterModal
        isOpen={!!teleprompterSlide}
        onClose={() => setTeleprompterSlide(null)}
        slide={teleprompterSlide}
        config={config}
      />
    </div>
  );
}
