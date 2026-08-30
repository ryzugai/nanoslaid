import React from 'react';
import { SlideData, SetupConfig, InfographicArchetype } from '../types';
import { OFFICIAL_COLOR_SCHEMES } from '../data/colorSchemes';
import {
  User,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Cpu,
  Users,
  TrendingUp,
  Gauge,
  HelpCircle,
  Check,
  X,
  Radio,
  Globe,
  Layers
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
  const charName = (config.characterSheet?.characterName || config.nametagText || 'DR. AIMAN').toUpperCase();

  const archetype: InfographicArchetype =
    slide.infographicType ||
    slide.infographicMeta?.archetype ||
    'BENTO_GRID';

  // Dynamic presenter pose descriptor by slide number
  const poseType = slide.isMcq
    ? 'QUIZ_HOST'
    : slide.slideNumber === 1
    ? 'WELCOMING_KEYNOTE'
    : slide.slideNumber % 5 === 0
    ? 'UPWARD_METRIC_GESTURE'
    : slide.slideNumber % 4 === 0
    ? 'TWO_HAND_FRAMING'
    : slide.slideNumber % 3 === 0
    ? 'HOLDING_STYLUS'
    : 'POINTING_OPEN_PALM';

  return (
    <div
      className={`w-full aspect-[16/9] rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between select-none transition-all border ${
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
            ? `radial-gradient(circle at ${isLeft ? '75%' : '25%'} 40%, ${primaryAccent}22 0%, ${secondaryAccent}10 60%, transparent 85%)`
            : `radial-gradient(circle at ${isLeft ? '75%' : '25%'} 40%, #FFFFFF 0%, #F1F5F9 60%, #E2E8F0 100%)`,
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

      {/* Main Slide Layout Grid */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        
        {/* Top Header Section */}
        <div className={`w-full ${isLeft ? 'pl-[26%] pr-2' : 'pr-[26%] pl-2'} space-y-1`}>
          {/* Category Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-xs border border-white/20">
            {slide.isMcq ? (
              <>
                <HelpCircle className="w-3 h-3 text-amber-400" />
                <span>Soalan Uji Minda • Slaid {slide.slideNumber}</span>
              </>
            ) : (
              <>
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>Modul {slide.slideNumber} • {archetype.replace('_', ' ')}</span>
              </>
            )}
          </div>

          {/* Big Bold Gradient Title */}
          <h2
            className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight line-clamp-2"
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

        {/* Central Workspace Area: Presenter & Dynamic Infographics */}
        <div className="relative flex-1 flex items-center justify-between my-2 sm:my-3 gap-3">
          
          {/* Presenter Avatar (Thigh-up Pose on Left or Right) */}
          <div
            className={`w-[28%] sm:w-[26%] flex flex-col items-center justify-end z-20 shrink-0 h-full ${
              isLeft ? 'order-1' : 'order-2'
            }`}
          >
            <div className="relative flex flex-col items-center w-full max-w-[200px]">
              
              {/* 3D Explanatory Avatar Figure */}
              <div className="relative flex flex-col items-center">
                {/* Visual Head / Portrait */}
                {config.characterSheet?.imageUrl ? (
                  <div className="w-20 sm:w-28 lg:w-32 h-20 sm:h-28 lg:h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/90 bg-slate-900 relative">
                    <img
                      src={config.characterSheet.imageUrl}
                      alt={charName}
                      className="w-[400%] max-w-none h-[400%] object-cover"
                      style={{
                        transform: 'translate(-5%, -5%) scale(1.15)',
                      }}
                    />
                    <div className="absolute inset-0 ring-2 ring-inset ring-cyan-400/40 rounded-2xl pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-16 sm:w-22 lg:w-26 h-16 sm:h-22 lg:h-26 rounded-2xl bg-gradient-to-tr from-amber-200 to-amber-100 border-2 border-white shadow-lg flex items-center justify-center relative overflow-hidden">
                    <User className="w-8 sm:w-12 lg:w-14 h-8 sm:h-12 lg:h-14 text-slate-800" />
                  </div>
                )}

                {/* 3D Illustrated Presenter Torso with Dynamic Hand Gestures */}
                <div
                  className="w-24 sm:w-36 lg:w-40 h-20 sm:h-28 lg:h-32 rounded-t-3xl shadow-xl flex flex-col items-center pt-2 relative mt-[-10px] z-10 border-t border-white/40"
                  style={{
                    backgroundImage: `linear-gradient(180deg, #1E3A8A 0%, #0F172A 100%)`,
                  }}
                >
                  {/* Chest Pocket Nametag */}
                  {config.useNametag && (
                    <div className="mt-1 px-2 py-0.5 rounded-xs bg-white border border-slate-900 shadow-xs text-xs font-black font-mono tracking-wider text-slate-950 uppercase truncate max-w-[90%]">
                      {charName}
                    </div>
                  )}

                  {/* Dynamic Explanatory Gesture Indicator */}
                  <div className="mt-auto pb-2 flex items-center gap-1">
                    {poseType === 'POINTING_OPEN_PALM' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/30 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-cyan-400" /> Menunjuk Poin
                      </span>
                    )}
                    {poseType === 'HOLDING_STYLUS' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30 flex items-center gap-1">
                        <Radio className="w-3 h-3 text-blue-400" /> Penunjuk Pintar
                      </span>
                    )}
                    {poseType === 'UPWARD_METRIC_GESTURE' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" /> Sorotan Metrik
                      </span>
                    )}
                    {poseType === 'QUIZ_HOST' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-amber-400" /> Hos Kuiz
                      </span>
                    )}
                    {poseType === 'WELCOMING_KEYNOTE' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-400/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-400" /> Ucaptama
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Presenter Name Badge */}
              <div className="mt-1 text-center">
                <span className="text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md shadow-xs bg-black/60 text-white backdrop-blur-xs">
                  {charName} ({slide.characterPosition})
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Content: Diverse Infographics vs MCQ Interface (Minimum 16px Font Size) */}
          <div
            className={`flex-1 w-full h-full flex flex-col justify-center ${
              isLeft ? 'order-2' : 'order-1'
            }`}
          >
            {slide.isMcq && slide.mcqDetails ? (
              /* MCQ Quiz Interface */
              <div className="space-y-3">
                <div
                  className={`p-3.5 sm:p-4 rounded-xl border shadow-lg ${
                    isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                  style={{ borderLeft: `5px solid ${primaryAccent}` }}
                >
                  <p className="text-base sm:text-lg font-bold leading-snug">
                    {slide.mcqDetails.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {slide.mcqDetails.options.map((opt) => (
                    <div
                      key={opt.label}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 shadow-xs ${
                        isDark
                          ? 'bg-slate-900/70 border-slate-800'
                          : 'bg-white/90 border-slate-200'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-sm shrink-0 text-white shadow-xs"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
                        }}
                      >
                        {opt.label}
                      </span>
                      <span className="text-base font-semibold leading-relaxed">
                        {opt.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : archetype === 'PROCESS_FLOW' && slide.infographicMeta?.steps ? (
              /* 1. PROCESS FLOW: Horizontal Step-by-Step Flowchart */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {slide.infographicMeta.steps.map((step, idx) => (
                  <div
                    key={step.step}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between shadow-md relative ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderTop: `4px solid ${idx % 2 === 0 ? primaryAccent : secondaryAccent}` }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="w-7 h-7 rounded-md flex items-center justify-center font-black text-xs text-white shadow-xs"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
                          }}
                        >
                          0{step.step}
                        </span>
                        {idx < 3 && (
                          <ArrowRight className="w-4 h-4 opacity-40 hidden sm:block" />
                        )}
                      </div>
                      <h4 className="text-base font-bold leading-tight mb-1.5">
                        {step.title}
                      </h4>
                      <p className="text-base opacity-85 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : archetype === 'STAT_METRIC_GAUGE' && slide.infographicMeta?.stats ? (
              /* 2. STAT METRIC GAUGE: Executive KPI Telemetry */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {slide.infographicMeta.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col items-center text-center justify-center shadow-md ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderBottom: `4px solid ${idx === 0 ? primaryAccent : idx === 1 ? secondaryAccent : '#10B981'}` }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 bg-cyan-500/10 text-cyan-400">
                      {idx === 0 ? <Gauge className="w-5 h-5" /> : idx === 1 ? <TrendingUp className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    </div>
                    <div
                      className="text-2xl sm:text-3xl font-black font-mono tracking-tight"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-base font-bold mt-1">{stat.label}</div>
                    {stat.change && (
                      <span className="text-sm font-semibold text-emerald-400 mt-1">
                        {stat.change}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : archetype === 'MULTI_PILLAR' && slide.infographicMeta?.pillars ? (
              /* 3. MULTI PILLAR: Architectural Pillars */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {slide.infographicMeta.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between shadow-md ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderTop: `4px solid ${idx % 2 === 0 ? primaryAccent : secondaryAccent}` }}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-blue-500/10 text-blue-400">
                        {idx === 0 ? <Shield className="w-4 h-4" /> : idx === 1 ? <Cpu className="w-4 h-4" /> : idx === 2 ? <Users className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      </div>
                      <h4 className="text-base font-bold leading-tight mb-1.5">
                        {pillar.title}
                      </h4>
                      <p className="text-base opacity-85 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : archetype === 'COMPARISON_MATRIX' && slide.infographicMeta?.comparison ? (
              /* 4. COMPARISON MATRIX: Dual-Column Contrast */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Left: Traditional */}
                <div
                  className={`p-4 rounded-xl border shadow-sm ${
                    isDark ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2.5 text-rose-500 font-bold text-base">
                    <X className="w-4 h-4" />
                    <span>{slide.infographicMeta.comparison.leftTitle}</span>
                  </div>
                  <ul className="space-y-2">
                    {slide.infographicMeta.comparison.leftItems.map((item, i) => (
                      <li key={i} className="text-base flex items-start gap-2 opacity-85 leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Smart Modern */}
                <div
                  className={`p-4 rounded-xl border shadow-sm ${
                    isDark ? 'bg-cyan-950/20 border-cyan-800/40' : 'bg-cyan-50 border-cyan-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2.5 text-cyan-500 font-bold text-base">
                    <Check className="w-4 h-4" />
                    <span>{slide.infographicMeta.comparison.rightTitle}</span>
                  </div>
                  <ul className="space-y-2">
                    {slide.infographicMeta.comparison.rightItems.map((item, i) => (
                      <li key={i} className="text-base flex items-start gap-2 font-medium leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : archetype === 'RADIAL_ECOSYSTEM' && slide.infographicMeta?.nodes ? (
              /* 5. RADIAL ECOSYSTEM: Core Hub & Satellite Nodes */
              <div className="space-y-2.5">
                <div
                  className={`p-3 rounded-xl border text-center shadow-md ${
                    isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                  style={{ borderLeft: `6px solid ${primaryAccent}` }}
                >
                  <span className="text-xs uppercase font-bold text-cyan-400">Hab Pusat</span>
                  <h4 className="text-base sm:text-lg font-black">{slide.infographicMeta.nodes.centerNode}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {slide.infographicMeta.nodes.satellites.map((sat, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border shadow-xs ${
                        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white/90 border-slate-200'
                      }`}
                    >
                      <div className="text-base font-bold text-cyan-300 truncate">{sat.title}</div>
                      <div className="text-base opacity-85 leading-relaxed mt-0.5">{sat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : archetype === 'TIMELINE_ROADMAP' && slide.infographicMeta?.phases ? (
              /* 6. TIMELINE ROADMAP: Phase Milestones */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {slide.infographicMeta.phases.map((ph, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between shadow-md ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderTop: `4px solid ${idx % 2 === 0 ? primaryAccent : secondaryAccent}` }}
                  >
                    <div>
                      <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300">
                        {ph.phase}
                      </span>
                      <h4 className="text-base font-bold mt-2 mb-1">{ph.milestone}</h4>
                      <p className="text-base opacity-85 leading-relaxed">{ph.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* 7. BENTO GRID (Default) */
              <div className="space-y-2.5">
                {(slide.infographicPoints && slide.infographicPoints.length > 0
                  ? slide.infographicPoints
                  : [
                      'Analisis terperinci dan penjajaran strategi pelaksanaan projek.',
                      'Pemerkasaan tadbir urus digital dengan keselamatan data menyeluruh.',
                      'Peningkatan kecekapan operasi melalui automasi mampan berimpak tinggi.',
                    ]
                )
                  .slice(0, 4)
                  .map((point, idx) => (
                    <div
                      key={idx}
                      className={`p-3 sm:p-3.5 rounded-xl border shadow-md flex items-center gap-3 ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                      style={{
                        borderLeft: `5px solid ${idx === 0 ? primaryAccent : idx === 1 ? secondaryAccent : primaryAccent}`,
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white shrink-0 shadow-xs"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${
                            idx === 0 ? primaryAccent : secondaryAccent
                          }, ${idx === 0 ? secondaryAccent : primaryAccent})`,
                        }}
                      >
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold leading-relaxed">
                          {point}
                        </p>
                      </div>

                      <CheckCircle2
                        className="w-5 h-5 shrink-0 opacity-70"
                        style={{ color: idx === 0 ? primaryAccent : secondaryAccent }}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Slide Info & Number */}
        <div
          className={`w-full flex items-center justify-between text-xs font-medium pt-2 border-t ${
            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-[10px] sm:text-xs">
              SLAID {slide.slideNumber} • {slide.ethnicity} • {poseType.replace(/_/g, ' ')}
            </span>
          </div>

          <div
            className="font-mono font-black text-base sm:text-xl"
            style={{
              backgroundImage: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {slide.slideNumber}
          </div>
        </div>

      </div>
    </div>
  );
};
