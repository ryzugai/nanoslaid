import React, { useState, useRef } from 'react';
import { CharacterSheetData } from '../types';
import {
  User,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  HelpCircle,
  Eye,
  Camera,
  Shirt
} from 'lucide-react';

interface CharacterSheetSectionProps {
  characterSheet?: CharacterSheetData;
  onUpdateCharacterSheet: (data: CharacterSheetData | undefined) => void;
}

const PRESET_CHARACTERS: CharacterSheetData[] = [
  {
    fileName: 'preset_guzairy.png',
    imageUrl: '',
    characterName: 'GUZAIRY',
    specs: 'Lelaki berumur 35 tahun, gaya watak 3D animasi Pixar ekspresif, berambut hitam beruban sedikit di tepi kemas, kemeja polo korporat biru diraja dengan logo institusi & nametag putih berhuruf besar "GUZAIRY" di dada kiri, senyuman mesra dan gaya tangan terbuka membentang',
    customCostume: 'Kemeja Korporat Biru Diraja & Nametag "GUZAIRY"',
    gender: 'Lelaki',
  },
  {
    fileName: 'preset_dr_aiman.png',
    imageUrl: '',
    characterName: 'DR. AIMAN',
    specs: 'Lelaki berumur 32 tahun, berwajah kemas profesional, berambut pendek rapi, memakai cermin mata nipis moden, sut korporat biru navy kemas dengan kemeja putih',
    customCostume: 'Sut Korporat Navy Blue & Kemeja Putih',
    gender: 'Lelaki',
  },
  {
    fileName: 'preset_prof_siti.png',
    imageUrl: '',
    characterName: 'PROF. SITI',
    specs: 'Wanita profesional Melayu berumur 35 tahun, mengenakan hijab bawal moden warna teal pastel, blazer korporat kelabu gelap elegan, senyuman mesra berkarisma tinggi',
    customCostume: 'Blazer Korporat Kelabu & Hijab Teal Pastel',
    gender: 'Wanita',
  },
  {
    fileName: 'preset_kevin_tan.png',
    imageUrl: '',
    characterName: 'KEVIN TAN',
    specs: 'Lelaki Cina berumur 29 tahun, berambut gaya undercut kemas, memakai pakaian smart casual berkolar kemeja biru muda dengan vest minimalis, ekspresi analitikal dinamik',
    customCostume: 'Smart Casual Kemeja Biru Muda & Vest',
    gender: 'Lelaki',
  },
  {
    fileName: 'preset_anand_rao.png',
    imageUrl: '',
    characterName: 'ANAND RAO',
    specs: 'Lelaki India berumur 34 tahun, berkulit sawo matang, rambut berombak kemas, sut korporat hitam moden dengan tali leher cyan cerun, pandangan yakin berwibawa',
    customCostume: 'Sut Korporat Hitam & Tali Leher Cyan',
    gender: 'Lelaki',
  },
];

