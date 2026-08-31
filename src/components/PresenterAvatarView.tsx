import React from 'react';
import { SetupConfig, SlideData } from '../types';
import { Sparkles, Radio, Tablet, Presentation, UserCheck } from 'lucide-react';

interface PresenterAvatarViewProps {
  slide: SlideData;
  config: SetupConfig;
  className?: string;
  isLeft?: boolean;
}

export const PresenterAvatarView: React.FC<PresenterAvatarViewProps> = ({
  slide,
  config,
  className = '',
  isLeft = true,
}) => {
  const isPixar = config.presenterStyle === 'Pixar 3D Style';
  const charSheet = slide.assignedAvatar || config.characterSheet;
  const charName = (charSheet?.characterName || config.nametagText || 'DR. AIMAN').toUpperCase();
  const gender = charSheet?.gender || (slide.ethnicity === 'Melayu berhijab' ? 'Wanita' : 'Lelaki');
  const isHijab = gender === 'Wanita' || slide.ethnicity === 'Melayu berhijab';

  const primaryAccent = slide.accentHexes?.[0] || '#06B6D4';
  const secondaryAccent = slide.accentHexes?.[1] || '#3B82F6';

  // Pose determination
  const poseNumber = slide.slideNumber;
  const isPointing = poseNumber % 3 === 0;
  const isHoldingTablet = poseNumber % 3 === 1;
  const isOpenHand = poseNumber % 3 === 2;

  return (
    <div
      className={`relative flex flex-col items-center justify-end h-full select-none ${className}`}
    >
      {/* Floor Spotlight & Soft Shadow */}
      <div
        className="absolute bottom-1 w-4/5 h-6 rounded-full blur-md opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${primaryAccent}66 0%, rgba(0,0,0,0.6) 60%, transparent 100%)`,
        }}
      />

      {/* Laser Pointer Beam (When Presenter is pointing) */}
      {isPointing && (
        <div
          className={`absolute top-1/3 ${
            isLeft ? 'left-3/4' : 'right-3/4'
          } w-24 sm:w-36 h-[2px] pointer-events-none z-30 opacity-75`}
          style={{
            background: `linear-gradient(${isLeft ? 'to right' : 'to left'}, ${primaryAccent}, transparent)`,
            boxShadow: `0 0 8px ${primaryAccent}`,
            transform: isLeft ? 'rotate(-12deg)' : 'rotate(12deg)',
          }}
        />
      )}

      {/* Main Avatar Figure Container */}
      <div className="relative w-full max-w-[210px] sm:max-w-[250px] flex flex-col items-center z-10">
        
        {/* If User Uploaded Character Sheet Image (Render with Seamless Transparent Cutout) */}
        {charSheet?.imageUrl ? (
          <div className="relative group w-full flex flex-col items-center">
            {/* Cutout Avatar with Natural Drop Shadow */}
            <div className="relative w-40 sm:w-52 h-56 sm:h-64 flex items-end justify-center">
              <img
                src={charSheet.imageUrl}
                alt={charName}
                className="w-full h-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.5)] transition-all duration-300 transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Glowing Executive Nametag Badge */}
            {config.useNametag && (
              <div
                className="mt-1.5 px-3 py-1 rounded-full border text-[11px] sm:text-xs font-mono font-black text-white shadow-xl tracking-wider flex items-center gap-1.5 backdrop-blur-md"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.92)',
                  borderColor: primaryAccent,
                  boxShadow: `0 0 16px ${primaryAccent}55`,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{charName}</span>
              </div>
            )}
          </div>
        ) : (
          /* Render 3D Pixar / Photorealistic Character Model Vector (Crisp, High Visual Caliber) */
          <div className="relative w-full flex flex-col items-center">
            
            {/* SVG 3D Presenter Figure */}
            <svg
              viewBox="0 0 200 280"
              className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 3D Skin Gradient */}
                <radialGradient id={`skinGrad-${slide.slideNumber}`} cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#FDDEC2" />
                  <stop offset="70%" stopColor="#F5B991" />
                  <stop offset="100%" stopColor="#DE956C" />
                </radialGradient>

                {/* 3D Suit Navy / Corporate Gradient */}
                <linearGradient id={`suitGrad-${slide.slideNumber}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="50%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#090D16" />
                </linearGradient>

                {/* Hijab / Hair Gradient */}
                <linearGradient id={`hairGrad-${slide.slideNumber}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isHijab ? primaryAccent : '#262626'} />
                  <stop offset="100%" stopColor={isHijab ? '#0E7490' : '#171717'} />
                </linearGradient>

                {/* Accent Trim Gradient */}
                <linearGradient id={`trimGrad-${slide.slideNumber}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={primaryAccent} />
                  <stop offset="100%" stopColor={secondaryAccent} />
                </linearGradient>

                {/* Eye Shading */}
                <radialGradient id={`eyeGrad-${slide.slideNumber}`} cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="60%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>
              </defs>

              {/* 3D Body & Torso */}
              <g id="body-torso">
                {/* Suit Shoulders & Body */}
                <path
                  d="M 40 180 C 40 145, 75 140, 100 140 C 125 140, 160 145, 160 180 L 175 280 L 25 280 Z"
                  fill={`url(#suitGrad-${slide.slideNumber})`}
                />

                {/* Suit Lapel Highlights */}
                <path
                  d="M 75 145 L 96 220 L 100 220 L 80 145 Z"
                  fill="#334155"
                  opacity="0.7"
                />
                <path
                  d="M 125 145 L 104 220 L 100 220 L 120 145 Z"
                  fill="#1E293B"
                  opacity="0.7"
                />

                {/* Crisp White Inner Shirt & Collar */}
                <polygon points="82,145 100,190 118,145 108,140 92,140" fill="#F8FAFC" />
                
                {/* Executive Tie / Collar Button */}
                <polygon
                  points="97,148 103,148 105,185 100,195 95,185"
                  fill={`url(#trimGrad-${slide.slideNumber})`}
                />

                {/* Physical Nametag on Lapel */}
                {config.useNametag && (
                  <g id="lapel-nametag">
                    <rect
                      x={isLeft ? 115 : 48}
                      y="168"
                      width="38"
                      height="12"
                      rx="2"
                      fill="#020617"
                      stroke={primaryAccent}
                      strokeWidth="0.8"
                    />
                    <circle cx={isLeft ? 118 : 51} cy="174" r="1.5" fill="#10B981" />
                    <text
                      x={isLeft ? 122 : 55}
                      y="177"
                      fontSize="5"
                      fontFamily="monospace"
                      fontWeight="900"
                      fill="#FFFFFF"
                    >
                      {charName.length > 8 ? charName.slice(0, 8) : charName}
                    </text>
                  </g>
                )}
              </g>

              {/* Head, Face & Hair / Hijab */}
              <g id="head-face">
                {/* Neck */}
                <path d="M 88 120 L 88 148 L 112 148 L 112 120 Z" fill={`url(#skinGrad-${slide.slideNumber})`} />

                {/* Hijab Back (if Female) */}
                {isHijab && (
                  <path
                    d="M 52 90 C 45 40, 155 40, 148 90 C 152 140, 138 165, 100 165 C 62 165, 48 140, 52 90 Z"
                    fill={`url(#hairGrad-${slide.slideNumber})`}
                  />
                )}

                {/* Head Shape */}
                <ellipse
                  cx="100"
                  cy="92"
                  rx={isPixar ? '38' : '34'}
                  ry={isPixar ? '42' : '40'}
                  fill={`url(#skinGrad-${slide.slideNumber})`}
                />

                {/* Male Hair / Modern Styled Cut */}
                {!isHijab && (
                  <path
                    d="M 62 82 C 60 45, 140 45, 138 82 C 142 60, 125 42, 100 42 C 75 42, 58 60, 62 82 Z"
                    fill={`url(#hairGrad-${slide.slideNumber})`}
                  />
                )}

                {/* Expressive Eyebrows */}
                <path
                  d="M 76 74 Q 85 70 94 74"
                  stroke="#1E293B"
                  strokeWidth={isPixar ? '3' : '2'}
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 106 74 Q 115 70 124 74"
                  stroke="#1E293B"
                  strokeWidth={isPixar ? '3' : '2'}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Big Expressive 3D Eyes */}
                <g id="eyes">
                  {/* Left Eye */}
                  <ellipse cx="85" cy="84" rx={isPixar ? '7.5' : '5.5'} ry={isPixar ? '8.5' : '6'} fill="#FFFFFF" />
                  <circle cx={isLeft ? '86.5' : '83.5'} cy="84" r={isPixar ? '4.8' : '3.6'} fill={`url(#eyeGrad-${slide.slideNumber})`} />
                  <circle cx={isLeft ? '88' : '85'} cy="82" r="1.8" fill="#FFFFFF" />

                  {/* Right Eye */}
                  <ellipse cx="115" cy="84" rx={isPixar ? '7.5' : '5.5'} ry={isPixar ? '8.5' : '6'} fill="#FFFFFF" />
                  <circle cx={isLeft ? '116.5' : '113.5'} cy="84" r={isPixar ? '4.8' : '3.6'} fill={`url(#eyeGrad-${slide.slideNumber})`} />
                  <circle cx={isLeft ? '118' : '115'} cy="82" r="1.8" fill="#FFFFFF" />
                </g>

                {/* Glasses (Modern corporate frames) */}
                <g id="glasses" stroke={primaryAccent} strokeWidth="1.2" fill="none">
                  <rect x="74" y="76" width="22" height="16" rx="4" />
                  <rect x="104" y="76" width="22" height="16" rx="4" />
                  <line x1="96" y1="83" x2="104" y2="83" />
                  <line x1="74" y1="81" x2="66" y2="78" />
                  <line x1="126" y1="81" x2="134" y2="78" />
                </g>

                {/* Friendly Smile */}
                <path
                  d="M 88 106 Q 100 116 112 106"
                  stroke="#881337"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Cheerful Blush / Lighting */}
                <circle cx="75" cy="98" r="5" fill="#F43F5E" opacity="0.15" />
                <circle cx="125" cy="98" r="5" fill="#F43F5E" opacity="0.15" />
              </g>

              {/* Dynamic Arms, Hands & Teaching Tools */}
              <g id="arms-gestures">
                {isPointing ? (
                  /* Pointing with Stylus / Laser */
                  <g id="pointing-pose">
                    <path
                      d={
                        isLeft
                          ? 'M 148 180 Q 175 160 185 140'
                          : 'M 52 180 Q 25 160 15 140'
                      }
                      stroke="#1E293B"
                      strokeWidth="18"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Hand holding stylus */}
                    <circle cx={isLeft ? 185 : 15} cy="140" r="7" fill={`url(#skinGrad-${slide.slideNumber})`} />
                    {/* Glowing Stylus */}
                    <line
                      x1={isLeft ? 185 : 15}
                      y1="140"
                      x2={isLeft ? 200 : 0}
                      y2="132"
                      stroke={primaryAccent}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx={isLeft ? 200 : 0} cy="132" r="3" fill="#FFFFFF" />
                  </g>
                ) : isHoldingTablet ? (
                  /* Holding Smart Presentation Tablet */
                  <g id="tablet-pose">
                    <rect
                      x={isLeft ? 135 : 25}
                      y="180"
                      width="40"
                      height="55"
                      rx="4"
                      fill="#020617"
                      stroke={primaryAccent}
                      strokeWidth="1.5"
                      transform={isLeft ? 'rotate(-10 135 180)' : 'rotate(10 25 180)'}
                    />
                    <rect
                      x={isLeft ? 138 : 28}
                      y="184"
                      width="34"
                      height="47"
                      rx="2"
                      fill="#0F172A"
                      transform={isLeft ? 'rotate(-10 135 180)' : 'rotate(10 25 180)'}
                    />
                    {/* Glowing chart bars on tablet screen */}
                    <line
                      x1={isLeft ? 144 : 34}
                      y1="210"
                      x2={isLeft ? 144 : 34}
                      y2="198"
                      stroke="#34D399"
                      strokeWidth="3"
                      transform={isLeft ? 'rotate(-10 135 180)' : 'rotate(10 25 180)'}
                    />
                    <line
                      x1={isLeft ? 152 : 42}
                      y1="210"
                      x2={isLeft ? 152 : 42}
                      y2="192"
                      stroke={primaryAccent}
                      strokeWidth="3"
                      transform={isLeft ? 'rotate(-10 135 180)' : 'rotate(10 25 180)'}
                    />
                    <line
                      x1={isLeft ? 160 : 50}
                      y1="210"
                      x2={isLeft ? 160 : 50}
                      y2="202"
                      stroke={secondaryAccent}
                      strokeWidth="3"
                      transform={isLeft ? 'rotate(-10 135 180)' : 'rotate(10 25 180)'}
                    />
                  </g>
                ) : (
                  /* Welcoming / Framing Gesture with Open Palms */
                  <g id="open-palm-pose">
                    <path
                      d={
                        isLeft
                          ? 'M 148 180 Q 170 195 180 185'
                          : 'M 52 180 Q 30 195 20 185'
                      }
                      stroke="#1E293B"
                      strokeWidth="16"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <circle cx={isLeft ? 180 : 20} cy="185" r="7" fill={`url(#skinGrad-${slide.slideNumber})`} />
                  </g>
                )}
              </g>
            </svg>

            {/* Presenter Nameplate Overlay */}
            {config.useNametag && (
              <div
                className="mt-1 px-3 py-1 rounded-full border text-[10px] sm:text-xs font-mono font-black text-white shadow-xl tracking-wider flex items-center gap-1.5 backdrop-blur-md"
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  borderColor: primaryAccent,
                  boxShadow: `0 0 14px ${primaryAccent}55`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{charName}</span>
                <span className="text-[9px] opacity-70 font-sans">
                  ({isPixar ? '3D Pixar' : '3D Realistic'})
                </span>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Pose / Action Label Tag */}
        <div className="mt-1.5 text-[9px] sm:text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1 text-center">
          {isPointing ? (
            <Radio className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
          ) : isHoldingTablet ? (
            <Tablet className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
          ) : (
            <Presentation className="w-2.5 h-2.5 text-amber-400 shrink-0" />
          )}
          <span className="truncate max-w-[130px]">
            {isPointing ? 'Penunjuk Laser' : isHoldingTablet ? 'Tablet Digital' : 'Peragaan Slaid'}
          </span>
        </div>

      </div>
    </div>
  );
};
