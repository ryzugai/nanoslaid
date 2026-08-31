import React, { useState } from 'react';
import { CharacterSheetData, SetupConfig } from '../types';
import { processImageTransparency } from '../utils/imageBackgroundRemover';
import {
  Users,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Sparkles,
  Scissors,
  Check,
  Zap,
  ArrowRight,
  Shuffle,
  RefreshCw,
  Camera,
  X,
  Plus,
  UserCheck,
  Layers
} from 'lucide-react';

interface MultiAvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SetupConfig;
  onSaveAvatars: (avatars: CharacterSheetData[]) => void;
  onShuffleAndApply: (avatars: CharacterSheetData[]) => void;
}

export const PRESET_AVATARS: CharacterSheetData[] = [
  {
    id: 'preset_1',
    slotNumber: 1,
    fileName: 'guzairy.png',
    imageUrl: '',
    characterName: 'GUZAIRY',
    specs: 'Lelaki 35 tahun berwajah ramah, kemeja polo korporat biru diraja dengan lencana nametag GUZAIRY di dada kiri, senyuman mesra dan gaya tangan membentang terbuka',
    customCostume: 'Kemeja Korporat Biru Diraja & Nametag GUZAIRY',
    gender: 'Lelaki',
  },
  {
    id: 'preset_2',
    slotNumber: 2,
    fileName: 'dr_aiman.png',
    imageUrl: '',
    characterName: 'DR. AIMAN',
    specs: 'Lelaki 32 tahun, berwajah kemas profesional, rambut pendek rapi, cermin mata nipis moden, sut korporat biru navy kemas dengan kemeja putih',
    customCostume: 'Sut Korporat Navy Blue & Kemeja Putih',
    gender: 'Lelaki',
  },
  {
    id: 'preset_3',
    slotNumber: 3,
    fileName: 'prof_siti.png',
    imageUrl: '',
    characterName: 'PROF. SITI',
    specs: 'Wanita profesional Melayu 35 tahun, mengenakan hijab bawal moden warna teal pastel, blazer korporat kelabu gelap elegan, senyuman mesra berkarisma',
    customCostume: 'Blazer Korporat Kelabu & Hijab Teal Pastel',
    gender: 'Wanita',
  },
  {
    id: 'preset_4',
    slotNumber: 4,
    fileName: 'kevin_tan.png',
    imageUrl: '',
    characterName: 'KEVIN TAN',
    specs: 'Lelaki Cina 29 tahun, berambut undercut kemas, kemeja smart casual biru muda dengan vest minimalis, ekspresi analitikal berwibawa',
    customCostume: 'Smart Casual Kemeja Biru Muda & Vest',
    gender: 'Lelaki',
  },
];