export const CharacterSheetSection: React.FC<CharacterSheetSectionProps> = ({
  characterSheet,
  onUpdateCharacterSheet,
}) => {
  const [characterName, setCharacterName] = useState(characterSheet?.characterName || 'DR. AIMAN');
  const [specs, setSpecs] = useState(
    characterSheet?.specs ||
      'Lelaki berumur 32 tahun, berwajah kemas profesional, berambut pendek rapi, memakai cermin mata nipis moden, sut korporat biru navy kemas dengan kemeja putih'
  );
  const [customCostume, setCustomCostume] = useState(characterSheet?.customCostume || 'Sut Korporat Navy Blue');
  const [gender, setGender] = useState<'Lelaki' | 'Wanita'>(characterSheet?.gender || 'Lelaki');
  const [previewImage, setPreviewImage] = useState<string | null>(characterSheet?.imageUrl || null);
  const [fileName, setFileName] = useState<string>(characterSheet?.fileName || 'character_sheet.png');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewImage(dataUrl);

      // Auto update
      onUpdateCharacterSheet({
        fileName: file.name,
        imageUrl: dataUrl,
        characterName: characterName.toUpperCase(),
        specs,
        customCostume,
        gender,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: CharacterSheetData) => {
    setCharacterName(preset.characterName);
    setSpecs(preset.specs);
    setCustomCostume(preset.customCostume || '');
    setGender(preset.gender || 'Lelaki');
    setFileName(preset.fileName);
    setPreviewImage(null);

    onUpdateCharacterSheet({
      fileName: preset.fileName,
      imageUrl: '',
      characterName: preset.characterName,
      specs: preset.specs,
      customCostume: preset.customCostume,
      gender: preset.gender,
    });
  };

  const handleFieldChange = (
    newName: string,
    newSpecs: string,
    newCostume: string,
    newGender: 'Lelaki' | 'Wanita'
  ) => {
    setCharacterName(newName);
    setSpecs(newSpecs);
    setCustomCostume(newCostume);
    setGender(newGender);

    onUpdateCharacterSheet({
      fileName,
      imageUrl: previewImage || '',
      characterName: newName.toUpperCase(),
      specs: newSpecs,
      customCostume: newCostume,
      gender: newGender,
    });
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    onUpdateCharacterSheet({
      fileName: 'specs_only.png',
      imageUrl: '',
      characterName: characterName.toUpperCase(),
      specs,
      customCostume,
      gender,
    });
  };

  return (
    <div className="space-y-5">
      {/* Overview Info Banner */}
      <div className="p-4 rounded-xl bg-[#091322] border border-[#06B6D4]/30 text-slate-200 space-y-1">
        <div className="text-xs font-mono font-bold text-[#06B6D4] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Character Sheet Watak Avatar Rasmi</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Muat naik helaian reka bentuk watak (Character Sheet) avatar anda. Spesifikasi rupa paras, gaya pakaian, dan ekspresi ini akan disuntik secara langsung ke dalam teks prompt <strong>Nano Banana 2</strong> dan <strong>Veo</strong> bagi menjamin konsistensi 100% pada kesemua 45 slaid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Image Upload & Visual Card */}
        <div className="md:col-span-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Imej Character Sheet
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-[#091322] flex flex-col items-center justify-center text-center space-y-3">
            {previewImage ? (
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/15 bg-black/40 group">
                <img
                  src={previewImage}
                  alt={characterName}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#06B6D4] text-[#091322]"
                  >
                    Tukar Imej
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    title="Buang imej"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-white/15 hover:border-[#06B6D4]/50 bg-[#0B1729] flex flex-col items-center justify-center p-4 cursor-pointer transition-all space-y-2"
              >
                <div className="w-12 h-12 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white">Muat Naik Gambar Character Sheet</div>
                <div className="text-[11px] text-slate-400">PNG, JPG, WEBP (Maks 10MB)</div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="w-full text-left space-y-1 pt-1 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Status Watak:</span>
                <span className="font-bold text-[#34D399] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {previewImage ? 'Imej Aktif' : 'Spesifikasi Teks'}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                Fail: {fileName}
              </div>
            </div>
          </div>

          {/* Quick Avatar Presets */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-slate-400">
              Atau Pilih Watak Malaysia Pratetap:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_CHARACTERS.map((preset) => (
                <button
                  key={preset.characterName}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    characterName === preset.characterName
                      ? 'border-[#06B6D4] bg-[#06B6D4]/10 text-white'
                      : 'border-white/10 bg-[#091322] hover:bg-[#0B1729] text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{preset.characterName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{preset.gender} • {preset.customCostume}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Character Specs Editor */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Nama Watak Avatar (Untuk Nametag &amp; Dialog)
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) =>
                handleFieldChange(e.target.value.toUpperCase(), specs, customCostume, gender)
              }
              placeholder="Contoh: DR. AIMAN / PUAN AISHAH"
              className="w-full px-4 py-2 rounded-xl border border-white/10 bg-[#091322] text-white text-xs font-bold uppercase tracking-wider focus:ring-2 focus:ring-[#06B6D4] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Jantina Watak
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleFieldChange(characterName, specs, customCostume, 'Lelaki')
                  }
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    gender === 'Lelaki'
                      ? 'border-[#06B6D4] bg-[#06B6D4]/20 text-[#06B6D4]'
                      : 'border-white/10 bg-[#091322] text-slate-400'
                  }`}
                >
                  Lelaki
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleFieldChange(characterName, specs, customCostume, 'Wanita')
                  }
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    gender === 'Wanita'
                      ? 'border-[#06B6D4] bg-[#06B6D4]/20 text-[#06B6D4]'
                      : 'border-white/10 bg-[#091322] text-slate-400'
                  }`}
                >
                  Wanita
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Pakaian / Kostum Khas
              </label>
              <input
                type="text"
                value={customCostume}
                onChange={(e) =>
                  handleFieldChange(characterName, specs, e.target.value, gender)
                }
                placeholder="Contoh: Sut Korporat Biru Navy"
                className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#091322] text-white text-xs focus:ring-2 focus:ring-[#06B6D4] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Huraian Terperinci Rupa Paras &amp; Spesifikasi Visual (Character Sheet Specs)
            </label>
            <textarea
              rows={4}
              value={specs}
              onChange={(e) =>
                handleFieldChange(characterName, e.target.value, customCostume, gender)
              }
              placeholder="Huraikan ciri fizikal, gaya rambut/tudung, ekspresi muka, bentuk cermin mata, aksesori, dan tona warna watak..."
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#091322] text-white text-xs font-mono leading-relaxed focus:ring-2 focus:ring-[#06B6D4] focus:outline-none"
            />
            <div className="text-[11px] text-slate-400 mt-1">
              * Teks spesifikasi ini dimasukkan secara automatik ke dalam prompt Nano Banana 2 dan Veo untuk mengekalkan konsistensi identiti watak.
            </div>
          </div>

          {/* Prompt Integration Preview Box */}
          <div className="p-3.5 rounded-xl bg-[#091322] border border-white/10 space-y-1.5">
            <div className="text-[10px] font-mono uppercase font-bold text-[#34D399]">
              Pratonton Integrasi Prompt:
            </div>
            <div className="text-[11px] font-mono text-slate-300 line-clamp-2">
              "...strictly replicating the uploaded Character Sheet '{characterName}' (Visual Identity &amp; Specs: {specs}, Attire: {customCostume})..."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
