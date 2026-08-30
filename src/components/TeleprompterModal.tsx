import React, { useState, useEffect } from 'react';
import { SlideData, SetupConfig } from '../types';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, User } from 'lucide-react';

interface TeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide: SlideData | null;
  config: SetupConfig;
}

export const TeleprompterModal: React.FC<TeleprompterModalProps> = ({
  isOpen,
  onClose,
  slide,
  config,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(30);
      setIsRunning(false);
      setIsSpeaking(false);
    }
  }, [isOpen, slide]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isOpen || !slide) return null;

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setSecondsLeft(30);
    setIsRunning(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleToggleSpeak = () => {
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
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsRunning(false);
    };
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsRunning(true);
  };

  const getFontSizeClass = () => {
    if (fontSize === 'huge') return 'text-2xl sm:text-3xl leading-loose';
    if (fontSize === 'large') return 'text-xl sm:text-2xl leading-relaxed';
    return 'text-base sm:text-lg leading-normal';
  };

  const progressPercentage = ((30 - secondsLeft) / 30) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B1729] border border-white/10 text-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#091322] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#06B6D4] to-[#34D399] text-[#091322] flex items-center justify-center shadow-md font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-[#34D399] uppercase tracking-wider">
                TELEPROMPTER AVATAR 30 SAAT • SLAID #{slide.slideNumber}
              </div>
              <h3 className="text-base font-bold text-white line-clamp-1">
                {slide.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
          >
            ✕
          </button>
        </div>

        {/* 30-Second Countdown Banner */}
        <div className="bg-[#091322] px-6 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black font-mono tracking-tight text-[#34D399]">
              00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
            </div>
            <div className="text-xs font-mono text-slate-400">
              {secondsLeft === 0 ? 'MASA TAMAT (30S)!' : 'Masa Lisan Sasaran (30s)'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-mono text-slate-400 mr-1">Saiz:</div>
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 text-xs rounded font-mono ${fontSize === 'normal' ? 'bg-[#06B6D4] text-[#091322] font-bold' : 'text-slate-400 bg-[#0B1729] border border-white/10'}`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 text-sm rounded font-mono ${fontSize === 'large' ? 'bg-[#06B6D4] text-[#091322] font-bold' : 'text-slate-400 bg-[#0B1729] border border-white/10'}`}
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('huge')}
              className={`px-2 py-1 text-base rounded font-mono ${fontSize === 'huge' ? 'bg-[#06B6D4] text-[#091322] font-bold' : 'text-slate-400 bg-[#0B1729] border border-white/10'}`}
            >
              A++
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#091322] h-1.5 border-b border-white/5">
          <div
            className="bg-gradient-to-r from-[#06B6D4] to-[#34D399] h-full transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Teleprompter Script Area */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-[#091322] flex flex-col justify-center text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1729] border border-white/10 text-xs font-mono text-[#06B6D4]">
              <User className="w-3.5 h-3.5" />
              <span>Watak pada kedudukan {slide.characterPosition}</span>
              {config.useNametag && config.nametagText && (
                <span>• Nametag [{config.nametagText.toUpperCase()}]</span>
              )}
            </div>

            <p className={`font-serif tracking-wide text-slate-100 ${getFontSizeClass()} select-none`}>
              "{slide.scriptAvatar30s}"
            </p>
          </div>
        </div>

        {/* Teleprompter Controls */}
        <div className="p-5 border-t border-white/10 bg-[#091322] flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#0B1729] border border-white/10 hover:bg-white/10 text-slate-200 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Set Semula 30s</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleSpeak}
              className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all font-mono ${
                isSpeaking
                  ? 'bg-[#34D399] border-[#34D399] text-[#091322] animate-pulse font-bold'
                  : 'border-white/10 bg-[#0B1729] text-slate-200 hover:bg-[#13233a]'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#06B6D4]" />}
              <span>{isSpeaking ? 'Henti Audio' : 'Bacaan Audio (TTS)'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleTimer}
              className={`px-6 py-2 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-all font-sans ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-[#091322]'
                  : 'bg-gradient-to-r from-[#06B6D4] to-[#34D399] text-[#091322] hover:opacity-90'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Jeda Pemasa' : 'Mula Pemasa 30s'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
