import React, { useState } from 'react';
import { SlideData, SetupConfig, CharacterSheetData } from '../types';
import { SlideVisualMockup } from './SlideVisualMockup';
import { generateNanoBanana2Image, downloadImage } from '../utils/imageRenderer';
import { getPresenterTeachingPoseMalay } from '../utils/slideGenerator';
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Video,
  Mic,
  Download,
  RefreshCw,
  Maximize2,
  X,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  ExternalLink,
  User,
  Shuffle
} from 'lucide-react';

interface SlideCardProps {
  slide: SlideData;
  config: SetupConfig;
  onOpenTeleprompter: (slide: SlideData) => void;
  onUpdateSlideImage?: (slideNumber: number, imageUrl: string, source: string) => void;
  onUpdateSlideAvatar?: (slideNumber: number, avatar: CharacterSheetData) => void;
}

export const SlideCard: React.FC<SlideCardProps> = ({
  slide,
  config,
  onOpenTeleprompter,
  onUpdateSlideImage,
  onUpdateSlideAvatar,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showVisualMockup, setShowVisualMockup] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'image' | 'veo10' | 'veo5' | 'script'>('all');

  // Image Generation State
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    slide.generatedImageUrl || null
  );
  const [imageSource, setImageSource] = useState<string>(
    slide.imageSource || 'Nano Banana 2'
  );
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSpeakScript = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(slide.scriptAvatar30s);
    utterance.lang = config.outputLanguage === 'English' ? 'en-US' : 'ms-MY';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const result = await generateNanoBanana2Image(slide, config);
      setGeneratedImageUrl(result.imageUrl);
      setImageSource(
        result.source === 'gemini-nanobanana-2'
          ? 'Gemini Nano Banana 2 (Flash Image)'
          : result.source === 'gemini-nanobanana-lite'
          ? 'Gemini Nano Banana Lite'
          : 'Pakar Penjana HD Synthesizer (1080p)'
      );

      if (onUpdateSlideImage) {
        onUpdateSlideImage(slide.slideNumber, result.imageUrl, result.source);
      }
    } catch (err: any) {
      console.error('Error generating slide image:', err);
      setImageError(err.message || 'Gagal menjana imej');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadGeneratedImage = () => {
    if (!generatedImageUrl) return;
    const cleanTitle = slide.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .slice(0, 30);
    const filename = `Slaid_${slide.slideNumber}_NanoBanana2_${cleanTitle}.png`;
    downloadImage(generatedImageUrl, filename);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const teachingPose = getPresenterTeachingPoseMalay(slide.slideNumber, slide.isMcq);

  return (
    <div
      id={`slide-card-${slide.slideNumber}`}
      className="rounded-2xl border border-white/10 bg-[#0B1729] shadow-xl overflow-hidden transition-all hover:border-[#06B6D4]/30"
    >
      {/* Slide Card Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-[#091322]/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                slide.isMcq
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/30'
              }`}
            >
              {slide.isMcq ? `SLAID ${slide.slideNumber} • SOALAN MCQ` : `SLAID ${slide.slideNumber}`}
            </span>

            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#091322] text-slate-300 border border-white/10">
              Watak: {slide.characterPosition}
            </span>

            {/* Assigned Avatar Badge (from 4 Uploaded Avatars) */}
            {slide.assignedAvatar ? (
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/40 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#06B6D4]" />
                  <span>
                    Watak #{slide.avatarSlot || 1}: {slide.assignedAvatar.characterName}
                  </span>
                </span>

                {config.uploadedAvatars && config.uploadedAvatars.length > 1 && onUpdateSlideAvatar && (
                  <select
                    value={slide.avatarSlot || 1}
                    onChange={(e) => {
                      const selectedSlot = Number(e.target.value);
                      const targetAv = config.uploadedAvatars?.find((a) => (a.slotNumber || 1) === selectedSlot) || config.uploadedAvatars?.[selectedSlot - 1];
                      if (targetAv) {
                        onUpdateSlideAvatar(slide.slideNumber, targetAv);
                      }
                    }}
                    className="bg-[#091322] text-[10px] text-slate-300 border border-white/15 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#06B6D4]"
                    title="Tukar watak pembentang bagi slaid ini"
                  >
                    {config.uploadedAvatars.map((av, avIdx) => (
                      <option key={av.id || avIdx} value={av.slotNumber || avIdx + 1}>
                        Slot {av.slotNumber || avIdx + 1}: {av.characterName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : config.characterSheet ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/40 flex items-center gap-1">
                <User className="w-3 h-3 text-[#06B6D4]" />
                <span>Watak: {config.characterSheet.characterName}</span>
              </span>
            ) : null}

            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#091322] text-slate-300 border border-white/10">
              {slide.imageSize} • {slide.ethnicity}
            </span>

            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              {teachingPose.title}
            </span>

            {config.useNametag && (slide.assignedAvatar?.characterName || config.nametagText) && (
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/30 uppercase">
                Nametag: {slide.assignedAvatar?.characterName || config.nametagText}
              </span>
            )}

            {generatedImageUrl && (
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Imej Terjana
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white">
            {slide.title}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          {/* Quick Generate / Download Image Button */}
          {generatedImageUrl ? (
            <button
              type="button"
              onClick={handleDownloadGeneratedImage}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 flex items-center gap-1.5 transition-all shadow-xs"
              title="Muat Turun Imej PNG Terjana"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Dimuat Turun!' : 'Muat Turun Imej'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              title="Jana Imej Nano Banana 2 sekarang"
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menjana...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Jana Imej</span>
                </>
              )}
            </button>
          )}

          {/* Toggle Visual Mockup */}
          <button
            type="button"
            onClick={() => setShowVisualMockup(!showVisualMockup)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border flex items-center gap-1.5 transition-all ${
              showVisualMockup
                ? 'bg-[#06B6D4] border-[#06B6D4] text-[#091322] font-bold shadow-xs'
                : 'border-white/10 text-slate-300 hover:bg-[#091322] hover:border-white/20'
            }`}
          >
            {showVisualMockup ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showVisualMockup ? 'Tutup Visual' : 'Lihat Susun Atur'}</span>
          </button>

          {/* Audio TTS */}
          <button
            type="button"
            onClick={handleSpeakScript}
            className={`p-2 text-xs font-medium rounded-xl border transition-all ${
              isSpeaking
                ? 'bg-[#34D399] text-[#091322] border-[#34D399] font-bold animate-pulse'
                : 'border-white/10 text-slate-300 hover:bg-[#091322] hover:border-white/20'
            }`}
            title="Dengar Bacaan Audio Skrip 30 Saat"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Teleprompter Mode */}
          <button
            type="button"
            onClick={() => onOpenTeleprompter(slide)}
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-white/10 text-slate-300 hover:bg-[#091322] hover:border-white/20 flex items-center gap-1.5 transition-all"
            title="Buka Teleprompter 30 Saat"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Teleprompter</span>
          </button>

          {/* Copy Full Slide */}
          <button
            type="button"
            onClick={() => copyToClipboard(slide.fullFormattedBlock, `full-${slide.slideNumber}`)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0284C7] text-white hover:opacity-90 flex items-center gap-1.5 shadow-sm border border-[#06B6D4]/30"
          >
            {copiedKey === `full-${slide.slideNumber}` ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Penuh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Slide Mockup (When expanded) */}
      {showVisualMockup && (
        <div className="p-4 sm:p-6 bg-[#091322] border-b border-white/10 animate-in fade-in zoom-in-95 duration-150">
          <div className="max-w-3xl mx-auto">
            <SlideVisualMockup slide={slide} config={config} />
          </div>
        </div>
      )}

      {/* Tabs Filter for Prompts */}
      <div className="flex border-b border-white/10 bg-[#091322]/50 text-xs font-medium overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-[#06B6D4] text-[#06B6D4] font-bold bg-[#0B1729]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Semua 4 Format Rasmi
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={`px-4 py-2.5 whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'image'
              ? 'border-[#06B6D4] text-[#06B6D4] font-bold bg-[#0B1729]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Prompt Imej (Nano Banana 2) {generatedImageUrl && '✓'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('veo10')}
          className={`px-4 py-2.5 whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'veo10'
              ? 'border-[#06B6D4] text-[#06B6D4] font-bold bg-[#0B1729]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Veo 10s (Versi 1)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('veo5')}
          className={`px-4 py-2.5 whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'veo5'
              ? 'border-[#06B6D4] text-[#06B6D4] font-bold bg-[#0B1729]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Veo 5s (Versi 2)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('script')}
          className={`px-4 py-2.5 whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'script'
              ? 'border-[#34D399] text-[#34D399] font-bold bg-[#0B1729]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          4. Skrip Avatar 30s
        </button>
      </div>

      {/* Prompts Content Section */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* 1. NANO BANANA 2 IMAGE PROMPT & GENERATION SECTION */}
        {(activeTab === 'all' || activeTab === 'image') && (
          <div className="rounded-xl border border-white/10 bg-[#091322]/80 p-4 sm:p-5 space-y-4 relative group">
            {/* Header with Prompt label and Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                1. [Teks Prompt Imej Slaid (Nano Banana 2)]
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {/* Salin Prompt Button */}
                <button
                  type="button"
                  onClick={() => copyToClipboard(slide.promptNanoBanana2, `img-${slide.slideNumber}`)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-[#0B1729] border border-white/10 text-slate-300 hover:text-[#06B6D4] hover:border-[#06B6D4]/40 flex items-center gap-1 shadow-xs transition-all"
                >
                  {copiedKey === `img-${slide.slideNumber}` ? (
                    <>
                      <Check className="w-3 h-3 text-[#34D399]" />
                      <span className="text-[#34D399]">Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Salin Prompt</span>
                    </>
                  )}
                </button>

                {/* Jana Imej Nano Banana 2 Button */}
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg flex items-center gap-1.5 shadow-md transition-all ${
                    isGeneratingImage
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110'
                  }`}
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menjana Imej Nano Banana 2...</span>
                    </>
                  ) : generatedImageUrl ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Jana Semula Imej</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>Jana Imej (Nano Banana 2)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Prompt Text Box */}
            <p className="text-xs leading-relaxed text-slate-300 font-mono bg-[#0B1729] p-3 rounded-lg border border-white/5 select-all">
              {slide.promptNanoBanana2}
            </p>

            {/* Error Message if any */}
            {imageError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                <span>{imageError}</span>
                <button
                  type="button"
                  onClick={() => setImageError(null)}
                  className="text-rose-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {/* GENERATED IMAGE CARD & DOWNLOAD AREA */}
            {isGeneratingImage && !generatedImageUrl && (
              <div className="p-8 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 text-center space-y-3 animate-pulse">
                <Loader2 className="w-8 h-8 text-amber-400 mx-auto animate-spin" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-300">
                    Sedang Menjana Imej Nano Banana 2 (16:9 • 1080p)...
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Memproses tipografi tanpa ralat, nametag, watak avatar, dan skema warna rasmi Slaid {slide.slideNumber}.
                  </div>
                </div>
              </div>
            )}

            {generatedImageUrl && (
              <div className="rounded-xl border border-white/10 bg-[#0B1729] overflow-hidden shadow-2xl space-y-3 p-3 sm:p-4">
                {/* Image Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">
                      Imej Terjana Slaid {slide.slideNumber}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                      {imageSource}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Fullscreen */}
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#091322] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 flex items-center gap-1 transition-all"
                      title="Lihat Saiz Penuh"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Saiz Penuh</span>
                    </button>

                    {/* Download PNG Button */}
                    <button
                      type="button"
                      onClick={handleDownloadGeneratedImage}
                      className="px-3 py-1 text-[11px] font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:brightness-110 flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadSuccess ? 'Berjaya Dimuat Turun!' : 'Muat Turun Imej (PNG)'}</span>
                    </button>
                  </div>
                </div>

                {/* High-Resolution Image Container */}
                <div
                  className="relative group/preview rounded-lg overflow-hidden border border-white/10 bg-black cursor-pointer aspect-video"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={generatedImageUrl}
                    alt={`Slaid ${slide.slideNumber} - ${slide.title}`}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover/preview:scale-[1.01]"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <span className="px-3 py-1.5 rounded-xl bg-black/80 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs border border-white/20">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Klik Untuk Zum Saiz Penuh (1920x1080)
                    </span>
                  </div>
                </div>

                {/* Image Details Footer */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>
                    Format: <strong>PNG 16:9 Widescreen (1080p)</strong>
                  </span>
                  <span>
                    Watak: <strong>{slide.characterPosition}</strong> • Nametag:{' '}
                    <strong>{config.useNametag ? config.nametagText : 'Tiada'}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. VEO 10-SECOND MOTION GRAPHICS PROMPT */}
        {(activeTab === 'all' || activeTab === 'veo10') && (
          <div className="rounded-xl border border-white/10 bg-[#091322]/80 p-4 space-y-2 relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Video className="w-3.5 h-3.5 text-purple-400" />
                2. [Teks Prompt Animasi Slaid 10 Saat (Veo - Versi 1)]
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(slide.promptVeo10s, `veo10-${slide.slideNumber}`)}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#0B1729] border border-white/10 text-slate-300 hover:text-purple-400 hover:border-purple-400/40 flex items-center gap-1 shadow-xs transition-all"
              >
                {copiedKey === `veo10-${slide.slideNumber}` ? (
                  <>
                    <Check className="w-3 h-3 text-[#34D399]" />
                    <span className="text-[#34D399]">Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Salin Veo 10s</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-mono bg-[#0B1729] p-3 rounded-lg border border-white/5 select-all">
              {slide.promptVeo10s}
            </p>
          </div>
        )}

        {/* 3. VEO 5-SECOND FAST MOTION GRAPHICS PROMPT */}
        {(activeTab === 'all' || activeTab === 'veo5') && (
          <div className="rounded-xl border border-white/10 bg-[#091322]/80 p-4 space-y-2 relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                3. [Teks Prompt Animasi Slaid 5 Saat (Veo - Versi 2)]
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(slide.promptVeo5s, `veo5-${slide.slideNumber}`)}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#0B1729] border border-white/10 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 flex items-center gap-1 shadow-xs transition-all"
              >
                {copiedKey === `veo5-${slide.slideNumber}` ? (
                  <>
                    <Check className="w-3 h-3 text-[#34D399]" />
                    <span className="text-[#34D399]">Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Salin Veo 5s</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-mono bg-[#0B1729] p-3 rounded-lg border border-white/5 select-all">
              {slide.promptVeo5s}
            </p>
          </div>
        )}

        {/* 4. 30-SECOND AVATAR EXPLANATION SCRIPT */}
        {(activeTab === 'all' || activeTab === 'script') && (
          <div className="rounded-xl border border-[#34D399]/30 bg-[#34D399]/5 p-4 space-y-2 relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#34D399] flex items-center gap-1.5 font-mono">
                <Mic className="w-3.5 h-3.5 text-[#34D399]" />
                4. [Ayat Dialog Penerangan Avatar (Untuk 30 Saat)]
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSpeakScript}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#0B1729] border border-[#34D399]/40 text-[#34D399] hover:bg-[#34D399]/10 flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Main Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(slide.scriptAvatar30s, `script-${slide.slideNumber}`)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-[#0B1729] border border-[#34D399]/40 text-[#34D399] hover:bg-[#34D399]/10 flex items-center gap-1"
                >
                  {copiedKey === `script-${slide.slideNumber}` ? (
                    <>
                      <Check className="w-3 h-3 text-[#34D399]" />
                      <span className="text-[#34D399]">Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin Skrip</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-200 bg-[#0B1729] p-3.5 rounded-lg border border-[#34D399]/20 select-all italic">
              "{slide.scriptAvatar30s}"
            </p>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && generatedImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative max-w-6xl w-full bg-[#0B1729] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 bg-[#091322] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#06B6D4] font-bold">
                  SLAID {slide.slideNumber} • NANO BANANA 2 VISUAL HD
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {slide.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadGeneratedImage}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:brightness-110 flex items-center gap-1.5 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Muat Turun PNG (1080p)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 sm:p-6 overflow-auto flex-1 flex items-center justify-center bg-black/60">
              <img
                src={generatedImageUrl}
                alt={`Slaid ${slide.slideNumber}`}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
