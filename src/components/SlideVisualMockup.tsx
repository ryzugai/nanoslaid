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
            className={`w-[30%] sm:w-[28%] flex flex-col items-center justify-end z-20 shrink-0 h-full ${
              isLeft ? 'order-1' : 'order-2'
            }`}
          >
            <div className="relative flex flex-col items-center w-full max-w-[240px]">
              
              {/* 3D Explanatory Avatar Figure */}
              <div className="relative flex flex-col items-center w-full">
                {/* Visual Head / Portrait */}
                {config.characterSheet?.imageUrl ? (
                  <div className="w-24 sm:w-32 lg:w-36 h-24 sm:h-32 lg:h-36 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-slate-900 relative z-20">
                    <img
                      src={config.characterSheet.imageUrl}
                      alt={charName}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 ring-2 ring-inset ring-cyan-400/50 rounded-full pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-20 sm:w-28 lg:w-32 h-20 sm:h-28 lg:h-32 rounded-full bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-100 border-4 border-white shadow-xl flex items-center justify-center relative overflow-hidden z-20">
                    <User className="w-10 sm:w-16 lg:w-18 h-10 sm:h-16 lg:h-18 text-slate-800" />
                  </div>
                )}

                {/* 3D Illustrated Presenter Torso with Dynamic Hand Gestures */}
                <div
                  className="w-28 sm:w-40 lg:w-48 h-24 sm:h-32 lg:h-36 rounded-t-3xl shadow-2xl flex flex-col items-center pt-3 relative mt-[-16px] z-10 border-t-2 border-white/60"
                  style={{
                    backgroundImage: `linear-gradient(180deg, #1E3A8A 0%, #172554 60%, #0F172A 100%)`,
                  }}
                >
                  {/* Chest Pocket Nametag */}
                  {config.useNametag && (
                    <div className="mt-0.5 px-3 py-1 rounded-md bg-white border-2 border-slate-900 shadow-md text-xs sm:text-sm font-black font-mono tracking-wider text-slate-950 uppercase truncate max-w-[90%]">
                      {charName}
                    </div>
                  )}

                  {/* Dynamic Explanatory Gesture Indicator */}
                  <div className="mt-auto pb-2.5 flex items-center gap-1.5">
                    {poseType === 'POINTING_OPEN_PALM' && (
                      <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-cyan-500/25 text-cyan-300 font-extrabold border border-cyan-400/40 flex items-center gap-1 shadow-xs">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" /> Menunjuk Poin
                      </span>
                    )}
                    {poseType === 'HOLDING_STYLUS' && (
                      <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-blue-500/25 text-blue-300 font-extrabold border border-blue-400/40 flex items-center gap-1 shadow-xs">
                        <Radio className="w-3.5 h-3.5 text-blue-400" /> Penunjuk Pintar
                      </span>
                    )}
                    {poseType === 'UPWARD_METRIC_GESTURE' && (
                      <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-emerald-500/25 text-emerald-300 font-extrabold border border-emerald-400/40 flex items-center gap-1 shadow-xs">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Sorotan Metrik
                      </span>
                    )}
                    {poseType === 'QUIZ_HOST' && (
                      <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-amber-500/25 text-amber-300 font-extrabold border border-amber-400/40 flex items-center gap-1 shadow-xs">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Hos Kuiz
                      </span>
                    )}
                    {poseType === 'WELCOMING_KEYNOTE' && (
                      <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-purple-500/25 text-purple-300 font-extrabold border border-purple-400/40 flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Ucaptama
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Presenter Name Badge */}
              <div className="mt-1.5 text-center">
                <span className="text-xs sm:text-sm font-extrabold px-3 py-1 rounded-lg shadow-sm bg-black/70 text-white backdrop-blur-xs border border-white/10">
                  {charName} • {slide.characterPosition}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Content: Diverse Infographics vs MCQ Interface (Locked Minimum 20pt / 20px Font Size) */}
          <div
            className={`flex-1 w-full h-full flex flex-col justify-center ${
              isLeft ? 'order-2' : 'order-1'
            }`}
          >
            {slide.isMcq && slide.mcqDetails ? (
              /* MCQ Quiz Interface */
              <div className="space-y-3">
                <div
                  className={`p-4 sm:p-5 rounded-2xl border shadow-xl ${
                    isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                  style={{ borderLeft: `6px solid ${primaryAccent}` }}
                >
                  <p className="text-lg sm:text-xl md:text-2xl font-black leading-snug">
                    {slide.mcqDetails.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slide.mcqDetails.options.map((opt) => (
                    <div
                      key={opt.label}
                      className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3 shadow-md ${
                        isDark
                          ? 'bg-slate-900/80 border-slate-800'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <span
                        className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg flex items-center justify-center font-mono font-black text-base sm:text-lg shrink-0 text-white shadow-sm"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
                        }}
                      >
                        {opt.label}
                      </span>
                      <span className="text-base sm:text-lg md:text-[20px] font-bold leading-relaxed">
                        {opt.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : archetype === 'PROCESS_FLOW' && slide.infographicMeta?.steps ? (
              /* 1. PROCESS FLOW: Horizontal Step-by-Step Flowchart */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {slide.infographicMeta.steps.map((step, idx) => (
                  <div
                    key={step.step}
                    className={`p-4 rounded-xl border flex flex-col justify-between shadow-lg relative ${
                      isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderTop: `5px solid ${idx % 2 === 0 ? primaryAccent : secondaryAccent}` }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-xs"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
                          }}
                        >
                          0{step.step}
                        </span>
                        {idx < 3 && (
                          <ArrowRight className="w-5 h-5 opacity-40 hidden sm:block" />
                        )}
                      </div>
                      <h4 className="text-lg font-black leading-tight mb-2">
                        {step.title}
                      </h4>
                      <p className="text-base sm:text-lg md:text-[20px] font-medium opacity-90 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : archetype === 'STAT_METRIC_GAUGE' && slide.infographicMeta?.stats ? (
              /* 2. STAT METRIC GAUGE: Executive KPI Telemetry */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {slide.infographicMeta.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-xl border flex flex-col items-center text-center justify-center shadow-lg ${
                      isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderBottom: `5px solid ${idx === 0 ? primaryAccent : idx === 1 ? secondaryAccent : '#10B981'}` }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-cyan-500/10 text-cyan-400">
                      {idx === 0 ? <Gauge className="w-6 h-6" /> : idx === 1 ? <TrendingUp className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                    </div>
                    <div
                      className="text-3xl sm:text-4xl font-black font-mono tracking-tight"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${primaryAccent}, ${secondaryAccent})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-lg sm:text-xl font-black mt-1.5">{stat.label}</div>
                    {stat.change && (
                      <span className="text-base font-bold text-emerald-400 mt-1">
                        {stat.change}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : archetype === 'MULTI_PILLAR' && slide.infographicMeta?.pillars ? (
              /* 3. MULTI PILLAR: Architectural Pillars */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {slide.infographicMeta.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between shadow-lg ${
                      isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderTop: `5px solid ${idx % 2 === 0 ? primaryAccent : secondaryAccent}` }}
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 bg-blue-500/10 text-blue-400">
                        {idx === 0 ? <Shield className="w-5 h-5" /> : idx === 1 ? <Cpu className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                      <h4 className="text-lg font-black leading-tight mb-2">
                        {pillar.title}
                      </h4>
                      <p className="text-base sm:text-lg md:text-[20px] font-medium opacity-90 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : archetype === 'COMPARISON_MATRIX' && slide.infographicMeta?.comparison ? (
              /* 4. COMPARISON MATRIX: Dual-Column Contrast */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Left: Traditional */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border shadow-md ${
                    isDark ? 'bg-rose-950/25 border-rose-900/50' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3 text-rose-500 font-black text-lg">
                    <X className="w-5 h-5" />
                    <span>{slide.infographicMeta.comparison.leftTitle}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {slide.infographicMeta.comparison.leftItems.map((item, i) => (
                      <li key={i} className="text-base sm:text-lg md:text-[20px] flex items-start gap-2.5 opacity-90 leading-relaxed font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Smart Modern */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border shadow-md ${
                    isDark ? 'bg-cyan-950/25 border-cyan-800/50' : 'bg-cyan-50 border-cyan-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3 text-cyan-500 font-black text-lg">
                    <Check className="w-5 h-5" />
                    <span>{slide.infographicMeta.comparison.rightTitle}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {slide.infographicMeta.comparison.rightItems.map((item, i) => (
                      <li key={i} className="text-base sm:text-lg md:text-[20px] flex items-start gap-2.5 font-bold leading-relaxed">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : archetype === 'RADIAL_ECOSYSTEM' && slide.infographicMeta?.nodes ? (
              /* 5. RADIAL ECOSYSTEM: Core Hub & Satellite Nodes */
              <div className="space-y-3">
                <div
                  className={`p-3.5 sm:p-4 rounded-xl border text-center shadow-lg ${
                    isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                  style={{ borderLeft: `6px solid ${primaryAccent}` }}
                >
                  <span className="text-xs uppercase font-bold text-cyan-400">Hab Pusat</span>
                  <h4 className="text-lg sm:text-xl font-black">{slide.infographicMeta.nodes.centerNode}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {slide.infographicMeta.nodes.satellites.map((sat, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border shadow-sm ${
                        isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white/95 border-slate-200'
                      }`}
                    >
                      <div className="text-base sm:text-lg font-black text-cyan-300 truncate">{sat.title}</div>
                      <div className="text-base sm:text-lg md:text-[20px] opacity-90 leading-relaxed mt-1 font-medium">{sat.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : archetype === 'TIMELINE_ROADMAP' && slide.infographicMeta?.phases ? (
              /* 6. TIMELINE ROADMAP: Phase Milestones */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {slide.infographicMeta.phases.map((ph, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between shadow-lg ${
                      isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                    style={{ borderTop: `5px solid ${idx % 2 === 0 ? primaryAccent : secondaryAccent}` }}
                  >
                    <div>
                      <span className="text-xs font-black font-mono px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300">
                        {ph.phase}
                      </span>
                      <h4 className="text-lg font-black mt-2.5 mb-1">{ph.milestone}</h4>
                      <p className="text-base sm:text-lg md:text-[20px] font-medium opacity-90 leading-relaxed">{ph.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* 7. BENTO GRID (Default) */
              <div className="space-y-3">
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
                      className={`p-3.5 sm:p-4 rounded-xl border shadow-md flex items-center gap-3.5 ${
                        isDark ? 'bg-slate-900/85 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                      style={{
                        borderLeft: `6px solid ${idx === 0 ? primaryAccent : idx === 1 ? secondaryAccent : primaryAccent}`,
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base text-white shrink-0 shadow-xs"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${
                            idx === 0 ? primaryAccent : secondaryAccent
                          }, ${idx === 0 ? secondaryAccent : primaryAccent})`,
                        }}
                      >
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-base sm:text-lg md:text-[20px] font-bold leading-relaxed">
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
