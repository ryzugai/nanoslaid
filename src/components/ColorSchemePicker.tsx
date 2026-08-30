import React, { useState } from 'react';
import { ColorScheme } from '../types';
import { OFFICIAL_COLOR_SCHEMES } from '../data/colorSchemes';
import { Check, Sparkles, Sun, Moon } from 'lucide-react';

interface ColorSchemePickerProps {
  selectedId: number;
  onSelect: (id: number) => void;
}

export const ColorSchemePicker: React.FC<ColorSchemePickerProps> = ({
  selectedId,
  onSelect,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'Dark Mode' | 'Light Mode'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    'all',
    'Corporate',
    'Tech & Cyber',
    'Clean & Minimal',
    'Luxury & Gold',
    'Nature & Health',
    'Creative & Vibrant',
  ];

  const filteredSchemes = OFFICIAL_COLOR_SCHEMES.filter((scheme) => {
    if (filterMode !== 'all' && scheme.mode !== filterMode) return false;
    if (filterCategory !== 'all' && scheme.category !== filterCategory) return false;
    return true;
  });

  const selectedScheme = OFFICIAL_COLOR_SCHEMES.find((s) => s.id === selectedId) || OFFICIAL_COLOR_SCHEMES[0];

  return (
    <div className="space-y-4">
      {/* Selected Preview Banner */}
      <div
        className="p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          backgroundColor: selectedScheme.bgHex,
          borderColor: selectedScheme.accentHexes[0],
          color: selectedScheme.mode === 'Dark Mode' ? '#FFFFFF' : '#0F172A',
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/20">
              #{selectedScheme.id} Terpilih
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
              {selectedScheme.mode}
            </span>
          </div>
          <h4 className="text-base font-bold tracking-tight">{selectedScheme.name}</h4>
          <p className="text-xs opacity-80 max-w-xl">{selectedScheme.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right text-xs opacity-75 hidden sm:block">Aksen Warna:</div>
          <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10">
            <div
              className="w-5 h-5 rounded-md border border-white/30 shadow-sm"
              style={{ backgroundColor: selectedScheme.bgHex }}
              title={`Background: ${selectedScheme.bgHex}`}
            />
            {selectedScheme.accentHexes.map((hex, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-md border border-white/30 shadow-sm"
                style={{ backgroundColor: hex }}
                title={`Accent ${idx + 1}: ${hex}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
        {/* Mode Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#091322] border border-white/10 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterMode === 'all'
                ? 'bg-[#06B6D4] text-[#091322] font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua (30)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('Dark Mode')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              filterMode === 'Dark Mode'
                ? 'bg-[#06B6D4] text-[#091322] font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3 h-3" /> Gelap
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('Light Mode')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-all ${
              filterMode === 'Light Mode'
                ? 'bg-[#06B6D4] text-[#091322] font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3 h-3" /> Cerah
          </button>
        </div>

        {/* Category Scroll */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-[#06B6D4] text-[#091322] font-bold'
                  : 'bg-[#091322] text-slate-400 hover:bg-[#13233a] hover:text-white border border-white/5'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 30 Official Color Schemes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
        {filteredSchemes.map((scheme) => {
          const isSelected = scheme.id === selectedId;
          return (
            <button
              key={scheme.id}
              type="button"
              onClick={() => onSelect(scheme.id)}
              className={`group text-left p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'ring-2 ring-[#06B6D4] border-[#06B6D4] shadow-lg scale-[1.01] bg-[#091322]'
                  : 'border-white/10 hover:border-white/20 bg-[#091322]/80 hover:bg-[#091322]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0B1729] text-slate-300 border border-white/10">
                    #{scheme.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {scheme.name.replace(/\[.*\]/, '')}
                  </span>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#06B6D4] text-[#091322] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Color Bar Preview */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-lg border border-white/10" style={{ backgroundColor: scheme.bgHex }}>
                <div className="text-[10px] font-mono px-1 rounded bg-black/50 text-white backdrop-blur-xs">
                  BG {scheme.bgHex}
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  {scheme.accentHexes.map((hex, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                <span>{scheme.category}</span>
                <span className="font-mono">{scheme.mode}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
