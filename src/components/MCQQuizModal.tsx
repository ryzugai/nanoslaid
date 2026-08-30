import React, { useState } from 'react';
import { SlideData } from '../types';
import { CheckCircle2, XCircle, Award, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface MCQQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  mcqSlides: SlideData[];
}

export const MCQQuizModal: React.FC<MCQQuizModalProps> = ({
  isOpen,
  onClose,
  mcqSlides,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  if (!isOpen || mcqSlides.length === 0) return null;

  const currentSlide = mcqSlides[currentIndex];
  const mcq = currentSlide?.mcqDetails;
  const slideNum = currentSlide?.slideNumber;

  const currentSelection = selectedAnswers[slideNum];
  const isRevealed = !!showExplanation[slideNum];
  const isCorrect = currentSelection && mcq && currentSelection === mcq.correctOption;

  const handleSelectOption = (label: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers((prev) => ({ ...prev, [slideNum]: label }));
    setShowExplanation((prev) => ({ ...prev, [slideNum]: true }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
  };

  // Calculate score
  const totalAnswered = Object.keys(selectedAnswers).length;
  const totalCorrect = mcqSlides.reduce((acc, s) => {
    if (s.mcqDetails && selectedAnswers[s.slideNumber] === s.mcqDetails.correctOption) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0B1729] border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#091322] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-[#091322] flex items-center justify-center shadow-md font-bold">
              <Award className="w-5 h-5 text-[#091322]" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                SIMULASI UJI MINDA INTERAKTIF (SLAID 31 - 45)
              </div>
              <h3 className="text-base font-bold text-white">
                Soalan {currentIndex + 1} daripada {mcqSlides.length}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
              SKOR: {totalCorrect} / {totalAnswered}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Quiz Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Question Card */}
          <div className="p-5 rounded-2xl bg-[#091322] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>SLAID #{currentSlide.slideNumber}</span>
              <span>WATAK: {currentSlide.characterPosition}</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              {mcq?.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {mcq?.options.map((opt) => {
              const isSelected = currentSelection === opt.label;
              const isCorrectOpt = opt.label === mcq.correctOption;

              let optionClasses =
                'border-white/10 hover:border-white/20 bg-[#091322]/80 text-slate-200';
              let badgeClasses = 'bg-[#0B1729] text-slate-300 border border-white/10 font-mono';

              if (isRevealed) {
                if (isCorrectOpt) {
                  optionClasses =
                    'border-[#34D399] bg-[#34D399]/10 text-white ring-1 ring-[#34D399]';
                  badgeClasses = 'bg-[#34D399] text-[#091322] font-mono font-bold';
                } else if (isSelected && !isCorrectOpt) {
                  optionClasses =
                    'border-rose-500/80 bg-rose-500/10 text-white ring-1 ring-rose-500';
                  badgeClasses = 'bg-rose-500 text-white font-mono font-bold';
                }
              } else if (isSelected) {
                optionClasses = 'border-[#06B6D4] bg-[#06B6D4]/10 ring-1 ring-[#06B6D4] text-white';
                badgeClasses = 'bg-[#06B6D4] text-[#091322] font-mono font-bold';
              }

              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSelectOption(opt.label)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${optionClasses}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${badgeClasses}`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-xs sm:text-sm font-medium pt-0.5">{opt.text}</span>
                  </div>

                  {isRevealed && (
                    <div className="shrink-0 pt-0.5">
                      {isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-[#34D399]" />}
                      {isSelected && !isCorrectOpt && (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box when revealed */}
          {isRevealed && mcq && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 animate-in fade-in duration-200 text-xs">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 font-mono">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                PENDEDAHAN JAWAPAN ANIMASI VEO: PILIHAN {mcq.correctOption}
              </div>
              <p className="text-slate-200 leading-relaxed">
                {mcq.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-white/10 bg-[#091322] flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-white/10 text-slate-300 hover:bg-[#0B1729] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mula Semula</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-white/10 text-slate-300 hover:bg-[#0B1729] disabled:opacity-40"
            >
              Sebelumnya
            </button>

            <button
              type="button"
              disabled={currentIndex === mcqSlides.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(mcqSlides.length - 1, prev + 1))}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#34D399] text-[#091322] hover:opacity-90 shadow-md disabled:opacity-40 flex items-center gap-1.5 font-sans"
            >
              <span>Seterusnya</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#091322]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
