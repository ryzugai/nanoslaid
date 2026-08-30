import React, { useState } from 'react';
import { SetupConfig, UploadedPptData, CharacterSheetData } from '../types';
import { ColorSchemePicker } from './ColorSchemePicker';
import { PptUploadSection } from './PptUploadSection';
import { CharacterSheetSection } from './CharacterSheetSection';
import { SAMPLE_TOPICS } from '../data/colorSchemes';
import {
  Sparkles,
  UserCheck,
  Palette,
  Globe2,
  Tv,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  User
} from 'lucide-react';

interface MandatorySetupModalProps {
  isOpen: boolean;
  onClose?: () => void;
  config: SetupConfig;
  onSaveAndGenerate: (config: SetupConfig) => void;
  isInitial?: boolean;
}

export const MandatorySetupModal: React.FC<MandatorySetupModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveAndGenerate,
  isInitial = false,
}) => {
  const [topic, setTopic] = useState(config.topic || '');
  const [referenceText, setReferenceText] = useState(config.referenceText || '');
  const [useNametag, setUseNametag] = useState(config.useNametag);
  const [nametagText, setNametagText] = useState(config.nametagText || 'DR. AIMAN');
  const [colorSchemeId, setColorSchemeId] = useState(config.colorSchemeId || 1);
  const [outputLanguage, setOutputLanguage] = useState(config.outputLanguage || 'Bahasa Melayu Baku Malaysia');
  const [presenterStyle, setPresenterStyle] = useState(config.presenterStyle || 'Pixar 3D Style');

  const [uploadedPpt, setUploadedPpt] = useState<UploadedPptData | undefined>(config.uploadedPpt);
  const [characterSheet, setCharacterSheet] = useState<CharacterSheetData | undefined>(config.characterSheet || {
    fileName: 'default_character.png',
    imageUrl: '',
    characterName: config.nametagText || 'DR. AIMAN',
    specs: 'Lelaki berumur 32 tahun, berwajah kemas profesional, berambut pendek rapi, memakai cermin mata nipis moden, sut korporat biru navy kemas dengan kemeja putih',
    customCostume: 'Sut Korporat Navy Blue',
    gender: 'Lelaki',
  });

  const [activeTab, setActiveTab] = useState<'topic' | 'avatar' | 'colors' | 'language' | 'style'>('topic');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePptParsed = (pptData: UploadedPptData, suggestedTopic?: string) => {
    setUploadedPpt(pptData);
    if (suggestedTopic && (!topic || topic.length === 0)) {
      setTopic(suggestedTopic);
    }
    setReferenceText(pptData.fullExtractedText);
    setErrorMsg(null);
  };

  const handleClearPpt = () => {
    setUploadedPpt(undefined);
  };

  const handleNametagChange = (val: string) => {
    const upper = val.toUpperCase();
    setNametagText(upper);
    if (characterSheet) {
      setCharacterSheet({
        ...characterSheet,
        characterName: upper,
      });
    }
    setErrorMsg(null);
  };

  const handleLoadSample = (sample: typeof SAMPLE_TOPICS[0]) => {
    setTopic(sample.title);
    setReferenceText(sample.referenceText);
    setUploadedPpt(undefined);
  };

  const handleConfirmAndStart = () => {
    if (!topic.trim()) {
      setErrorMsg('Sila masukkan tajuk topik utama pembentangan atau muat naik fail persembahan .PPTX.');
      setActiveTab('topic');
      return;
    }
    if (useNametag && !nametagText.trim()) {
      setErrorMsg('Sila masukkan nama untuk nametag (Wajib huruf besar sahaja).');
      setActiveTab('avatar');
      return;
    }

    setErrorMsg(null);
    onSaveAndGenerate({
      topic: topic.trim(),
      referenceText: referenceText.trim(),
      useNametag,
      nametagText: nametagText.trim().toUpperCase(),
      colorSchemeId,
      outputLanguage,
      presenterStyle,
      uploadedPpt,
      characterSheet,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B1729] border border-white/10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 bg-[#091322] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#06B6D4] to-[#34D399] text-[#091322] flex items-center justify-center shadow-lg shadow-[#06B6D4]/20 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">
                  LANGKAH PERTAMA WAJIB
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Konfigurasi &amp; Muat Naik Aset Slaid / Watak
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Penjana 45 Slaid, Video Veo &amp; Character Sheet
              </h2>
            </div>
          </div>

          {!isInitial && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Step Tabs */}
        <div className="grid grid-cols-5 border-b border-white/10 text-xs font-semibold bg-[#091322] text-center">
          <button
            type="button"
            onClick={() => setActiveTab('topic')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'topic'
                ? 'border-[#06B6D4] text-[#06B6D4] font-bold bg-[#0B1729]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1. Topik &amp; Upload PPT</span>
            <span className="sm:hidden">1. PPT</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('avatar')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'avatar'
                ? 'border-[#06B6D4] text-[#06B6D4] font-bold bg-[#0B1729]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2. Character Sheet</span>
            <span className="sm:hidden">2. Watak</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'colors'
                ? 'border-[#06B6D4] text-[#06B6D4] font-bold bg-[#0B1729]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3. Skim Warna (30)</span>
            <span className="sm:hidden">3. Warna</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'language'
                ? 'border-[#06B6D4] text-[#06B6D4] font-bold bg-[#0B1729]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">4. Bahasa Output</span>
            <span className="sm:hidden">4. Bahasa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('style')}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'style'
                ? 'border-[#06B6D4] text-[#06B6D4] font-bold bg-[#0B1729]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">5. Gaya Watak</span>
            <span className="sm:hidden">5. Gaya</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: TOPIK & PPT/PPTX UPLOAD */}
          {activeTab === 'topic' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* PPT Upload Component */}
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                  <span>Muat Naik Slaid PowerPoint (.PPTX / .PPT)</span>
                  {uploadedPpt && (
                    <span className="text-[#34D399] font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {uploadedPpt.slideCount} Slaid Diekstrak
                    </span>
                  )}
                </div>
                <PptUploadSection
                  uploadedPpt={uploadedPpt}
                  onPptParsed={handlePptParsed}
                  onClearPpt={handleClearPpt}
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Tajuk Topik Utama Pembentangan
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Keselamatan Siber & AI di Malaysia 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#091322] text-white text-sm focus:ring-2 focus:ring-[#06B6D4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Teks Rujukan / Kandungan Pembentangan (Pilihan)
                </label>
                <textarea
                  rows={3}
                  value={referenceText}
                  onChange={(e) => setReferenceText(e.target.value)}
                  placeholder="Tampal teks rujukan, sukatan pelajaran, nota mesyuarat, atau huraian modul di sini..."
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#091322] text-white text-xs font-mono focus:ring-2 focus:ring-[#06B6D4] focus:outline-none"
                />
              </div>

              {/* Sample Topic Presets */}
              {!uploadedPpt && (
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-2 font-mono">
                    Atau pilih contoh topik siap guna:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SAMPLE_TOPICS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLoadSample(sample)}
                        className="p-3 text-left rounded-xl border border-white/10 hover:border-[#06B6D4]/40 bg-[#091322] transition-all group"
                      >
                        <div className="text-xs font-bold text-slate-200 group-hover:text-[#06B6D4]">
                          {sample.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {sample.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CHARACTER SHEET WATAK AVATAR */}
          {activeTab === 'avatar' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <CharacterSheetSection
                characterSheet={characterSheet}
                onUpdateCharacterSheet={(cs) => {
                  setCharacterSheet(cs);
                  if (cs?.characterName) {
                    setNametagText(cs.characterName);
                  }
                }}
              />

              {/* Nametag Toggle Question */}
              <div className="p-4 rounded-xl bg-[#091322] border border-white/10 space-y-3">
                <div className="text-xs font-mono font-bold text-[#06B6D4] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Pengesahan Nametag Pada Pakaian Watak</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUseNametag(true)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      useNametag
                        ? 'ring-2 ring-[#06B6D4] border-[#06B6D4] bg-[#0B1729]'
                        : 'border-white/10 hover:border-white/20 bg-[#091322]/60'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">Gunakan Nametag ({nametagText})</div>
                      <div className="text-[10px] text-slate-400">Dicetak pada dada watak</div>
                    </div>
                    {useNametag && <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setUseNametag(false)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      !useNametag
                        ? 'ring-2 ring-[#06B6D4] border-[#06B6D4] bg-[#0B1729]'
                        : 'border-white/10 hover:border-white/20 bg-[#091322]/60'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">Tiada Nametag</div>
                      <div className="text-[10px] text-slate-400">Pakaian kemas tanpa teks</div>
                    </div>
                    {!useNametag && <CheckCircle2 className="w-4 h-4 text-[#06B6D4] shrink-0" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PILIHAN 30 SKIM WARNA */}
          {activeTab === 'colors' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                <span>Soalan Wajib 2: Pilihan Skim Warna (1 daripada 30 Skim Rasmi)</span>
                <span className="text-[#06B6D4]">Skim #{colorSchemeId} dipilih</span>
              </div>
              <ColorSchemePicker
                selectedId={colorSchemeId}
                onSelect={(id) => setColorSchemeId(id)}
              />
            </div>
          )}

          {/* TAB 4: PILIHAN BAHASA OUTPUT */}
          {activeTab === 'language' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs font-mono font-bold text-slate-300">
                Soalan Wajib 3: Pilihan Bahasa Output
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOutputLanguage('Bahasa Melayu Baku Malaysia')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    outputLanguage === 'Bahasa Melayu Baku Malaysia'
                      ? 'ring-2 ring-[#06B6D4] border-[#06B6D4] bg-[#091322]'
                      : 'border-white/10 hover:border-white/20 bg-[#091322]/60'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      Bahasa Melayu Baku Malaysia 🇲🇾
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Kosa kata rasmi Dewan Bahasa dan Pustaka (DBP), sebutan jelas dan standard korporat.
                    </div>
                  </div>
                  {outputLanguage === 'Bahasa Melayu Baku Malaysia' && (
                    <CheckCircle2 className="w-5 h-5 text-[#06B6D4] shrink-0" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setOutputLanguage('English')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    outputLanguage === 'English'
                      ? 'ring-2 ring-[#06B6D4] border-[#06B6D4] bg-[#091322]'
                      : 'border-white/10 hover:border-white/20 bg-[#091322]/60'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      English (International Standard) 🌐
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Professional executive presentation tone suitable for global and corporate workflows.
                    </div>
                  </div>
                  {outputLanguage === 'English' && (
                    <CheckCircle2 className="w-5 h-5 text-[#06B6D4] shrink-0" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: GAYA WATAK PEMBENTANG */}
          {activeTab === 'style' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-xs font-mono font-bold text-slate-300">
                Soalan Wajib 4: Pilihan Gaya Watak Pembentang
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPresenterStyle('Pixar 3D Style')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    presenterStyle === 'Pixar 3D Style'
                      ? 'ring-2 ring-[#06B6D4] border-[#06B6D4] bg-[#091322]'
                      : 'border-white/10 hover:border-white/20 bg-[#091322]/60'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      Pixar 3D Style
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Animasi 3D berestetika Pixar / Disney yang mesra, ekspresif, berwarna-warni, dan berkarisma tinggi.
                    </div>
                  </div>
                  {presenterStyle === 'Pixar 3D Style' && (
                    <CheckCircle2 className="w-5 h-5 text-[#06B6D4] shrink-0" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPresenterStyle('Photorealistic Style')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    presenterStyle === 'Photorealistic Style'
                      ? 'ring-2 ring-[#06B6D4] border-[#06B6D4] bg-[#091322]'
                      : 'border-white/10 hover:border-white/20 bg-[#091322]/60'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      Photorealistic Style
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Fotografi realistik studio 8K dengan pencahayaan sinematik dan tekstur manusia sebenar.
                    </div>
                  </div>
                  {presenterStyle === 'Photorealistic Style' && (
                    <CheckCircle2 className="w-5 h-5 text-[#06B6D4] shrink-0" />
                  )}
                </button>
              </div>

              {/* Summary Checklist */}
              <div className="p-4 rounded-xl bg-[#091322] border border-white/10 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                  Ringkasan Pilihan Anda:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-slate-300 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Slaid PPT:</span>
                    <span className="font-semibold text-white truncate block">
                      {uploadedPpt ? `${uploadedPpt.slideCount} Slaid` : 'Topik Tersuai'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Watak Avatar:</span>
                    <span className="font-semibold text-white truncate block">
                      {characterSheet?.characterName || 'DR. AIMAN'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Skim Warna:</span>
                    <span className="font-semibold text-white">Skim #{colorSchemeId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Bahasa:</span>
                    <span className="font-semibold text-white">
                      {outputLanguage === 'English' ? 'English' : 'BM Baku'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Gaya:</span>
                    <span className="font-semibold text-white truncate block">
                      {presenterStyle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#091322] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {activeTab !== 'topic' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'style') setActiveTab('language');
                  else if (activeTab === 'language') setActiveTab('colors');
                  else if (activeTab === 'colors') setActiveTab('avatar');
                  else if (activeTab === 'avatar') setActiveTab('topic');
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-white/10 text-slate-300 hover:bg-[#0B1729]"
              >
                Kembali
              </button>
            )}

            {activeTab !== 'style' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'topic') setActiveTab('avatar');
                  else if (activeTab === 'avatar') setActiveTab('colors');
                  else if (activeTab === 'colors') setActiveTab('language');
                  else if (activeTab === 'language') setActiveTab('style');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#0B1729] border border-white/10 text-slate-200 hover:bg-[#13233a]"
              >
                Seterusnya
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleConfirmAndStart}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#34D399] text-[#091322] hover:opacity-90 shadow-lg shadow-[#06B6D4]/20 flex items-center justify-center gap-2 transition-all font-sans"
          >
            <span>Mula Jana Keseluruhan 45 Slaid</span>
            <ArrowRight className="w-4 h-4 text-[#091322]" />
          </button>
        </div>
      </div>
    </div>
  );
};
