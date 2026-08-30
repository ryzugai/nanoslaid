import React, { useState, useMemo } from 'react';
import { SetupConfig, SlideData, UploadedPptData } from './types';
import { generateCurated45Slides } from './utils/slideGenerator';
import { OFFICIAL_COLOR_SCHEMES } from './data/colorSchemes';
import { Header } from './components/Header';
import { SlideCard } from './components/SlideCard';
import { MandatorySetupModal } from './components/MandatorySetupModal';
import { MCQQuizModal } from './components/MCQQuizModal';
import { ExportModal } from './components/ExportModal';
import { TeleprompterModal } from './components/TeleprompterModal';
import { PptUploadSection } from './components/PptUploadSection';
import { CharacterSheetSection } from './components/CharacterSheetSection';
import { ColorSchemePicker } from './components/ColorSchemePicker';
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
  ChevronDown,
  UploadCloud,
  FileSpreadsheet,
  Trash2,
  ArrowRight,
  User,
  Palette,
  Globe2,
  Tv,
  Check,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Clean initial configuration without hardcoded topic or text
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

  // Empty initial state as requested by user
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [teleprompterSlide, setTeleprompterSlide] = useState<SlideData | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'infographic' | 'mcq' | 'left' | 'right' | 'withImage'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  // Trigger Slide Generation from Current Config
  const handleGenerateSlides = (activeConfig: SetupConfig = config) => {
    if (!activeConfig.topic.trim() && !activeConfig.uploadedPpt && !activeConfig.referenceText.trim()) {
      setGenerationError('Sila muat naik fail PowerPoint (.PPTX) atau masukkan tajuk / isi kandungan slaid.');
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const generated = generateCurated45Slides(activeConfig);
        setSlides(generated);
        setConfig(activeConfig);
        setIsSetupModalOpen(false);
      } catch (err) {
        console.error(err);
        setGenerationError('Ralat semasa menjana slaid. Sila cuba lagi.');
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  // Reset to Empty Slate
  const handleResetToEmpty = () => {
    if (slides.length > 0 && !window.confirm('Adakah anda pasti ingin mengosongkan semua slaid dan memulakan muat naik baharu?')) {
      return;
    }
    setSlides([]);
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
Topik: ${config.topic || 'Pembentangan'}
Skim Warna: Skim #${config.colorSchemeId} (${slides[0]?.colorSchemeName || 'Corporate'})
Bahasa: ${config.outputLanguage}
Gaya Watak: ${config.presenterStyle}
Nametag: ${config.useNametag ? config.nametagText.toUpperCase() : 'Tiada'}
Jumlah Slaid: ${slides.length} Slaid Lengkap
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
        
        {/* ========================================================================= */}
        {/* VIEW 1: EMPTY STATE / UPLOAD & GENERATE HUB                                */}
        {/* ========================================================================= */}
        {slides.length === 0 ? (
          <div className="space-y-6">
            
            {/* Hero Card */}
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
                Penjana Prompt Slaid Dinamik • 100% Berasaskan Kandungan Anda
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Muat Naik Slaid Persembahan Anda
              </h2>

              <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Tiada teks prompt default atau isi ciptaan rawak. Muat naik fail PowerPoint (.PPTX / .PPT) atau masukkan teks sukatan anda. Sistem akan mengekstrak setiap tajuk &amp; poin slaid secara tepat untuk menjana 30 teks prompt imej (Nano Banana 2), video animasi (Veo), dan soalan kuiz interaktif.
              </p>

              {generationError && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2 max-w-lg mx-auto">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}
            </div>

            {/* Main Interactive Configuration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: PowerPoint Upload & Content Input (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. PPT File Upload Box */}
                <div className="p-6 rounded-2xl border border-white/10 bg-[#0B1729] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-[#06B6D4]" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        1. Muat Naik Fail PowerPoint (.PPTX / .PPT)
                      </h3>
                    </div>
                    {config.uploadedPpt && (
                      <span className="text-xs font-bold font-mono text-[#34D399] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {config.uploadedPpt.slideCount} Slaid Dikesan
                      </span>
                    )}
                  </div>

                  <PptUploadSection
                    uploadedPpt={config.uploadedPpt}
                    onPptParsed={(pptData, suggestedTopic) => {
                      setConfig((prev) => ({
                        ...prev,
                        uploadedPpt: pptData,
                        topic: suggestedTopic || prev.topic || pptData.extractedSlides[0]?.title || 'Pembentangan Slaid',
                        referenceText: pptData.fullExtractedText
                      }));
                      setGenerationError(null);
                    }}
                    onClearPpt={() => {
                      setConfig((prev) => ({
                        ...prev,
                        uploadedPpt: undefined,
                        topic: '',
                        referenceText: ''
                      }));
                    }}
                  />
                </div>

                {/* 2. Manual Topic & Content Input (Alternative or Supplement) */}
                <div className="p-6 rounded-2xl border border-white/10 bg-[#0B1729] space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <Layers className="w-4 h-4 text-[#06B6D4]" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      2. Tajuk Topik &amp; Kandungan Slaid
                    </h3>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Tajuk Utama Pembentangan
                    </label>
                    <input
                      type="text"
                      value={config.topic}
                      onChange={(e) => {
                        setConfig({ ...config, topic: e.target.value });
                        setGenerationError(null);
                      }}
                      placeholder="Masukkan tajuk pembentangan anda (contoh: Kajian Impak Inovasi Digital 2026)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#091322] text-white text-sm focus:ring-2 focus:ring-[#06B6D4] focus:outline-none placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Teks Nota / Sukatan Kandungan (Pilihan jika tiada fail PPTX)
                    </label>
                    <textarea
                      rows={4}
                      value={config.referenceText}
                      onChange={(e) => setConfig({ ...config, referenceText: e.target.value })}
                      placeholder="Tampal teks rujukan, garis panduan modul, atau senarai tajuk slaid di sini..."
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#091322] text-white text-xs font-mono focus:ring-2 focus:ring-[#06B6D4] focus:outline-none placeholder-slate-500"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: Character Sheet, Color Scheme & Settings (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 3. Character Sheet Upload */}
                <div className="p-6 rounded-2xl border border-white/10 bg-[#0B1729] space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <User className="w-4 h-4 text-[#06B6D4]" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      3. Character Sheet &amp; Avatar
                    </h3>
                  </div>

                  <CharacterSheetSection
                    characterSheet={config.characterSheet}
                    onCharacterSheetChange={(sheet) => setConfig({ ...config, characterSheet: sheet })}
                  />

                  {/* Nametag Setting */}
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.useNametag}
                        onChange={(e) => setConfig({ ...config, useNametag: e.target.checked })}
                        className="rounded border-white/20 bg-[#091322] text-[#06B6D4] focus:ring-[#06B6D4]"
                      />
                      <span className="text-xs font-semibold text-slate-300">
                        Papar Nametag pada Sut Watak
                      </span>
                    </label>

                    {config.useNametag && (
                      <input
                        type="text"
                        value={config.nametagText}
                        onChange={(e) => setConfig({ ...config, nametagText: e.target.value.toUpperCase() })}
                        placeholder="DR. AIMAN"
                        className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-[#091322] text-xs font-mono text-white uppercase focus:ring-2 focus:ring-[#06B6D4] focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                {/* 4. Color Scheme Selection */}
                <div className="p-6 rounded-2xl border border-white/10 bg-[#0B1729] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#06B6D4]" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        4. Skim Warna Slaid
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      Skim #{currentScheme.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#091322] border border-white/10">
                    <div
                      className="w-8 h-8 rounded-lg border border-white/20 shadow-md shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: currentScheme.bgHex }}
                    >
                      <div className="flex gap-0.5">
                        {currentScheme.accentHexes.slice(0, 2).map((hex, i) => (
                          <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: hex }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{currentScheme.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentScheme.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSetupModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold border border-white/10 hover:border-[#06B6D4]/40 bg-[#0B1729] text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-all shrink-0"
                    >
                      Pilih (30)
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Big Launch Button */}
            <div className="p-6 rounded-3xl border border-[#06B6D4]/30 bg-gradient-to-r from-[#06B6D4]/10 via-[#3B82F6]/10 to-[#34D399]/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#06B6D4] to-[#34D399] text-[#091322] flex items-center justify-center shadow-lg font-bold shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Bersedia untuk Menjana Slaid?
                  </h4>
                  <p className="text-xs text-slate-300">
                    {config.uploadedPpt
                      ? `Menjana prompt daripada ${config.uploadedPpt.slideCount} slaid fail '${config.uploadedPpt.fileName}'.`
                      : config.topic.trim()
                      ? `Menjana prompt daripada tajuk '${config.topic.trim()}'.`
                      : 'Sila muat naik fail PowerPoint atau masukkan tajuk slaid di atas.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleGenerateSlides()}
                disabled={isGenerating || (!config.topic.trim() && !config.uploadedPpt && !config.referenceText.trim())}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#06B6D4] to-[#34D399] text-[#091322] font-black text-sm uppercase tracking-wider shadow-xl shadow-[#06B6D4]/20 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#091322]" />
                    <span>Sedang Menjana Prompt...</span>
                  </>
                ) : (
                  <>
                    <span>Jana 30 Teks Prompt Slaid Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: FULL WORKSPACE (When slides are generated)                        */
          /* ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Executive Overview Banner */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0B1729] shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div
                className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: currentScheme.accentHexes[0] || '#06B6D4' }}
              />

              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">
                    KANDUNGAN BERASASKAN INPUT ANDA
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
                  onClick={handleResetToEmpty}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 flex items-center gap-1.5 transition-all"
                  title="Kosongkan slaid dan muat naik fail baharu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan &amp; Upload Baharu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSetupModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-white/10 bg-[#091322] hover:bg-white/5 text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Tetapan Slaid</span>
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
                    onUpdateImage={handleUpdateSlideImage}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Mandatory & General Setup Modal */}
      <MandatorySetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        config={config}
        onSaveAndGenerate={(newConfig) => {
          handleGenerateSlides(newConfig);
        }}
      />

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
    </div>
  );
}
