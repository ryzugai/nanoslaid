import React, { useState, useRef } from 'react';
import { UploadedPptData } from '../types';
import { parsePptxFile, parseGenericSlideFile } from '../utils/pptParser';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface PptUploadSectionProps {
  uploadedPpt?: UploadedPptData;
  onPptParsed: (pptData: UploadedPptData, suggestedTopic?: string) => void;
  onClearPpt: () => void;
}

export const PptUploadSection: React.FC<PptUploadSectionProps> = ({
  uploadedPpt,
  onPptParsed,
  onClearPpt,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSlideList, setShowSlideList] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['ppt', 'pptx', 'txt', 'md', 'json'].includes(ext || '')) {
        throw new Error('Sila muat naik fail persembahan PowerPoint (.pptx / .ppt) atau teks rujukan (.txt / .md).');
      }

      let result;
      if (ext === 'pptx') {
        result = await parsePptxFile(file);
      } else {
        result = await parseGenericSlideFile(file);
      }

      onPptParsed(
        {
          fileName: result.fileName,
          fileSize: result.fileSize,
          slideCount: result.slideCount,
          extractedSlides: result.extractedSlides,
          fullExtractedText: result.fullExtractedText,
        },
        result.suggestedTopic
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Ralat membaca fail persembahan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* If file is already uploaded */}
      {uploadedPpt ? (
        <div className="p-4 rounded-xl border border-[#34D399]/30 bg-[#091322] space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#34D399]/20 border border-[#34D399]/40 text-[#34D399] flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-[#34D399]/20 text-[#34D399]">
                    Slaid PPTX Dimuat Naik
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {uploadedPpt.fileSize}
                  </span>
                </div>
                <div className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                  {uploadedPpt.fileName}
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  {uploadedPpt.slideCount} slaid berjaya diekstrak untuk penjanaan 45 slaid
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSlideList(!showSlideList)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 flex items-center gap-1 border border-white/10"
              >
                <Layers className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>{showSlideList ? 'Sembunyi Slaid' : 'Lihat Slaid'}</span>
                {showSlideList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={onClearPpt}
                className="p-1.5 text-xs rounded-lg text-rose-400 hover:bg-rose-500/20 transition-all"
                title="Padam fail ini"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Collapsible Slide List Preview */}
          {showSlideList && (
            <div className="mt-3 pt-3 border-t border-white/10 max-h-60 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase">
                Struktur Slaid Yang Diekstrak ({uploadedPpt.extractedSlides.length}):
              </div>
              {uploadedPpt.extractedSlides.map((s) => (
                <div
                  key={s.slideNumber}
                  className="p-2.5 rounded-lg bg-[#0B1729] border border-white/5 space-y-1"
                >
                  <div className="font-bold text-[#06B6D4] flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-[#06B6D4]/20 text-center leading-5 text-[10px]">
                      {s.slideNumber}
                    </span>
                    <span className="line-clamp-1">{s.title}</span>
                  </div>
                  {s.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-0.5 pl-1">
                      {s.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="line-clamp-1">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Upload Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#06B6D4] bg-[#06B6D4]/10'
              : 'border-white/15 hover:border-[#06B6D4]/50 bg-[#091322]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".ppt,.pptx,.txt,.md"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#06B6D4]/20 to-[#34D399]/20 border border-[#06B6D4]/30 text-[#06B6D4] flex items-center justify-center shadow-lg">
              {isLoading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="text-sm font-bold text-white">
                {isLoading ? 'Sedang Memproses Slaid...' : 'Muat Naik Slaid Persembahan (.pptx / .ppt)'}
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Tarik &amp; lepas fail Microsoft PowerPoint (.pptx / .ppt) atau klik di sini untuk memuat naik. Sistem akan membaca kandungan tajuk dan point slaid secara automatik.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">.PPTX</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">.PPT</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">.TXT / .MD</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
