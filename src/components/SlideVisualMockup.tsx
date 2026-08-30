import React from 'react';
import { SlideData, SetupConfig, InfographicArchetype } from '../types';
import { OFFICIAL_COLOR_SCHEMES } from '../data/colorSchemes';
import { getPresenterTeachingPoseMalay } from '../utils/slideGenerator';
import { PresenterAvatarView } from './PresenterAvatarView';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Cpu,
  TrendingUp,
  HelpCircle,
  Layers,
  Award,
  BarChart3,
  Calendar,
  Share2,
  ShieldCheck,
  RotateCw,
  Scale
} from 'lucide-react';

interface SlideVisualMockupProps {
  slide: SlideData;
  config: SetupConfig;
}

export const SlideVisualMockup: React.FC<SlideVisualMockupProps> = ({ slide, config }) => {
  const scheme =
    OFFICIAL_COLOR_SCHEMES.find((s) => s.id === config.colorSchemeId) ||
    OFFICIAL_COLOR_SCHEMES[0];

  const primaryAccent = scheme.accentHexes[0] || '#06B6D4';
  const secondaryAccent = scheme.accentHexes[1] || '#3B82F6';
  const isDark = scheme.mode === 'Dark Mode' || slide.colorSchemeHex?.startsWith('#0') || slide.colorSchemeHex?.startsWith('#1');
  const isLeft = slide.characterPosition === 'KIRI';

  const archetype: InfographicArchetype =
    slide.infographicType ||
    slide.infographicMeta?.archetype ||
    'BENTO_GRID';

  const teachingPose = getPresenterTeachingPoseMalay(slide.slideNumber, slide.isMcq);

  return (
    <div
      className={`w-full aspect-[16/9] rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-2xl flex flex-col justify-between select-none transition-all border ${
        isDark
          ? 'bg-[#0B0F19] text-slate-100 border-slate-800'
          : 'bg-[#F8FAFC] text-slate-900 border-slate-200'
      }`}
    >
      {/* Ambient Gradient Background & Abstract Geometric Waves */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: isDark
            ? `radial-gradient(circle at ${isLeft ? '20%' : '80%'} 40%, ${primaryAccent}25 0%, ${secondaryAccent}10 60%, transparent 85%)`
            : `radial-gradient(circle at ${isLeft ? '20%' : '80%'} 40%, #FFFFFF 0%, #F1F5F9 60%, #E2E8F0 100%)`,
        }}
      />

      {/* Dynamic Abstract Geometric Vector Waves */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0,70 Q350,10 700,100 T1400,60 T2000,140"
          fill="none"
          stroke={primaryAccent}
          strokeWidth="2"
        />
        <path
          d="M0,200 Q450,300 900,160 T1800,240"
          fill="none"
          stroke={secondaryAccent}
          strokeWidth="1.5"
          strokeDasharray="6,6"
        />
      </svg>

      {/* Main Slide Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        
        {/* Top Header Section */}
        <div className="w-full space-y-1">
          <div className="flex items-center justify-between">
            {/* Category Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-xs border border-white/20">
              {slide.isMcq ? (
                <>
                  <HelpCircle className="w-3 h-3 text-amber-400" />
                  <span>Soalan Uji Minda • Slaid {slide.slideNumber}</span>
                </>
              ) : (
                <>
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span>Slaid {slide.slideNumber} • {archetype.replace('_', ' ')}</span>
                </>
              )}
            </div>

            {/* Teaching Gesture Badge */}
            <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
              Posisi: {slide.characterPosition} • {teachingPose.title}
            </div>
          </div>

          {/* Big Bold Gradient Title */}
          <h2
            className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-tight line-clamp-2"
            style={{
              backgroundImage: isDark
                ? `linear-gradient(135deg, #FFFFFF, ${primaryAccent})`
                : `linear-gradient(135deg, #0F172A, #334155)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {slide.title}
          </h2>
        </div>

        {/* Central Workspace Area: 2-Column Split (Avatar Presenter + Infographics / Quiz) */}
        <div className="relative flex-1 flex items-stretch gap-4 my-2 w-full overflow-hidden">
          
          {/* Avatar Column (When Positioned on Left) */}
          {isLeft && (
            <div className="w-[26%] sm:w-[24%] shrink-0 flex flex-col justify-end items-center h-full">
              <PresenterAvatarView slide={slide} config={config} isLeft={true} />
            </div>
          )}

          {/* Main Diagram / Infographic / Quiz Content (Takes 74-76% width) */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {slide.isMcq && slide.mcqDetails ? (
              /* MCQ Quiz Interface */
              <div className="space-y-2.5">
                <div
                  className={`p-3 sm:p-4 rounded-xl border shadow-lg ${
                    isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                  style={{ borderLeft: `5px solid ${primaryAccent}` }}
                >
                  <p className="text-sm sm:text-base md:text-lg font-black leading-snug">
                    {slide.mcqDetails.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {slide.mcqDetails.options.map((opt) => (
                    <div
                      key={opt.label}
                      className={`p-2.5 sm:p-3 rounded-lg border flex items-center gap-2.5 shadow-xs ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <span
                        className="w-6 sm:w-7 h-6 sm:h-7 rounded-md flex items-center justify-center font-mono font-black text-xs sm:text-sm shrink-0 text-white shadow-xs"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
                        }}
                      >
                        {opt.label}
                      </span>
                      <span className="text-xs sm:text-sm font-bold leading-tight">
                        {opt.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : archetype === 'PROCESS_FLOW' && slide.infographicMeta?.steps ? (
              /* 1. PROCESS FLOW: Step-by-Step Flow */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {slide.infographicMeta.steps.map((step, idx) => (
                  <div
                    key={step.step}
                    className={`p-2.5 sm:p-3 rounded-xl border flex flex-col justify-between shadow-md ${
                      isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderTop: `4px solid ${idx % 2 === 0 ? primaryAccent : secondaryAccent}` }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-black uppercase text-cyan-400">
                          Langkah {step.step}
                        </span>
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] text-white shadow-xs"
                          style={{
                            backgroundColor: idx % 2 === 0 ? primaryAccent : secondaryAccent,
                          }}
                        >
                          {step.step}
                        </div>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black mb-1 line-clamp-1">{step.title}</h4>
                      <p className="text-[11px] sm:text-xs font-medium opacity-85 leading-relaxed line-clamp-3">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : archetype === 'STAT_METRIC_GAUGE' && slide.infographicMeta?.stats ? (
              /* 2. STAT METRICS: Quantitative Cards */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {slide.infographicMeta.stats.map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-3 sm:p-4 rounded-xl border text-center flex flex-col justify-between shadow-md ${
                      isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderBottom: `4px solid ${idx === 0 ? primaryAccent : secondaryAccent}` }}
                  >
                    <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase opacity-75 mb-1">
                      <BarChart3 className="w-3.5 h-3.5" style={{ color: primaryAccent }} />
                      <span className="truncate">{st.label}</span>
                    </div>
                    <div
                      className="text-xl sm:text-2xl md:text-3xl font-black font-mono my-1 tracking-tight"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {st.value}
                    </div>
                    {st.change && (
                      <div className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mx-auto bg-emerald-500/20 text-emerald-400">
                        {st.change}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : archetype === 'MULTI_PILLAR' && slide.infographicMeta?.pillars ? (
              /* 3. MULTI PILLAR: Core Strategic Pillars */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {slide.infographicMeta.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex flex-col justify-between shadow-md ${
                      isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderTop: `4px solid ${idx === 1 ? secondaryAccent : primaryAccent}` }}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Shield className="w-3.5 h-3.5" style={{ color: primaryAccent }} />
                        <span className="text-[10px] font-mono font-bold uppercase opacity-80">Tiang {idx + 1}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black mb-1 line-clamp-1">{pillar.title}</h4>
                      <p className="text-[11px] sm:text-xs font-medium opacity-85 leading-relaxed line-clamp-3">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : archetype === 'COMPARISON_MATRIX' && slide.infographicMeta?.comparison ? (
              /* 4. COMPARISON MATRIX */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                  style={{ borderLeft: `4px solid ${primaryAccent}` }}
                >
                  <h4 className="text-xs sm:text-sm font-black mb-2 flex items-center gap-1.5 text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{slide.infographicMeta.comparison.leftTitle}</span>
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs">
                    {slide.infographicMeta.comparison.leftItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`p-3 rounded-xl border ${
                    isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                  style={{ borderLeft: `4px solid ${secondaryAccent}` }}
                >
                  <h4 className="text-xs sm:text-sm font-black mb-2 flex items-center gap-1.5 text-blue-400">
                    <Scale className="w-3.5 h-3.5" />
                    <span>{slide.infographicMeta.comparison.rightTitle}</span>
                  </h4>
                  <ul className="space-y-1.5 text-[11px] sm:text-xs">
                    {slide.infographicMeta.comparison.rightItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-blue-400 font-bold">•</span>
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : archetype === 'TIMELINE_ROADMAP' && slide.infographicMeta?.phases ? (
              /* 6. TIMELINE ROADMAP */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {slide.infographicMeta.phases.map((ph, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between shadow-xs ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderTop: `4px solid ${idx % 2 === 0 ? primaryAccent : secondaryAccent}` }}
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 mb-0.5 block">
                        {ph.phase}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black mb-1 line-clamp-1">{ph.milestone}</h4>
                      <p className="text-[11px] font-medium opacity-85 leading-relaxed line-clamp-3">
                        {ph.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : archetype === 'BENTO_GRID' && slide.infographicMeta?.bento ? (
              /* 11. BENTO GRID */
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div
                    className={`sm:col-span-2 p-3 rounded-xl border shadow-sm ${
                      isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderLeft: `5px solid ${primaryAccent}` }}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-cyan-400 mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Sorotan Strategik</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black mb-1">{slide.infographicMeta.bento.spotlightTitle}</h4>
                    <p className="text-xs font-medium opacity-90 leading-relaxed line-clamp-2">
                      {slide.infographicMeta.bento.spotlightDesc}
                    </p>
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-between">
                    <div
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] font-bold opacity-70 truncate">{slide.infographicMeta.bento.metric1.label}</div>
                      <div className="text-sm font-black font-mono text-cyan-400">
                        {slide.infographicMeta.bento.metric1.value}
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] font-bold opacity-70 truncate">{slide.infographicMeta.bento.metric2.label}</div>
                      <div className="text-sm font-black font-mono text-emerald-400">
                        {slide.infographicMeta.bento.metric2.value}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-2 rounded-lg border flex items-center gap-2 ${
                    isDark ? 'bg-cyan-950/30 border-cyan-800/40' : 'bg-cyan-50 border-cyan-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <p className="text-xs font-bold text-cyan-300 leading-snug truncate">
                    <span className="font-black text-cyan-200">Kunci: </span>
                    {slide.infographicMeta.bento.takeaway}
                  </p>
                </div>
              </div>
            ) : (
              /* Fallback Key Points */
              <div className="space-y-2">
                {(slide.infographicPoints && slide.infographicPoints.length > 0
                  ? slide.infographicPoints
                  : [
                      'Analisis terperinci dan penjajaran kandungan modul.',
                      'Penerangan langkah pelaksanaan dan aplikasi praktikal.',
                      'Pemantauan kualiti dan jaminan keberhasilan.',
                    ]
                )
                  .slice(0, 3)
                  .map((point, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 sm:p-3 rounded-xl border shadow-xs flex items-center gap-3 ${
                        isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                      style={{
                        borderLeft: `5px solid ${idx === 0 ? primaryAccent : secondaryAccent}`,
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs text-white shrink-0 shadow-xs"
                        style={{
                          backgroundColor: idx === 0 ? primaryAccent : secondaryAccent,
                        }}
                      >
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold leading-snug truncate">
                          {point}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Avatar Column (When Positioned on Right) */}
          {!isLeft && (
            <div className="w-[26%] sm:w-[24%] shrink-0 flex flex-col justify-end items-center h-full">
              <PresenterAvatarView slide={slide} config={config} isLeft={false} />
            </div>
          )}

        </div>

        {/* Bottom Bar: Slide Info & Number */}
        <div
          className={`w-full flex items-center justify-between text-xs font-medium pt-1.5 border-t ${
            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[10px] sm:text-xs">
              SLAID {slide.slideNumber} • {config.characterSheet?.characterName || config.nametagText} ({config.presenterStyle})
            </span>
          </div>

          <div
            className="font-mono font-black text-sm sm:text-base"
            style={{
              backgroundImage: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {slide.slideNumber} / 45
          </div>
        </div>

      </div>
    </div>
  );
};