export const MultiAvatarUploadModal: React.FC<MultiAvatarUploadModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveAvatars,
  onShuffleAndApply,
}) => {
  // Initialize 4 avatar slots
  const [avatars, setAvatars] = useState<CharacterSheetData[]>(() => {
    if (config.uploadedAvatars && config.uploadedAvatars.length === 4) {
      return config.uploadedAvatars.map((a, idx) => ({
        ...a,
        slotNumber: idx + 1,
        id: a.id || `avatar_slot_${idx + 1}`,
      }));
    }
    // Default fallback to 4 structured slots
    return [
      config.characterSheet
        ? { ...config.characterSheet, slotNumber: 1, id: 'avatar_slot_1' }
        : { ...PRESET_AVATARS[0], slotNumber: 1, id: 'avatar_slot_1' },
      { ...PRESET_AVATARS[1], slotNumber: 2, id: 'avatar_slot_2' },
      { ...PRESET_AVATARS[2], slotNumber: 3, id: 'avatar_slot_3' },
      { ...PRESET_AVATARS[3], slotNumber: 4, id: 'avatar_slot_4' },
    ];
  });

  const [processingSlot, setProcessingSlot] = useState<number | null>(null);
  const [activeSlotTab, setActiveSlotTab] = useState<number>(1);

  if (!isOpen) return null;

  const handleFileUploadForSlot = (slotNum: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessingSlot(slotNum);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      // Auto clean background with transparency
      const cleanCutout = await processImageTransparency(base64, 42);

      setAvatars((prev) =>
        prev.map((av, idx) => {
          if (idx + 1 === slotNum) {
            return {
              ...av,
              fileName: file.name,
              imageUrl: cleanCutout,
            };
          }
          return av;
        })
      );
      setProcessingSlot(null);
    };

    reader.readAsDataURL(file);
  };

  const handleCleanCutoutForSlot = async (slotNum: number) => {
    const currentAvatar = avatars[slotNum - 1];
    if (!currentAvatar?.imageUrl) return;

    setProcessingSlot(slotNum);
    try {
      const cleaned = await processImageTransparency(currentAvatar.imageUrl, 48);
      setAvatars((prev) =>
        prev.map((av, idx) => (idx + 1 === slotNum ? { ...av, imageUrl: cleaned } : av))
      );
    } catch (err) {
      console.warn('Error cleaning cutout:', err);
    } finally {
      setProcessingSlot(null);
    }
  };

  const handleUpdateAvatarField = (
    slotNum: number,
    field: keyof CharacterSheetData,
    value: any
  ) => {
    setAvatars((prev) =>
      prev.map((av, idx) => (idx + 1 === slotNum ? { ...av, [field]: value } : av))
    );
  };

  const handleLoadPresetToSlot = (slotNum: number, preset: CharacterSheetData) => {
    setAvatars((prev) =>
      prev.map((av, idx) => {
        if (idx + 1 === slotNum) {
          return {
            ...preset,
            slotNumber: slotNum,
            id: `avatar_slot_${slotNum}`,
            imageUrl: av.imageUrl || preset.imageUrl || '',
          };
        }
        return av;
      })
    );
  };

  const handleLoadAll4Presets = () => {
    setAvatars(
      PRESET_AVATARS.map((p, idx) => ({
        ...p,
        slotNumber: idx + 1,
        id: `avatar_slot_${idx + 1}`,
      }))
    );
  };

  const handleClearSlot = (slotNum: number) => {
    setAvatars((prev) =>
      prev.map((av, idx) => {
        if (idx + 1 === slotNum) {
          return {
            id: `avatar_slot_${slotNum}`,
            slotNumber: slotNum,
            fileName: '',
            imageUrl: '',
            characterName: `WATAK ${slotNum}`,
            specs: 'Watak pembentang korporat profesional kemas.',
            customCostume: 'Sut Korporat',
            gender: slotNum % 2 === 1 ? 'Lelaki' : 'Wanita',
          };
        }
        return av;
      })
    );
  };

  const handleApplyAndDistribute = () => {
    onSaveAvatars(avatars);
    onShuffleAndApply(avatars);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0B132B] border border-[#06B6D4]/40 rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0E1A38] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4] to-indigo-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <Users className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Muat Naik 4 Watak Avatar (Pengagihan Rawak ke 45 Slaid)
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40">
                  4 Slot Aktif
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Muat naik sehingga 4 imej watak avatar. Sistem akan memasukkan dan merawakkan keempat-empat watak ke dalam 45 slaid!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="px-5 py-2.5 bg-[#091224] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-[11px] font-semibold text-slate-400">Pilihan Pantas:</span>
            <button
              type="button"
              onClick={handleLoadAll4Presets}
              className="px-2.5 py-1 rounded-lg bg-[#06B6D4]/15 hover:bg-[#06B6D4]/25 text-[#06B6D4] font-bold border border-[#06B6D4]/30 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Isi 4 Watak Templat Eksekutif (Guzairy, Aiman, Siti, Kevin)</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pengagihan: Rawak & Bergilir pada 45 Slaid</span>
          </div>
        </div>

        {/* Modal Body: 4 Avatar Slots Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {avatars.map((av, index) => {
              const slotNum = index + 1;
              const isProcessing = processingSlot === slotNum;
              const hasImage = Boolean(av.imageUrl);

              return (
                <div
                  key={av.id || `slot-${slotNum}`}
                  className="rounded-xl border border-slate-800 bg-[#081122] flex flex-col p-3.5 space-y-3 relative hover:border-[#06B6D4]/40 transition-all shadow-md"
                >
                  {/* Slot Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#06B6D4] text-[11px] font-bold flex items-center justify-center font-mono">
                        {slotNum}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wide truncate max-w-[120px]">
                        {av.characterName || `Watak #${slotNum}`}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        av.gender === 'Wanita'
                          ? 'bg-pink-950/80 text-pink-300 border border-pink-700/40'
                          : 'bg-blue-950/80 text-blue-300 border border-blue-700/40'
                      }`}
                    >
                      {av.gender || 'Lelaki'}
                    </span>
                  </div>

                  {/* Avatar Cutout / Image Preview Container */}
                  <div className="relative h-44 rounded-lg bg-[#050B14] border border-slate-800 flex items-center justify-center overflow-hidden group">
                    {/* Checkerboard transparent pattern */}
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage: `radial-gradient(#475569 1px, transparent 1px)`,
                        backgroundSize: '10px 10px',
                      }}
                    />

                    {hasImage ? (
                      <div className="relative w-full h-full flex items-center justify-center p-2">
                        <img
                          src={av.imageUrl}
                          alt={av.characterName}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[9px] font-mono flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Siap
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-2">
                          <Camera className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-300">Slot Watak {slotNum}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">Muat naik fail gambar</span>
                      </div>
                    )}

                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-1.5 z-20">
                        <RefreshCw className="w-5 h-5 text-[#06B6D4] animate-spin" />
                        <span className="text-[10px] text-cyan-300 font-mono">Membuang Latar...</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Image Button for This Slot */}
                  <div>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      id={`upload-avatar-slot-${slotNum}`}
                      className="hidden"
                      onChange={(e) => handleFileUploadForSlot(slotNum, e)}
                    />
                    <div className="grid grid-cols-2 gap-1.5">
                      <label
                        htmlFor={`upload-avatar-slot-${slotNum}`}
                        className="py-1.5 px-2 rounded-lg border border-slate-700 hover:border-[#06B6D4] bg-[#0A162C] hover:bg-[#0A162C]/80 text-[11px] font-bold text-slate-200 hover:text-white flex items-center justify-center gap-1 cursor-pointer transition-all text-center"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-[#06B6D4]" />
                        <span>{hasImage ? 'Tukar Foto' : 'Muat Naik'}</span>
                      </label>

                      {hasImage ? (
                        <button
                          type="button"
                          onClick={() => handleCleanCutoutForSlot(slotNum)}
                          disabled={isProcessing}
                          className="py-1.5 px-2 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-[11px] font-semibold text-cyan-300 flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                          title="Tapis latar belakang lebih kemas"
                        >
                          <Scissors className="w-3 h-3" />
                          <span>Kemas BG</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLoadPresetToSlot(slotNum, PRESET_AVATARS[index] || PRESET_AVATARS[0])}
                          className="py-1.5 px-2 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-all"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Guna Preset</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Character Name & Nametag */}
                  <div className="space-y-1.5">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">
                        Nama / Nametag Watak #{slotNum}
                      </label>
                      <input
                        type="text"
                        value={av.characterName}
                        onChange={(e) => handleUpdateAvatarField(slotNum, 'characterName', e.target.value.toUpperCase())}
                        placeholder={`WATAK ${slotNum}`}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#050B14] border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-[#06B6D4]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Jantina</label>
                        <select
                          value={av.gender || 'Lelaki'}
                          onChange={(e) => handleUpdateAvatarField(slotNum, 'gender', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg bg-[#050B14] border border-slate-700 text-[11px] font-medium text-white focus:outline-none focus:border-[#06B6D4]"
                        >
                          <option value="Lelaki">Lelaki</option>
                          <option value="Wanita">Wanita</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Kostum</label>
                        <input
                          type="text"
                          value={av.customCostume || ''}
                          onChange={(e) => handleUpdateAvatarField(slotNum, 'customCostume', e.target.value)}
                          placeholder="Sut / Korporat"
                          className="w-full px-2 py-1.5 rounded-lg bg-[#050B14] border border-slate-700 text-[11px] text-white focus:outline-none focus:border-[#06B6D4]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Spesifikasi Visual</label>
                      <textarea
                        rows={2}
                        value={av.specs}
                        onChange={(e) => handleUpdateAvatarField(slotNum, 'specs', e.target.value)}
                        placeholder="Rupa, rambut, cermin mata, gaya..."
                        className="w-full px-2 py-1 rounded-lg bg-[#050B14] border border-slate-700 text-[11px] text-slate-300 focus:outline-none focus:border-[#06B6D4] resize-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation Box */}
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-[#071329] flex items-start gap-3 text-xs text-slate-300">
            <Shuffle className="w-5 h-5 text-[#06B6D4] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm mb-1">
                Bagaimana 4 Watak Avatar Ini Berfungsi dalam Slaid?
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Apabila anda menekan butang <strong>"Muatkan & Rawakkan ke 45 Slaid"</strong>, setiap satu daripada 45 slaid (30 modul infografik + 15 kuiz MCQ) akan diberikan salah satu daripada 4 watak avatar ini secara rawak dan seimbang.
              </p>
              <p className="text-slate-400 mt-1">
                Prompt imej Nano Banana 2, prompt video Veo 10s/5s, skrip avatar 30s, dan mockup visual kanvas akan menggunakan watak avatar yang sepadan untuk slaid tersebut.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0E1A38] flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{avatars.filter((a) => a.imageUrl).length} daripada 4 watak mempunyai gambar cutout sedia ada.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleApplyAndDistribute}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#06B6D4] to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-cyan-950 transition-all"
            >
              <Shuffle className="w-4 h-4" />
              <span>Muatkan & Rawakkan ke 45 Slaid</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
