import React, { useState } from 'react';
import { CharacterSheetData, CharacterPoseVariation } from '../types';
import {
  User,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Scissors,
  Check,
  Zap,
  ArrowRight,
  HelpCircle,
  Eye,
  Camera,
  Shirt,
  Layers,
  X,
  Play
} from 'lucide-react';
import { processImageTransparency } from '../utils/imageBackgroundRemover';

interface AvatarGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterSheet?: CharacterSheetData;
  onApproveAvatar: (approvedSheet: CharacterSheetData) => void;
  presenterStyle: 'Pixar 3D Style' | 'Photorealistic Style';
  nametagText: string;
}

const DEFAULT_POSES: CharacterPoseVariation[] = [
  {
    poseId: 'pose_welcome',
    label: '1. Gaya Sambutan & Pembukaan Mesra',
    description: 'Berdiri tegap, kedua-dua tangan terbuka dengan gestur mesra menyambut audiens.',
    imageUrl: '',
  },
  {
    poseId: 'pose_pointing',
    label: '2. Gaya Menunjuk & Menjelaskan Poin',
    description: 'Memegang stylus digital bercahaya sambil menunjuk ke arah kad infografik slaid.',
    imageUrl: '',
  },
  {
    poseId: 'pose_tablet',
    label: '3. Gaya Eksekutif Memegang Tablet',
    description: 'Memegang tablet pintar nipis dengan gestur analisis data & keputusan strategik.',
    imageUrl: '',
  },
  {
    poseId: 'pose_quiz',
    label: '4. Gaya Interaktif Kuiz & Soal Jawab',
    description: 'Gestur ceria mengangkat tangan mengajak peserta berfikir dan menjawab kuiz.',
    imageUrl: '',
  },
];

const PRESET_CHARACTERS = [
  {
    name: 'GUZAIRY',
    specs: 'Lelaki berumur 35 tahun, gaya 3D Pixar ekspresif, rambut hitam beruban kemas di tepi, kemeja polo korporat biru diraja dengan lencana nametag "GUZAIRY" di dada kiri, senyuman mesra dan gaya tangan terbuka membentang',
    costume: 'Kemeja Korporat Biru Diraja & Nametag "GUZAIRY"',
    gender: 'Lelaki' as const,
  },
  {
    name: 'DR. AIMAN',
    specs: 'Lelaki 32 tahun, berwajah kemas profesional, rambut pendek rapi, memakai cermin mata nipis moden, sut korporat biru navy kemas dengan kemeja putih',
    costume: 'Sut Korporat Navy Blue & Kemeja Putih',
    gender: 'Lelaki' as const,
  },
  {
    name: 'PROF. SITI',
    specs: 'Wanita profesional Melayu 35 tahun, mengenakan hijab bawal moden warna teal pastel, blazer korporat kelabu gelap elegan, senyuman mesra berkarisma',
    costume: 'Blazer Korporat Kelabu & Hijab Teal Pastel',
    gender: 'Wanita' as const,
  },
  {
    name: 'KEVIN TAN',
    specs: 'Lelaki Cina 29 tahun, berambut undercut kemas, kemeja smart casual biru muda dengan vest minimalis, ekspresi analitikal berwibawa',
    costume: 'Smart Casual Kemeja Biru Muda & Vest',
    gender: 'Lelaki' as const,
  },
  {
    name: 'ANAND RAO',
    specs: 'Lelaki India 34 tahun, sawo matang, rambut berombak kemas, sut korporat hitam moden dengan tali leher cyan cerun, pandangan yakin berkarisma',
    costume: 'Sut Korporat Hitam & Tali Leher Cyan',
    gender: 'Lelaki' as const,
  },
];

