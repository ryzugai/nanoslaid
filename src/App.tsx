import React, { useState, useMemo } from 'react';
import { SetupConfig, SlideData, DraftSlideItem } from './types';
import { generateCurated45Slides, generateDraftCurriculum } from './utils/slideGenerator';
import { OFFICIAL_COLOR_SCHEMES } from './data/colorSchemes';
import { Header } from './components/Header';
import { SlideCard } from './components/SlideCard';
import { MainSetupSection } from './components/MainSetupSection';
import { MCQQuizModal } from './components/MCQQuizModal';
import { ExportModal } from './components/ExportModal';
import { TeleprompterModal } from './components/TeleprompterModal';
import { DraftReviewModal } from './components/DraftReviewModal';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  FileDown,
  Trash2,
  AlertCircle,
  FileText,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Clean initial configuration
  const [config, setConfig] = useState<SetupConfig>({
    topic: '',
    referenceText: '',
    useNametag: true,
    nametagText: 'DR. AIMAN',
    colorSchemeId: 1, // Corporate Blue Luxury
    outputLanguage: 'Bahasa Melayu Baku Malaysia',
    presenterStyle: 'Pixar 3D Style',
    characterSheet: {
      fileName: 'default_character.png',
      imageUrl: '',
      characterName: 'DR. AIMAN',
      specs: 'Lelaki berumur 32 tahun, berwajah kemas profesional, berambut pendek rapi, memakai cermin mata nipis moden, sut korporat biru navy kemas dengan kemeja putih',
      customCostume: 'Sut Korporat Navy Blue',
      gender: 'Lelaki',
    }
  });

  // Slide generation & draft state
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [draftSlides, setDraftSlides] = useState<DraftSlideItem[]>([]);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Single settings panel toggle state on main page
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  // Modals for Export, Quiz, Teleprompter
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [teleprompterSlide, setTeleprompterSlide] = useState<SlideData | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'infographic' | 'mcq' | 'left' | 'right' | 'withImage'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  // Step 1: Generate Draft Curriculum from User Keywords / PPT
  const handleStartDraftReview = (activeConfig: SetupConfig = config) => {
    if (!activeConfig.topic.trim() && !activeConfig.uploadedPpt && !activeConfig.referenceText.trim()) {
      setGenerationError('Sila muat naik fail PowerPoint (.PPTX) atau masukkan tajuk / isi kandungan slaid.');
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const drafts = generateDraftCurriculum(activeConfig);
        setDraftSlides(drafts);
        setConfig(activeConfig);
        setIsDraftModalOpen(true);
      } catch (err) {
        console.error(err);
        setGenerationError('Ralat semasa mengekstrak draf kandungan. Sila cuba lagi.');
      } finally {
        setIsGenerating(false);
      }
    }, 200);
  };

  // Step 2: User Approves Draft -> Generate Full Prompts
  const handleApproveDraft = (approvedDrafts: DraftSlideItem[]) => {
    setIsGenerating(true);
    setDraftSlides(approvedDrafts);

    setTimeout(() => {
      try {
        const generated = generateCurated45Slides(config, approvedDrafts);
        setSlides(generated);
        setIsDraftModalOpen(false);
        setShowSettingsPanel(false);
      } catch (err) {
        console.error(err);
        setGenerationError('Ralat semasa menjana teks prompt penuh.');
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  };

  // Reset to Empty Slate
  const handleResetToEmpty = () => {
    if (slides.length > 0 && !window.confirm('Adakah anda pasti ingin mengosongkan semua slaid dan memulakan muat naik baharu?')) {
      return;
    }
    setSlides([]);
    setDraftSlides([]);
    setIsDraftModalOpen(false);
    setShowSettingsPanel(false);
    setConfig({
      topic: '',
      referenceText: '',
      useNametag: true,
      nametagText: 'DR. AIMAN',
      colorSchemeId: 1,
      outputLanguage: 'Bahasa Melayu Baku Malaysia',
      presenterStyle: 'Pixar 3D Style',
      uploadedPpt: undefined,
      characterSheet: {
        fileName: 'default_character.png',
        imageUrl: '',
        characterName: 'DR. AIMAN',
        specs: 'Lelaki berumur 32 tahun, berwajah kemas profesional, berambut pendek rapi, memakai cermin mata nipis moden, sut korporat biru navy kemas dengan kemeja putih',
        customCostume: 'Sut Korporat Navy Blue',
        gender: 'Lelaki',
      }
    });
    setGenerationError(null);
  };


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

  const handleCopyAll = async () => {
    if (slides.length === 0) return;

    let fullOutput = `========================================================================
PENJANA PROMPT 45 SLAID & VIDEO VEO RASMI
TOPIK: ${config.topic || (config.uploadedPpt ? config.uploadedPpt.fileName : 'Pembentangan Slaid')}
SKIM WARNA: #${config.colorSchemeId} (${OFFICIAL_COLOR_SCHEMES.find((s) => s.id === config.colorSchemeId)?.name || 'Default'})
WATAK PRESENTER: ${config.characterSheet?.characterName || config.nametagText || 'DR. AIMAN'}
BAHASA: ${config.outputLanguage || 'Bahasa Melayu Baku Malaysia'}
JUMLAH: ${slides.length} Slaid (30 Infografik + 15 Soalan MCQ)
========================================================================\n\n`;

    slides.forEach((s) => {
      fullOutput += `------------------------------------------------------------------------
SLAID ${s.slideNumber}: ${s.title.toUpperCase()}
Kategori: ${s.isMcq ? 'Soalan Uji Minda MCQ' : 'Infografik Strategik'}
Posisi Watak: ${s.characterPosition} (${s.imageSize}) | Etnik: ${s.ethnicity}
------------------------------------------------------------------------

[1. TEKS IMEJ PROMPT (NANO BANANA 2 / AI GENERATOR)]
${s.promptNanoBanana2}

[2. PROMPT ANIMASI VIDEO VEO 10 SAAT]
${s.promptVeo10s}

[3. PROMPT VIDEO VEO FAST 5 SAAT]
${s.promptVeo5s}

[4. SKRIP AVATAR 30 SAAT (${config.outputLanguage === 'English' ? 'ENGLISH' : 'BAHASA MELAYU'})]
"${s.scriptAvatar30s}"

`;
      if (s.isMcq && s.mcqDetails) {
        fullOutput += `[5. BUTIRAN SOALAN KUIZ MCQ]
Soalan: ${s.mcqDetails.question}
Pilihan Jawapan:
${s.mcqDetails.options.map((o) => `  ${o.label}. ${o.text}`).join('\n')}
Jawapan Betul: ${s.mcqDetails.correctOption}
Penerangan Ringkas: ${s.mcqDetails.explanation}

`;
      }
    });

    try {
      await navigator.clipboard.writeText(fullOutput);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch (e) {
      console.error('Failed to copy all slides:', e);
    }
  };

  // Filtered Slides
  const filteredSlides = useMemo(() => {
    return slides.filter((slide) => {
      // Type filters
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
        onOpenSetup={() => setShowSettingsPanel(!showSettingsPanel)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenQuiz={() => setIsQuizModalOpen(true)}
        onCopyAll={handleCopyAll}
        copiedAll={copiedAll}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* ========================================================================= */}
        {/* VIEW 1: EMPTY STATE / SINGLE MAIN-PAGE SETUP                              */}
        {/* ========================================================================= */}
        {slides.length === 0 ? (
          <div className="space-y-6">
            
            {/* Hero Banner */}
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0B1729] shadow-2xl relative overflow-hidden text-center space-y-4">
              <div
                className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: currentScheme.accentHexes[0] || '#06B6D4' }}
              />
              <div
                className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: currentScheme.accentHexes[1] || '#3B82F6' }}
              />

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#06B6D4] text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Penjana Prompt Slaid Dinamik • 1 Ketetapan Utama
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Muat Naik Kandungan &amp; Jana Prompt Slaid
              </h2>

              <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Tetapkan kandungan pembentangan, bahasa, watak avatar, dan skim warna di bawah. Sistem akan mengekstrak tajuk dan isi kandungan untuk menjana 30 teks prompt imej (Nano Banana 2), video animasi (Veo), skrip narasi 30 saat, dan soalan kuiz interaktif secara bersepadu.
              </p>

              {generationError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2 max-w-lg mx-auto">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}
            </div>

            {/* Single Unified Setup Section on Main Screen */}
            <MainSetupSection
              config={config}
              onChangeConfig={setConfig}
              onGenerate={handleStartDraftReview}
              isGenerating={isGenerating}
              hasExistingSlides={false}
            />

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: FULL WORKSPACE (When slides are generated)                        */
          /* ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Inline Toggleable Settings Panel on Main Screen */}
            {showSettingsPanel && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-200">
                <MainSetupSection
                  config={config}
                  onChangeConfig={setConfig}
                  onGenerate={handleStartDraftReview}
                  isGenerating={isGenerating}
                  hasExistingSlides={true}
                  onClosePanel={() => setShowSettingsPanel(false)}
                />
              </div>
            )}

            {/* Executive Overview Banner */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0B1729] shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div
                className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: currentScheme.accentHexes[0] || '#06B6D4' }}
              />

              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    SIFAR HALUSINASI • POIN SEBENAR
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {slides.length} Slaid Terjana
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {config.topic || 'Pembentangan Slaid'}
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Skim #{currentScheme.id}: {currentScheme.name}</span>
                  <span>•</span>
                  <span>Avatar: {config.characterSheet?.characterName || config.nametagText}</span>
                  {config.uploadedPpt && (
                    <>
                      <span>•</span>
                      <span className="text-[#34D399]">Fail: {config.uploadedPpt.fileName}</span>
                    </>
                  )}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5 relative z-10">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 flex items-center gap-1.5 transition-all font-mono"
                  title="Semak atau sunting draf teks 45 slaid"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Semak Draf Teks (45 Slaid)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToEmpty}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 flex items-center gap-1.5 transition-all"
                  title="Kosongkan slaid dan muat naik fail baharu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan &amp; Upload Baharu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                    showSettingsPanel
                      ? 'border-[#06B6D4] bg-[#06B6D4]/20 text-[#06B6D4]'
                      : 'border-white/10 bg-[#091322] hover:bg-white/5 text-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>{showSettingsPanel ? 'Tutup Ketetapan' : 'Ubah Ketetapan'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#06B6D4] text-[#091322] hover:bg-[#34D399] flex items-center gap-1.5 shadow-lg shadow-[#06B6D4]/20 transition-all font-mono"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Eksport Semua</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border border-white/10 bg-[#0B1729]">
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === 'all'
                      ? 'bg-[#06B6D4] text-[#091322]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Semua ({slides.length})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('infographic')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === 'infographic'
                      ? 'bg-[#06B6D4] text-[#091322]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Infografik ({slides.filter((s) => !s.isMcq).length})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('mcq')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterType === 'mcq'
                      ? 'bg-amber-400 text-slate-900'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Soalan MCQ ({mcqSlides.length})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('left')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    filterType === 'left'
                      ? 'bg-white/20 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Kiri ({slides.filter((s) => s.characterPosition === 'KIRI').length})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('right')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    filterType === 'right'
                      ? 'bg-white/20 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Kanan ({slides.filter((s) => s.characterPosition === 'KANAN').length})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterType('withImage')}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    filterType === 'withImage'
                      ? 'bg-[#34D399] text-[#091322] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Imej Terjana ({generatedCount})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari tajuk / skrip..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-white/10 bg-[#091322] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4]"
                />
              </div>

            </div>

            {/* Slides Cards Grid */}
            {filteredSlides.length === 0 ? (
              <div className="text-center py-16 p-6 rounded-2xl border border-white/10 bg-[#0B1729] space-y-2">
                <Search className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white">Tiada slaid sepadan ditemui</h4>
                <p className="text-xs text-slate-400">
                  Cuba tukar kata kunci carian atau tetapan penapis anda.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredSlides.map((slide) => (
                  <SlideCard
                    key={slide.slideNumber}
                    slide={slide}
                    config={config}
                    onOpenTeleprompter={(s) => setTeleprompterSlide(s)}
                    onUpdateSlideImage={handleUpdateSlideImage}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Interactive MCQ Quiz Modal */}
      <MCQQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        slides={mcqSlides}
      />

      {/* Batch Prompt Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        slides={slides}
        config={config}
      />

      {/* 30s Audio/Video Teleprompter Modal */}
      <TeleprompterModal
        isOpen={!!teleprompterSlide}
        onClose={() => setTeleprompterSlide(null)}
        slide={teleprompterSlide}
        config={config}
      />

      {/* 45-Slide Curriculum Draft Review & Approval Modal */}
      <DraftReviewModal
        isOpen={isDraftModalOpen}
        drafts={draftSlides}
        config={config}
        onApproveAndGenerate={handleApproveDraft}
        onClose={() => setIsDraftModalOpen(false)}
        isGeneratingPrompts={isGenerating}
      />
    </div>
  );
}
