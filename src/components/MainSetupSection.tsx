import React, { useState } from 'react';
import { SetupConfig, UploadedPptData } from '../types';
import { OFFICIAL_COLOR_SCHEMES } from '../data/colorSchemes';
import { ColorSchemePicker } from './ColorSchemePicker';
import {
  FileSpreadsheet,
  UploadCloud,
  FileText,
  Sparkles,
  User,
  Palette,
  Globe2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { parsePptxFile, parseGenericSlideFile } from '../utils/pptParser';

interface MainSetupSectionProps {
  config: SetupConfig;
  onChangeConfig: (newConfig: SetupConfig) => void;
  onGenerate: (overrideConfig?: SetupConfig) => void;
  isGenerating: boolean;
  hasExistingSlides: boolean;
  onClosePanel?: () => void;
}

export const MainSetupSection: React.FC<MainSetupSectionProps> = ({
  config,
  onChangeConfig,
  onGenerate,
  isGenerating,
  hasExistingSlides,
  onClosePanel,
}) => {
  const [contentMode, setContentMode] = useState<'ppt' | 'text'>(
    config.uploadedPpt ? 'ppt' : 'text'
  );
  const [isParsingPpt, setIsParsingPpt] = useState(false);
  const [pptError, setPptError] = useState<string | null>(null);
  const [isColorsExpanded, setIsColorsExpanded] = useState(false);

  const currentScheme =
    OFFICIAL_COLOR_SCHEMES.find((s) => s.id === config.colorSchemeId) ||
    OFFICIAL_COLOR_SCHEMES[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingPpt(true);
    setPptError(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let parsedData;
      if (ext === 'pptx') {
        parsedData = await parsePptxFile(file);
      } else {
        parsedData = await parseGenericSlideFile(file);
      }

      const newConfig: SetupConfig = {
        ...config,
        topic: parsedData.suggestedTopic || parsedData.fileName.replace(/\.[^/.]+$/, ''),
        uploadedPpt: parsedData,
      };
      onChangeConfig(newConfig);
      setContentMode('ppt');
    } catch (err: any) {
      console.error('Error parsing PowerPoint:', err);
      setPptError(err.message || 'Gagal membaca fail PowerPoint.');
    } finally {
      setIsParsingPpt(false);
    }
  };

  const handleCharacterSheetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onChangeConfig({
        ...config,
        characterSheet: {
          ...(config.characterSheet || {
            characterName: config.nametagText || 'DR. AIMAN',
            specs: 'Kemas profesional',
            customCostume: 'Sut Korporat',
            gender: 'Lelaki',
          }),
          fileName: file.name,
          imageUrl: base64,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const isReadyToGenerate =
    !!config.uploadedPpt ||
    !!config.topic.trim() ||
    !!config.referenceText.trim();

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-white/15 bg-[#0B1729] shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Ambient Lights */}
      <div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: currentScheme.accentHexes[0] || '#06B6D4' }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: currentScheme.accentHexes[1] || '#3B82F6' }}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#06B6D4] to-[#34D399] text-[#091322] flex items-center justify-center shadow-lg font-bold shrink-0">
            <SlidersHorizontal className="w-5 h-5 text-[#091322]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Ketetapan Utama Slaid &amp; Prompt
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/30">
                1 Ketetapan Bersepadu
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Konfigurasi kandungan, bahasa, watak avatar, dan 30 skim warna di muka utama.
            </p>
          </div>
        </div>

        {hasExistingSlides && onClosePanel && (
          <button
            type="button"
            onClick={onClosePanel}
            className="self-end sm:self-center px-3 py-1.5 rounded-xl border border-white/10 bg-[#091322] hover:bg-white/5 text-xs text-slate-300 transition-all"
          >
            Tutup Panel
          </button>
        )}
      </div>

      {/* 2-Column Grid: Kandungan & Watak / Skim */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================================= */}
        {/* COLUMN 1: KANDUNGAN & BAHASA (7 Cols)                                     */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Bahasa Output Toggle */}
          <div className="p-4 rounded-2xl border border-white/10 bg-[#091322] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase font-mono">
                <Globe2 className="w-4 h-4 text-[#06B6D4]" />
                <span>Bahasa Output Teks &amp; Skrip</span>
              </div>
              <span className="text-[11px] text-slate-400">Pilih 1 bahasa konsisten</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() =>
                  onChangeConfig({
                    ...config,
                    outputLanguage: 'Bahasa Melayu Baku Malaysia',
                  })
                }
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  config.outputLanguage === 'Bahasa Melayu Baku Malaysia'
                    ? 'border-[#06B6D4] bg-[#06B6D4]/10 text-white shadow-xs'
                    : 'border-white/10 bg-[#0B1729] text-slate-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">Bahasa Melayu Baku</div>
                  <div className="text-[10px] opacity-75">Teks, Soalan &amp; Skrip ms-MY</div>
                </div>
                {config.outputLanguage === 'Bahasa Melayu Baku Malaysia' && (
                  <Check className="w-4 h-4 text-[#06B6D4]" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  onChangeConfig({
                    ...config,
                    outputLanguage: 'English',
                  })
                }
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  config.outputLanguage === 'English'
                    ? 'border-[#06B6D4] bg-[#06B6D4]/10 text-white shadow-xs'
                    : 'border-white/10 bg-[#0B1729] text-slate-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">English (US/UK)</div>
                  <div className="text-[10px] opacity-75">Text, Quizzes &amp; Scripts en-US</div>
                </div>
                {config.outputLanguage === 'English' && (
                  <Check className="w-4 h-4 text-[#06B6D4]" />
                )}
              </button>
            </div>
          </div>

          {/* Kandungan Slaid: PPT vs Teks */}
          <div className="p-5 rounded-2xl border border-white/10 bg-[#091322] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase font-mono">
                <FileSpreadsheet className="w-4 h-4 text-[#06B6D4]" />
                <span>Kandungan Slaid Pembentangan</span>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#0B1729] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setContentMode('ppt')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    contentMode === 'ppt'
                      ? 'bg-[#06B6D4] text-[#091322]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  PowerPoint (.PPTX)
                </button>
                <button
                  type="button"
                  onClick={() => setContentMode('text')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    contentMode === 'text'
                      ? 'bg-[#06B6D4] text-[#091322]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Teks / Tajuk Manual
                </button>
              </div>
            </div>

            {contentMode === 'ppt' ? (
              <div className="space-y-3">
                <label className="border-2 border-dashed border-white/15 hover:border-[#06B6D4]/50 bg-[#0B1729] rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">
                      Klik atau heret fail .PPTX / .PPT di sini
                    </span>
                    <span className="text-xs text-slate-400">
                      Mengekstrak tajuk, poin, dan struktur persembahan secara automatik.
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pptx,.ppt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {isParsingPpt && (
                  <div className="p-3 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-xs text-[#06B6D4] flex items-center gap-2 font-mono">
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                    <span>Sedang mengekstrak kandungan PowerPoint...</span>
                  </div>
                )}

                {pptError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                    {pptError}
                  </div>
                )}

                {config.uploadedPpt && (
                  <div className="p-3.5 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white font-mono">
                          {config.uploadedPpt.fileName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {config.uploadedPpt.slideCount} slaid dikesan &amp; diekstrak
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onChangeConfig({
                          ...config,
                          uploadedPpt: undefined,
                        })
                      }
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Batal Fail
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Tajuk Utama / Modul Pembentangan:
                  </label>
                  <input
                    type="text"
                    value={config.topic}
                    onChange={(e) =>
                      onChangeConfig({ ...config, topic: e.target.value })
                    }
                    placeholder="Contoh: Strategi Transformasi Digital & Pengurusan Data 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#0B1729] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Teks Rujukan / Sukatan / Nota Pembentangan:
                  </label>
                  <textarea
                    rows={4}
                    value={config.referenceText}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        referenceText: e.target.value,
                      })
                    }
                    placeholder="Masukkan poin penting, subtopik, kajian kes, atau nota pembentangan di sini..."
                    className="w-full p-3.5 rounded-xl border border-white/10 bg-[#0B1729] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* COLUMN 2: WATAK AVATAR & SKIM WARNA (5 Cols)                             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Character Avatar Settings */}
          <div className="p-5 rounded-2xl border border-white/10 bg-[#091322] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase font-mono">
                <User className="w-4 h-4 text-[#06B6D4]" />
                <span>Persona Watak &amp; Avatar</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Untuk AI Prompt</span>
            </div>

            {/* Character Sheet Upload & Preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {config.characterSheet?.imageUrl ? (
                  <div className="w-16 h-16 rounded-xl border border-[#06B6D4]/40 overflow-hidden bg-[#0B1729] shrink-0 relative group">
                    <img
                      src={config.characterSheet.imageUrl}
                      alt="Character Sheet"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-white/10 bg-[#0B1729] flex items-center justify-center text-slate-500 shrink-0">
                    <User className="w-7 h-7" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <label className="px-3 py-1.5 rounded-xl border border-white/15 hover:border-[#06B6D4]/50 bg-[#0B1729] text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer w-fit transition-all">
                    <ImageIcon className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>
                      {config.characterSheet?.imageUrl
                        ? 'Tukar Character Sheet'
                        : 'Upload Character Sheet'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCharacterSheetUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 block mt-1 truncate">
                    {config.characterSheet?.fileName || 'Fail imej watak rujukan'}
                  </span>
                </div>
              </div>

              {/* Character Name & Nametag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Nama Watak / Gelaran:
                  </label>
                  <input
                    type="text"
                    value={config.characterSheet?.characterName || config.nametagText || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChangeConfig({
                        ...config,
                        nametagText: val,
                        characterSheet: {
                          ...(config.characterSheet || {
                            specs: 'Kemas profesional',
                            customCostume: 'Sut Korporat',
                            gender: 'Lelaki',
                          }),
                          characterName: val,
                        },
                      });
                    }}
                    placeholder="DR. AIMAN"
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0B1729] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Gaya Watak 3D:
                  </label>
                  <select
                    value={config.presenterStyle || 'Pixar 3D Style'}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        presenterStyle: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0B1729] text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                  >
                    <option value="Pixar 3D Style">Pixar 3D Animation Style</option>
                    <option value="3D Realistic Executive">3D Realistic Executive</option>
                    <option value="3D Anime Style">3D Stylized Anime</option>
                  </select>
                </div>
              </div>

              {/* Nametag Checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.useNametag}
                  onChange={(e) =>
                    onChangeConfig({
                      ...config,
                      useNametag: e.target.checked,
                    })
                  }
                  className="rounded border-white/20 bg-[#0B1729] text-[#06B6D4] focus:ring-0"
                />
                <span className="text-xs text-slate-300 font-medium">
                  Papar Nametag Rasmi pada Sut Watak Avatar
                </span>
              </label>
            </div>
          </div>

          {/* Color Scheme Picker */}
          <div className="p-5 rounded-2xl border border-white/10 bg-[#091322] space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase font-mono">
                <Palette className="w-4 h-4 text-[#06B6D4]" />
                <span>Skim Warna Slaid ({OFFICIAL_COLOR_SCHEMES.length} Pilihan)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsColorsExpanded(!isColorsExpanded)}
                className="text-xs font-bold text-[#06B6D4] flex items-center gap-1 hover:underline"
              >
                <span>{isColorsExpanded ? 'Sembunyi' : 'Pilih dari 30 Skim'}</span>
                {isColorsExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Currently Active Scheme Display */}
            <div
              className="p-3.5 rounded-xl border flex items-center justify-between"
              style={{
                backgroundColor: currentScheme.bgHex,
                borderColor: currentScheme.accentHexes[0],
                color: currentScheme.mode === 'Dark Mode' ? '#FFFFFF' : '#0F172A',
              }}
            >
              <div>
                <div className="text-xs font-bold">
                  #{currentScheme.id}: {currentScheme.name}
                </div>
                <div className="text-[11px] opacity-75">{currentScheme.mode} • {currentScheme.category}</div>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/30 backdrop-blur-xs">
                {currentScheme.accentHexes.map((hex, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-md border border-white/30"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* Expandable 30 Schemes Grid */}
            {isColorsExpanded && (
              <div className="pt-2 animate-in fade-in duration-200">
                <ColorSchemePicker
                  selectedId={config.colorSchemeId}
                  onSelect={(id) => {
                    onChangeConfig({ ...config, colorSchemeId: id });
                    setIsColorsExpanded(false);
                  }}
                />
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Action Button: 1 Single Primary Button */}
      <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400 text-center sm:text-left">
          {config.uploadedPpt ? (
            <span>
              Slaid akan dijana berasaskan kandungan fail <strong className="text-white">{config.uploadedPpt.fileName}</strong> ({config.uploadedPpt.slideCount} slaid).
            </span>
          ) : config.topic.trim() ? (
            <span>
              Slaid akan dijana berasaskan tajuk <strong className="text-white">{config.topic.trim()}</strong>.
            </span>
          ) : (
            <span>Sila muat naik fail PowerPoint (.pptx) atau masukkan tajuk persembahan.</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onGenerate()}
          disabled={isGenerating || !isReadyToGenerate}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#06B6D4] to-[#34D399] text-[#091322] font-black text-sm uppercase tracking-wider shadow-xl shadow-[#06B6D4]/20 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#091322]" />
              <span>Sedang Menjana Prompt...</span>
            </>
          ) : (
            <>
              <span>
                {hasExistingSlides
                  ? 'Kemas Kini 30 Teks Prompt Slaid'
                  : 'Jana 30 Teks Prompt Slaid Lengkap'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
