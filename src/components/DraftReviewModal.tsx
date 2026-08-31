import React, { useState } from 'react';
import { DraftSlideItem, SetupConfig, InfographicArchetype } from '../types';
import { buildInfographicMetaForArchetype } from '../utils/slideGenerator';
import {
  CheckCircle2,
  Edit3,
  Search,
  Sparkles,
  ArrowRight,
  FileText,
  HelpCircle,
  Layers,
  Save,
  X,
  ShieldCheck,
  RotateCcw,
  LayoutGrid,
  GitCommit,
  Columns3,
  Milestone
} from 'lucide-react';

interface DraftReviewModalProps {
  isOpen: boolean;
  drafts: DraftSlideItem[];
  config: SetupConfig;
  onApproveAndGenerate: (approvedDrafts: DraftSlideItem[]) => void;
  onClose: () => void;
  isGeneratingPrompts: boolean;
  onOpenInfographicSelector?: (draft: DraftSlideItem) => void;
}

export const DraftReviewModal: React.FC<DraftReviewModalProps> = ({
  isOpen,
  drafts,
  config,
  onApproveAndGenerate,
  onClose,
  isGeneratingPrompts,
  onOpenInfographicSelector,
}) => {
  const [editableDrafts, setEditableDrafts] = useState<DraftSlideItem[]>(drafts);
  const [activeTab, setActiveTab] = useState<'all' | 'infographic' | 'mcq'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSlideNumber, setEditingSlideNumber] = useState<number | null>(null);


  // Synchronize when incoming drafts change
  React.useEffect(() => {
    setEditableDrafts(drafts);
  }, [drafts]);

  if (!isOpen) return null;

  const isMalay = config.outputLanguage === 'Bahasa Melayu Baku Malaysia';

  const handleQuickChangeArchetype = (slideNumber: number, archetype: InfographicArchetype) => {
    setEditableDrafts((prev) =>
      prev.map((d) => {
        if (d.slideNumber !== slideNumber) return d;
        const newMeta最佳 = buildInfographicMetaForArchetype(archetype, d.title, d.points, isMalay);
        return {
          ...d,
          infographicType: archetype,
          meta: newMeta最佳
        };
      })
    );
  };

  const filteredDrafts = editableDrafts.filter((item) => {
    if (activeTab === 'infographic' && item.isMcq) return false;
    if (activeTab === 'mcq' && !item.isMcq) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.points.some((p) => p.toLowerCase().includes(q)) ||
      `slaid ${item.slideNumber}`.includes(q)
    );
  });

  const handleUpdateDraft = (slideNumber: number, updatedFields: Partial<DraftSlideItem>) => {
    setEditableDrafts((prev) =>
      prev.map((d) => (d.slideNumber === slideNumber ? { ...d, ...updatedFields } : d))
    );
  };

  const handleUpdatePoint = (slideNumber: number, pointIndex: number, newValue: string) => {
    setEditableDrafts((prev) =>
      prev.map((d) => {
        if (d.slideNumber !== slideNumber) return d;
        const newPoints = [...d.points];
        newPoints[pointIndex] = newValue;
        return { ...d, points: newPoints };
      })
    );
  };

  const handleAddPoint = (slideNumber: number) => {
    setEditableDrafts((prev) =>
      prev.map((d) => {
        if (d.slideNumber !== slideNumber) return d;
        return { ...d, points: [...d.points, 'Poin kandungan baharu'] };
      })
    );
  };

  const handleRemovePoint = (slideNumber: number, pointIndex: number) => {
    setEditableDrafts((prev) =>
      prev.map((d) => {
        if (d.slideNumber !== slideNumber) return d;
        return { ...d, points: d.points.filter((_, idx) => idx !== pointIndex) };
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#070F1E] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0B1729]/90 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Sifar Halusinasi • Poin Sebenar
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {editableDrafts.length} Draf Slaid
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#06B6D4]" />
              Semakan Draf Kandungan 45 Slaid
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Sila semak intipati teks bagi setiap 45 slaid di bawah. Apabila anda berpuas hati, tekan butang kelulusan untuk menjana keseluruhan teks prompt imej & video.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Tabs Bar */}
        <div className="px-5 sm:px-6 py-3 border-b border-white/10 bg-[#091322] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#06B6D4] text-[#091322] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua 45 Slaid
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('infographic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'infographic'
                  ? 'bg-[#06B6D4] text-[#091322] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Infografik (1-30)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('mcq')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'mcq'
                  ? 'bg-[#06B6D4] text-[#091322] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              15 Soalan MCQ (31-45)
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tajuk atau isi poin..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#06B6D4]"
            />
          </div>
        </div>

        {/* Drafts Content Scroll List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredDrafts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">Tiada slaid sepadan dengan carian "{searchQuery}".</p>
            </div>
          ) : (
            filteredDrafts.map((draft) => {
              const isEditing = editingSlideNumber === draft.slideNumber;

              return (
                <div
                  key={draft.slideNumber}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    draft.isMcq
                      ? 'bg-[#0A1628]/80 border-purple-500/20 hover:border-purple-500/40'
                      : 'bg-[#0A1628]/80 border-cyan-500/20 hover:border-cyan-500/40'
                  }`}
                >
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-black font-mono border ${
                            draft.isMcq
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          }`}
                        >
                          SLAID {draft.slideNumber}
                        </span>

                        {!draft.isMcq && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenInfographicSelector ? onOpenInfographicSelector(draft) : null}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all shadow-xs"
                              title="Buka 4 cadangan gaya infografik dengan live preview"
                            >
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              <span>Gaya: {draft.infographicType?.replace('_', ' ') || 'BENTO GRID'}</span>
                              <span className="text-[10px] font-mono text-cyan-400 underline ml-0.5">Tukar (4 Cadangan)</span>
                            </button>

                            {/* Quick 4-Archetype Switcher Pills */}
                            <div className="hidden md:flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                              {[
                                { type: 'PROCESS_FLOW' as InfographicArchetype, label: 'Aliran', icon: GitCommit },
                                { type: 'BENTO_GRID' as InfographicArchetype, label: 'Bento', icon: LayoutGrid },
                                { type: 'MULTI_PILLAR' as InfographicArchetype, label: 'Tiang', icon: Columns3 },
                                { type: 'TIMELINE_ROADMAP' as InfographicArchetype, label: 'Fasa', icon: Milestone },
                              ].map((quick) => {
                                const isCurrent = (draft.infographicType || 'BENTO_GRID') === quick.type;
                                const QuickIcon = quick.icon;
                                return (
                                  <button
                                    key={quick.type}
                                    type="button"
                                    onClick={() => handleQuickChangeArchetype(draft.slideNumber, quick.type)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                                      isCurrent
                                        ? 'bg-cyan-400 text-slate-950 shadow-xs'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                    title={`Tukar kepada ${quick.label}`}
                                  >
                                    <QuickIcon className="w-2.5 h-2.5" />
                                    <span>{quick.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {draft.isMcq && (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                            Uji Minda Soalan Kuiz
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setEditingSlideNumber(isEditing ? null : draft.slideNumber)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5 border border-white/10 transition-colors"
                        >
                          {isEditing ? (
                            <>
                              <Save className="w-3.5 h-3.5 text-[#34D399]" />
                              <span className="text-[#34D399]">Selesai Edit</span>
                            </>
                          ) : (
                            <>
                              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                              <span>Sunting Teks</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  {/* Card Body */}
                  <div className="pt-3 space-y-3">
                    {/* Title */}
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Tajuk Slaid</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={draft.title}
                          onChange={(e) => handleUpdateDraft(draft.slideNumber, { title: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-[#06B6D4] text-sm text-white font-bold"
                        />
                      ) : (
                        <h4 className="text-base font-bold text-white tracking-tight">{draft.title}</h4>
                      )}
                    </div>

                    {/* Summary / Narration Basis */}
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                        {draft.isMcq ? 'Pernyataan Soalan' : 'Ringkasan / Konteks Utama'}
                      </label>
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={draft.summary}
                          onChange={(e) => handleUpdateDraft(draft.slideNumber, { summary: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-black/40 border border-[#06B6D4] text-xs text-slate-200"
                        />
                      ) : (
                        <p className="text-xs text-slate-300 leading-relaxed">{draft.summary}</p>
                      )}
                    </div>

                    {/* Points list or MCQ options */}
                    <div>
                      <div className="flex items-center justify-between pb-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                          {draft.isMcq ? 'Pilihan Jawapan' : 'Poin Kandungan Utama (Tulen & Tepat)'}
                        </label>
                        {isEditing && !draft.isMcq && (
                          <button
                            type="button"
                            onClick={() => handleAddPoint(draft.slideNumber)}
                            className="text-[11px] font-bold text-[#06B6D4] hover:underline"
                          >
                            + Tambah Poin
                          </button>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {draft.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] shrink-0" />
                            {isEditing ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={pt}
                                  onChange={(e) => handleUpdatePoint(draft.slideNumber, pIdx, e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-slate-200"
                                />
                                {!draft.isMcq && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePoint(draft.slideNumber, pIdx)}
                                    className="text-xs text-red-400 hover:text-red-300 p-1"
                                    title="Padam poin"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-200 font-medium">{pt}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* MCQ Explanation if applicable */}
                    {draft.isMcq && draft.mcqDetails && (
                      <div className="p-3 rounded-xl bg-black/30 border border-purple-500/20 text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#34D399]">Jawapan Tepat: Pilihan {draft.mcqDetails.correctOption}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          <strong>Penerangan:</strong> {draft.mcqDetails.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Approval Bar */}
        <div className="p-5 sm:p-6 border-t border-white/10 bg-[#0B1729] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <p>
              Teks prompt imej & video akan dijana secara <strong>100% konsisten</strong> mengikut draf kandungan di atas.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Kembali Ubah Input
            </button>

            <button
              type="button"
              onClick={() => onApproveAndGenerate(editableDrafts)}
              disabled={isGeneratingPrompts}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#06B6D4] to-[#34D399] text-[#091322] font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-[#06B6D4]/20 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isGeneratingPrompts ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-[#091322]" />
                  <span>Sedang Menjana 45 Teks Prompt...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Luluskan Draf & Jana 45 Teks Prompt</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
