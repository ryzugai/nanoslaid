import React from 'react';
import { SetupConfig, SlideData } from '../types';
import { OFFICIAL_COLOR_SCHEMES } from '../data/colorSchemes';
import {
  Sparkles,
  SlidersHorizontal,
  Download,
  Award,
  Copy,
  Check,
  CheckCircle2,
  Tv,
  UserCheck,
  FileSpreadsheet,
  User,
  UploadCloud
} from 'lucide-react';

interface HeaderProps {
  config: SetupConfig;
  slidesCount: number;
  onOpenSetup: () => void;
  onOpenExport: () => void;
  onOpenQuiz: () => void;
  onCopyAll: () => void;
  copiedAll: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  slidesCount,
  onOpenSetup,
  onOpenExport,
  onOpenQuiz,
  onCopyAll,
  copiedAll,
}) => {
  const currentScheme = OFFICIAL_COLOR_SCHEMES.find((s) => s.id === config.colorSchemeId) || OFFICIAL_COLOR_SCHEMES[0];

  return (
    <header className="sticky top-0 z-40 bg-[#091322]/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Brand & Studio Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4] to-[#34D399] text-[#091322] flex items-center justify-center shadow-md shadow-[#06B6D4]/20 shrink-0 font-bold">
            <Sparkles className="w-5 h-5 text-[#091322]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                Pakar Penjana 45 Slaid &amp; Video Veo
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/30">
                Nano Banana 2 • Veo
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">
              30 Slaid Infografik + 15 Soalan MCQ • Skrip Avatar 30 Saat • PPTX &amp; Character Sheet
            </p>
          </div>
        </div>

        {/* Quick Config Indicators & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* PPT Upload Status Pill */}
          {config.uploadedPpt ? (
            <button
              type="button"
              onClick={onOpenSetup}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#34D399]/40 bg-[#34D399]/10 text-xs font-semibold text-[#34D399] transition-all hover:bg-[#34D399]/20"
              title="Slaid PPTX Aktif"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">PPTX: {config.uploadedPpt.slideCount} Slaid</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenSetup}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-white/10 bg-[#0B1729] hover:border-[#06B6D4]/40 text-xs font-semibold text-slate-300 transition-all"
              title="Muat naik fail PPTX"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="hidden sm:inline">Upload .PPTX</span>
            </button>
          )}

          {/* Character Sheet Pill */}
          <button
            type="button"
            onClick={onOpenSetup}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#06B6D4]/40 bg-[#06B6D4]/10 text-xs font-semibold text-[#06B6D4] transition-all hover:bg-[#06B6D4]/20"
            title="Character Sheet Watak Avatar"
          >
            <User className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">
              {config.characterSheet?.characterName || config.nametagText || 'DR. AIMAN'}
            </span>
          </button>

          {/* Active Color Scheme */}
          <button
            type="button"
            onClick={onOpenSetup}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/10 bg-[#0B1729] hover:border-[#06B6D4]/40 text-xs font-semibold transition-all group"
            title="Tukar Skim Warna"
          >
            <div
              className="w-3 h-3 rounded-full border border-white/20 shadow-xs shrink-0"
              style={{ backgroundColor: currentScheme.bgHex }}
            />
            <span className="text-slate-200 line-clamp-1 max-w-[100px] text-[11px]">
              Skim #{currentScheme.id}
            </span>
            <SlidersHorizontal className="w-3 h-3 text-slate-400 group-hover:text-[#06B6D4]" />
          </button>

          {/* MCQ Quiz Mode Button */}
          <button
            type="button"
            onClick={onOpenQuiz}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 flex items-center gap-1.5 transition-all"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Kuiz MCQ</span>
          </button>

          {/* Copy All 45 Slides Button */}
          <button
            type="button"
            onClick={onCopyAll}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 bg-[#0B1729] text-slate-200 hover:bg-[#12233c] hover:border-white/20 flex items-center gap-1.5 transition-all"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="text-[#34D399] hidden sm:inline">Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Salin Semua</span>
              </>
            )}
          </button>

          {/* Master Export Button */}
          <button
            type="button"
            onClick={onOpenExport}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#06B6D4] to-[#0284C7] hover:opacity-90 text-white flex items-center gap-1.5 shadow-md shadow-[#06B6D4]/20 transition-all border border-[#06B6D4]/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Eksport</span>
          </button>
        </div>
      </div>
    </header>
  );
};
