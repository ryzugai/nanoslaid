import React, { useState } from 'react';
import { SlideData, SetupConfig } from '../types';
import { exportSlidesToPptx } from '../utils/pptxExporter';
import {
  Download,
  Copy,
  Check,
  FileText,
  Code,
  Table,
  Presentation,
  Sparkles,
  Layers,
  Award,
  ShieldCheck,
  Loader2,
  FileSpreadsheet
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideData[];
  config: SetupConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  slides,
  config,
}) => {
  const [format, setFormat] = useState<'pptx' | 'txt' | 'md' | 'json' | 'csv'>('pptx');
  const [copied, setCopied] = useState(false);
  const [pptxScope, setPptxScope] = useState<'all' | 'infographic' | 'mcq' | 'generatedOnly'>('all');
  const [includeNotes, setIncludeNotes] = useState(true);
  const [isExportingPptx, setIsExportingPptx] = useState(false);
  const [pptxProgress, setPptxProgress] = useState<{ current: number; total: number; message: string } | null>(null);
  const [pptxSuccess, setPptxSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredPptxSlides = slides.filter((s) => {
    if (pptxScope === 'infographic') return !s.isMcq;
    if (pptxScope === 'mcq') return s.isMcq;
    if (pptxScope === 'generatedOnly') return !!s.generatedImageUrl;
    return true;
  });

  const handleExportPptx = async () => {
    if (filteredPptxSlides.length === 0) return;
    setIsExportingPptx(true);
    setPptxSuccess(false);
    setPptxProgress({
      current: 0,
      total: filteredPptxSlides.length,
      message: 'Menyediakan slaid pembentangan PowerPoint...',
    });

    try {
      await exportSlidesToPptx({
        slides: filteredPptxSlides,
        config,
        includeNotes,
        onProgress: (current, total, message) => {
          setPptxProgress({ current, total, message });
        },
      });
      setPptxSuccess(true);
      setTimeout(() => setPptxSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error exporting PPTX:', err);
      alert('Ralat semasa menjana fail PPTX: ' + (err.message || 'Sila cuba lagi.'));
    } finally {
      setIsExportingPptx(false);
      setPptxProgress(null);
    }
  };

  const generateTxtExport = (): string => {
    let output = `========================================================================
PENJANA PROMPT 45 SLAID & VIDEO VEO RASMI
Topik: ${config.topic}
Skim Warna: Skim #${config.colorSchemeId} (${slides[0]?.colorSchemeName || 'Corporate'})
Bahasa Output: ${config.outputLanguage}
Gaya Watak: ${config.presenterStyle}
Nametag: ${config.useNametag ? config.nametagText.toUpperCase() : 'Tiada'}
Jumlah Slaid: 45 (30 Infografik Utama + 15 Soalan MCQ)
========================================================================\n\n`;

    slides.forEach((slide) => {
      output += `${slide.fullFormattedBlock}\n\n------------------------------------------------------------------------\n\n`;
    });

    return output;
  };

  const generateMarkdownExport = (): string => {
    let output = `# ${config.topic}\n\n`;
    output += `> **Konfigurasi Rasmi**:\n`;
    output += `> - Skim Warna: ${slides[0]?.colorSchemeName}\n`;
    output += `> - Bahasa: ${config.outputLanguage}\n`;
    output += `> - Gaya Watak: ${config.presenterStyle}\n`;
    output += `> - Nametag: ${config.useNametag ? config.nametagText : 'Tiada'}\n\n`;

    slides.forEach((s) => {
      output += `## SLAID ${s.slideNumber}: ${s.title}\n`;
      output += `- **Kedudukan Watak**: ${s.characterPosition}\n`;
      output += `- **Skim Warna Pilihan**: ${s.colorSchemeName}\n`;
      output += `- **Saiz Gambar & Etnik**: Saiz ${s.imageSize} | Rakyat Malaysia Etnik ${s.ethnicity}\n`;
      output += `- **Tipografi**: ${s.typography}\n\n`;
      output += `### 1. [Teks Prompt Imej Slaid (Nano Banana 2)]\n\`\`\`text\n${s.promptNanoBanana2}\n\`\`\`\n\n`;
      output += `### 2. [Teks Prompt Animasi Slaid 10 Saat (Veo - Versi 1)]\n\`\`\`text\n${s.promptVeo10s}\n\`\`\`\n\n`;
      output += `### 3. [Teks Prompt Animasi Slaid 5 Saat (Veo - Versi 2)]\n\`\`\`text\n${s.promptVeo5s}\n\`\`\`\n\n`;
      output += `### 4. [Ayat Dialog Penerangan Avatar (Untuk 30 Saat)]\n> "${s.scriptAvatar30s}"\n\n---\n\n`;
    });

    return output;
  };

  const generateJsonExport = (): string => {
    return JSON.stringify(
      {
        metadata: {
          topic: config.topic,
          colorScheme: slides[0]?.colorSchemeName,
          language: config.outputLanguage,
          presenterStyle: config.presenterStyle,
          nametag: config.useNametag ? config.nametagText : null,
          totalSlides: slides.length,
          generatedAt: new Date().toISOString(),
        },
        slides,
      },
      null,
      2
    );
  };

  const generateCsvExport = (): string => {
    const headers = [
      'Slide Number',
      'Type',
      'Title',
      'Character Position',
      'Color Scheme',
      'Image Size',
      'Malaysian Ethnicity',
      'Nano Banana 2 Prompt',
      'Veo 10s Prompt',
      'Veo 5s Prompt',
      '30s Avatar Script',
    ];

    const rows = slides.map((s) => [
      s.slideNumber,
      s.isMcq ? 'MCQ Question' : 'Infographic',
      `"${s.title.replace(/"/g, '""')}"`,
      s.characterPosition,
      `"${s.colorSchemeName.replace(/"/g, '""')}"`,
      s.imageSize,
      s.ethnicity,
      `"${s.promptNanoBanana2.replace(/"/g, '""')}"`,
      `"${s.promptVeo10s.replace(/"/g, '""')}"`,
      `"${s.promptVeo5s.replace(/"/g, '""')}"`,
      `"${s.scriptAvatar30s.replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const getContent = () => {
    if (format === 'md') return generateMarkdownExport();
    if (format === 'json') return generateJsonExport();
    if (format === 'csv') return generateCsvExport();
    return generateTxtExport();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    if (format === 'pptx') {
      handleExportPptx();
      return;
    }

    const content = getContent();
    const extensions = { txt: 'txt', md: 'md', json: 'json', csv: 'csv' };
    const mimeTypes = {
      txt: 'text/plain',
      md: 'text/markdown',
      json: 'application/json',
      csv: 'text/csv',
    };

    const blob = new Blob([content], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const cleanTopic = config.topic.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30);
    a.href = url;
    a.download = `45_slaid_${cleanTopic}_${format}.${extensions[format]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B1729] border border-white/10 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150 text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#091322] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#06B6D4] to-[#34D399] text-[#091322] flex items-center justify-center shadow-md font-bold shrink-0">
              <Download className="w-5 h-5 text-[#091322]" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#06B6D4] uppercase tracking-wider flex items-center gap-1.5">
                <Presentation className="w-3.5 h-3.5" />
                EKSPORT MASTER SEMUA 45 SLAID
              </div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Muat Turun PowerPoint (.PPTX) &amp; Fail Data
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 bg-[#091322] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
            {/* PPTX BUTTON (PROMINENT FIRST TAB) */}
            <button
              type="button"
              onClick={() => setFormat('pptx')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                format === 'pptx'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md ring-1 ring-orange-300'
                  : 'text-amber-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span>PowerPoint (.PPTX)</span>
              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded-full bg-black/30 font-mono text-slate-900 font-black ml-0.5">
                Gambar Slaid
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('txt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                format === 'txt'
                  ? 'bg-[#06B6D4] text-[#091322] shadow-xs'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Teks (.txt)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('md')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                format === 'md'
                  ? 'bg-[#06B6D4] text-[#091322] shadow-xs'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown (.md)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                format === 'json'
                  ? 'bg-[#06B6D4] text-[#091322] shadow-xs'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>JSON (.json)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                format === 'csv'
                  ? 'bg-[#06B6D4] text-[#091322] shadow-xs'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>CSV Spreadsheet</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {format !== 'pptx' && (
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#0B1729] border border-white/10 text-white hover:bg-white/10 flex items-center gap-1.5 shadow-xs font-sans"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#34D399]" />
                    <span className="text-[#34D399]">Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>Salin Semua Teks</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleDownload}
              disabled={isExportingPptx}
              className={`px-4 py-2 text-xs font-black rounded-xl flex items-center gap-2 shadow-lg transition-all ${
                format === 'pptx'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-orange-500/20'
                  : 'bg-gradient-to-r from-[#06B6D4] to-[#34D399] text-[#091322] hover:opacity-90'
              }`}
            >
              {isExportingPptx ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Sedang Menjana PPTX...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>
                    {format === 'pptx' ? 'Muat Turun Fail .PPTX' : 'Muat Turun Fail'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Viewer / PPTX Interactive Studio View */}
        {format === 'pptx' ? (
          <div className="p-6 overflow-y-auto flex-1 bg-[#070F1E] space-y-6">
            
            {/* PPTX Feature Showcase Card */}
            <div className="p-6 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-950/30 via-[#0B1729] to-[#070F1E] shadow-xl relative overflow-hidden space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                      <Presentation className="w-3 h-3 text-orange-400" />
                      Eksport PowerPoint 16:9 HD Widescreen
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Resolusi Penuh 1920x1080
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-white">
                    Eksport Semua Gambar Slaid Terjana ke .PPTX
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    Semua visual slaid beresolusi tinggi (termasuk watak presenter 3D, infografik tersusun, dan soalan kuiz MCQ) dimasukkan terus ke dalam slaid PowerPoint bersaiz 16:9 standard bersama <strong>Skrip Avatar 30 Saat &amp; Prompt Veo di bahagian Presenter Notes</strong> bagi setiap slaid.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportPptx}
                  disabled={isExportingPptx}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  {isExportingPptx ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sedang Eksport ({pptxProgress?.current || 0}/{pptxProgress?.total || filteredPptxSlides.length})...</span>
                    </>
                  ) : (
                    <>
                      <Presentation className="w-5 h-5" />
                      <span>Eksport {filteredPptxSlides.length} Slaid (.PPTX)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live Progress Bar if Exporting */}
              {isExportingPptx && pptxProgress && (
                <div className="p-4 rounded-xl bg-black/60 border border-orange-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-orange-300 font-bold flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                      {pptxProgress.message}
                    </span>
                    <span className="text-slate-300">
                      {Math.round((pptxProgress.current / pptxProgress.total) * 100)}% ({pptxProgress.current}/{pptxProgress.total})
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-150 rounded-full"
                      style={{ width: `${(pptxProgress.current / pptxProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {pptxSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center gap-2.5 text-xs text-emerald-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Fail <strong>.pptx</strong> berjaya dijana dan dimuat turun ke komputer anda!</span>
                </div>
              )}
            </div>

            {/* PPTX Export Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option 1: Scope Selection */}
              <div className="p-5 rounded-2xl bg-[#091322] border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-200">
                    Pilihan Slaid Untuk Dieksport
                  </h5>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPptxScope('all')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      pptxScope === 'all'
                        ? 'border-cyan-400 bg-cyan-500/15 text-white ring-1 ring-cyan-400'
                        : 'border-white/10 bg-black/20 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Semua Slaid</div>
                    <div className="text-[11px] font-mono text-cyan-400">45 Slaid (30 + 15)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPptxScope('infographic')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      pptxScope === 'infographic'
                        ? 'border-cyan-400 bg-cyan-500/15 text-white ring-1 ring-cyan-400'
                        : 'border-white/10 bg-black/20 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Infografik Sahaja</div>
                    <div className="text-[11px] font-mono text-cyan-400">30 Slaid Utama</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPptxScope('mcq')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      pptxScope === 'mcq'
                        ? 'border-amber-400 bg-amber-500/15 text-white ring-1 ring-amber-400'
                        : 'border-white/10 bg-black/20 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Kuiz MCQ Sahaja</div>
                    <div className="text-[11px] font-mono text-amber-400">15 Soalan Uji Minda</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPptxScope('generatedOnly')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      pptxScope === 'generatedOnly'
                        ? 'border-emerald-400 bg-emerald-500/15 text-white ring-1 ring-emerald-400'
                        : 'border-white/10 bg-black/20 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">Imej Terjana Sahaja</div>
                    <div className="text-[11px] font-mono text-emerald-400">
                      {slides.filter((s) => !!s.generatedImageUrl).length} Slaid Sedia Ada
                    </div>
                  </button>
                </div>
              </div>

              {/* Option 2: Presenter Notes & Structure */}
              <div className="p-5 rounded-2xl bg-[#091322] border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-200">
                    Ciri-Ciri Slaid PowerPoint (.PPTX)
                  </h5>
                </div>

                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                    <input
                      type="checkbox"
                      checked={includeNotes}
                      onChange={(e) => setIncludeNotes(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-orange-500 focus:ring-orange-400 bg-slate-900 border-slate-700"
                    />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">
                        Sertakan Skrip Dialog 30s &amp; Prompts dalam Presenter Notes
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Memasukkan ayat penerangan avatar dan teks prompt video Veo ke dalam kotak nota rasmi PowerPoint (Presenter Notes).
                      </p>
                    </div>
                  </label>

                  <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Nisbah Aspek:</span>
                      <strong className="text-white font-mono">16:9 Widescreen (Standard)</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Keserasian:</span>
                      <strong className="text-white font-mono">Microsoft PowerPoint, Google Slides, Keynote</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Kualiti Gambar:</span>
                      <strong className="text-emerald-400 font-mono">1080p Crystal Clear PNG</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Text, Markdown, JSON, CSV View */
          <div className="p-6 overflow-y-auto flex-1 bg-[#091322] text-slate-200 font-mono text-xs leading-relaxed select-all border-t border-white/5">
            <pre className="whitespace-pre-wrap">{getContent()}</pre>
          </div>
        )}

      </div>
    </div>
  );
};