export const AvatarGenerationModal: React.FC<AvatarGenerationModalProps> = ({
  isOpen,
  onClose,
  characterSheet,
  onApproveAvatar,
  presenterStyle,
  nametagText,
}) => {
  const [charName, setCharName] = useState(
    characterSheet?.characterName || nametagText || 'DR. AIMAN'
  );
  const [specs, setSpecs] = useState(
    characterSheet?.specs ||
      'Lelaki berumur 32 tahun, berwajah kemas profesional, rambut pendek rapi, memakai cermin mata nipis moden, sut korporat biru navy kemas dengan kemeja putih'
  );
  const [customCostume, setCustomCostume] = useState(
    characterSheet?.customCostume || 'Sut Korporat Navy Blue'
  );
  const [gender, setGender] = useState<'Lelaki' | 'Wanita'>(
    characterSheet?.gender || 'Lelaki'
  );
  const [imageUrl, setImageUrl] = useState<string>(characterSheet?.imageUrl || '');
  const [fileName, setFileName] = useState<string>(
    characterSheet?.fileName || 'character_sheet.png'
  );

  const [poses, setPoses] = useState<CharacterPoseVariation[]>(
    characterSheet?.poses && characterSheet.poses.length === 4
      ? characterSheet.poses
      : DEFAULT_POSES
  );
  const [selectedPoseIndex, setSelectedPoseIndex] = useState<number>(0);
  const [isProcessingBg, setIsProcessingBg] = useState(false);
  const [isGeneratingPoses, setIsGeneratingPoses] = useState(false);
  const [generationIteration, setGenerationIteration] = useState(1);
  const [customPromptNote, setCustomPromptNote] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessingBg(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      // Auto-apply clean edge-defringed background removal
      const transparentCutout = await processImageTransparency(base64, 42);
      setImageUrl(transparentCutout);

      // Sync image to all 4 poses
      setPoses((prev) =>
        prev.map((p) => ({
          ...p,
          imageUrl: transparentCutout,
        }))
      );
      setIsProcessingBg(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCleanBgRemoval = async () => {
    if (!imageUrl) return;
    setIsProcessingBg(true);
    try {
      const cleaned = await processImageTransparency(imageUrl, 48);
      setImageUrl(cleaned);
      setPoses((prev) =>
        prev.map((p) => ({
          ...p,
          imageUrl: cleaned,
        }))
      );
    } catch (err) {
      console.warn('BG removal error:', err);
    } finally {
      setIsProcessingBg(false);
    }
  };

  const handleSelectPreset = (preset: (typeof PRESET_CHARACTERS)[0]) => {
    setCharName(preset.name);
    setSpecs(preset.specs);
    setCustomCostume(preset.costume);
    setGender(preset.gender);
    setFileName(`preset_${preset.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`);
  };

  const handleRegeneratePoses = async () => {
    setIsGeneratingPoses(true);
    try {
      const res = await fetch('/api/gemini/generate-avatar-poses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterSheet: {
            fileName,
            imageUrl,
            characterName: charName,
            specs,
            customCostume,
            gender,
          },
          characterName: charName,
          specs,
          costume: customCostume,
          gender,
          style: presenterStyle,
        }),
      });

      const data = await res.json();
      if (data && data.poses) {
        setPoses(
          data.poses.map((p: any) => ({
            poseId: p.poseId,
            label: p.label,
            description: p.description,
            imageUrl: p.imageUrl || imageUrl,
          }))
        );
        setGenerationIteration((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Error generating avatar poses:', err);
    } finally {
      setIsGeneratingPoses(false);
    }
  };

  const handleConfirmAndProceed = () => {
    const finalCharacterSheet: CharacterSheetData = {
      fileName,
      imageUrl,
      characterName: charName.toUpperCase(),
      specs,
      customCostume,
      gender,
      poses,
      selectedPoseId: poses[selectedPoseIndex]?.poseId || 'pose_welcome',
    };

    onApproveAvatar(finalCharacterSheet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0B132B] border border-[#06B6D4]/40 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0E1A38] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4] to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Langkah 1: Jana & Sahkan Watak Avatar (Character Sheet)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40">
                  4 Gaya Pembentangan
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Jana dan semak avatar sehingga anda berpuas hati sebelum menyemak draf 45 kandungan slaid.
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

        {/* Modal Body (2 Column Layout) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Character Spec & Presets (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Pilih Templat Watak Rasmi (Preset)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_CHARACTERS.map((preset) => {
                  const isSelected = charName === preset.name;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#06B6D4] bg-[#06B6D4]/15 text-cyan-300 font-bold shadow-md shadow-cyan-950'
                          : 'border-slate-800 bg-[#091224] text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#06B6D4]" />}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{preset.costume}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Upload Character Sheet */}
            <div className="p-4 rounded-xl border border-slate-800 bg-[#070F1E] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-[#06B6D4]" />
                  <span>Muat Naik Imej Watak (Character Sheet)</span>
                </label>
                {imageUrl && (
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Berjaya Dimuat
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-modal-file-upload"
                />
                <label
                  htmlFor="avatar-modal-file-upload"
                  className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-[#06B6D4] rounded-xl cursor-pointer bg-[#0A162C]/60 hover:bg-[#0A162C] transition-all group text-center"
                >
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-[#06B6D4] mb-1.5 transition-colors" />
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white">
                    Klik untuk muat naik gambar watak
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    PNG / JPG (Latar belakang akan dibuang secara automatik)
                  </span>
                </label>
              </div>

              {/* Background Removal Clean-Up Button */}
              {imageUrl && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400">Pembersihan Latar Belakang:</span>
                  <button
                    type="button"
                    onClick={handleCleanBgRemoval}
                    disabled={isProcessingBg}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Scissors className={`w-3.5 h-3.5 ${isProcessingBg ? 'animate-spin' : ''}`} />
                    <span>{isProcessingBg ? 'Memproses...' : 'Kemas Background (Clean Cutout)'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Character Specs Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Watak / Lencana Nametag
                </label>
                <input
                  type="text"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value.toUpperCase())}
                  placeholder="DR. AIMAN"
                  className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-[#06B6D4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jantina</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Lelaki' | 'Wanita')}
                    className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-[#06B6D4]"
                  >
                    <option value="Lelaki">Lelaki</option>
                    <option value="Wanita">Wanita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pakaian / Kostum</label>
                  <input
                    type="text"
                    value={customCostume}
                    onChange={(e) => setCustomCostume(e.target.value)}
                    placeholder="Sut Korporat Navy"
                    className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#06B6D4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Visual & Ciri-Ciri Watak (Prompt Specs)
                </label>
                <textarea
                  rows={3}
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  placeholder="Perincian umur, gaya rambut, kaca mata, ekspresi muka..."
                  className="w-full px-3 py-2 rounded-xl bg-[#091224] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-[#06B6D4] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: 4 Presentation Poses Review & Iteration (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#06B6D4]" />
                  <span>4 Gaya Pembentangan Watak (Presentation Styles)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Watak ini akan dimasukkan ke dalam teks prompt slaid mengikut 4 gaya pembentangan ini.
                </p>
              </div>

              {/* Iteration Counter */}
              <div className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-300">
                Pusingan Janaan #{generationIteration}
              </div>
            </div>

            {/* 4 Poses Grid */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {poses.map((pose, idx) => {
                const isSelected = selectedPoseIndex === idx;
                return (
                  <div
                    key={pose.poseId}
                    onClick={() => setSelectedPoseIndex(idx)}
                    className={`relative p-3 rounded-xl border flex flex-col cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#06B6D4] bg-[#0A1830] ring-2 ring-[#06B6D4]/30'
                        : 'border-slate-800 bg-[#081122] hover:border-slate-700 hover:bg-[#0A152A]'
                    }`}
                  >
                    {/* Pose Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white tracking-tight">{pose.label}</span>
                      {isSelected ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#06B6D4] text-slate-950">
                          Dipilih
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Gaya #{idx + 1}</span>
                      )}
                    </div>

                    {/* Pose Preview Canvas / Image Box */}
                    <div className="relative flex-1 min-h-[140px] rounded-lg bg-[#050B14] border border-slate-800/80 flex items-center justify-center overflow-hidden">
                      {/* Checkerboard Pattern indicating transparent backdrop */}
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `radial-gradient(#475569 1px, transparent 1px)`,
                          backgroundSize: '12px 12px',
                        }}
                      />

                      {pose.imageUrl ? (
                        <img
                          src={pose.imageUrl}
                          alt={pose.label}
                          className="relative max-h-[130px] object-contain drop-shadow-xl transition-transform hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="relative flex flex-col items-center justify-center text-center p-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-900 to-blue-900 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-base mb-1 shadow-inner">
                            {charName.slice(0, 2)}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-300">
                            {charName}
                          </span>
                          <span className="text-[9px] text-cyan-400 font-mono">
                            {presenterStyle}
                          </span>
                        </div>
                      )}

                      {/* Pose badge overlay */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] text-slate-300 truncate">
                        {pose.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Re-generate Until Satisfied Action Bar */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-[#070F1E] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-cyan-300">Tidak berpuas hati dengan gaya avatar?</span>
                <p className="text-[11px] text-slate-400">
                  Anda boleh menjana semula berulang kali sehingga mendapat rupa & gaya yang diingini.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRegeneratePoses}
                disabled={isGeneratingPoses}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-all disabled:opacity-50 flex-shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPoses ? 'animate-spin' : ''}`} />
                <span>{isGeneratingPoses ? 'Menjana Watak...' : 'Jana Semula Avatar (Re-Roll)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0E1A38] flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Watak Avatar sedia untuk dimasukkan ke dalam draf kandungan.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Kembali
            </button>

            <button
              type="button"
              onClick={handleConfirmAndProceed}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <span>Sahkan Avatar & Teruskan ke Draf Kandungan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
