import React, { useState } from 'react';
import { SlideData, SetupConfig } from '../types';
import { Download, Copy, Check, FileText, Code, Table, Printer } from 'lucide-react';

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
  const [format, setFormat] = useState<'txt' | 'md' | 'json' | 'csv'>('txt');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B1729] border border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#091322] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#06B6D4] to-[#34D399] text-[#091322] flex items-center justify-center shadow-md font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#06B6D4] uppercase tracking-wider">
                EKSPORT MASTER SEMUA 45 SLAID
              </div>
              <h3 className="text-base font-bold text-white">
                Muat Turun &amp; Salin Data Prompt
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-4 border-b border-white/10 bg-[#091322] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFormat('txt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                format === 'txt'
                  ? 'bg-[#06B6D4] text-[#091322] shadow-xs'
                  : 'bg-[#0B1729] text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Format Teks (.txt)</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('md')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                format === 'md'
                  ? 'bg-[#06B6D4] text-[#091322] shadow-xs'
                  : 'bg-[#0B1729] text-slate-300 border border-white/10 hover:border-white/20'
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
                  : 'bg-[#0B1729] text-slate-300 border border-white/10 hover:border-white/20'
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
                  : 'bg-[#0B1729] text-slate-300 border border-white/10 hover:border-white/20'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>CSV Spreadsheet</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
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

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#34D399] text-[#091322] hover:opacity-90 flex items-center gap-1.5 shadow-md font-sans"
            >
              <Download className="w-3.5 h-3.5 text-[#091322]" />
              <span>Muat Turun Fail</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#091322] text-slate-200 font-mono text-xs leading-relaxed select-all border-t border-white/5">
          <pre className="whitespace-pre-wrap">{getContent()}</pre>
        </div>
      </div>
    </div>
  );
};
