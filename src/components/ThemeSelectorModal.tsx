import React from 'react';
import { ThemeConfig, ThemeKey } from '../types';
import { THEMES } from '../theme';
import { X, Check, Sparkles, Palette } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedThemeKey: ThemeKey;
  onSelectTheme: (key: ThemeKey) => void;
}

export function ThemeSelectorModal({
  isOpen,
  onClose,
  selectedThemeKey,
  onSelectTheme,
}: ThemeSelectorModalProps) {
  if (!isOpen) return null;

  const themeList: { key: ThemeKey; config: ThemeConfig; number: number }[] = [
    { key: 'royal_blue', config: THEMES.royal_blue, number: 1 },
    { key: 'teal_gray', config: THEMES.teal_gray, number: 2 },
    { key: 'purple_lavender', config: THEMES.purple_lavender, number: 3 },
    { key: 'emerald_mint', config: THEMES.emerald_mint, number: 4 },
    { key: 'amber_orange', config: THEMES.amber_orange, number: 5 },
    { key: 'coral_peach', config: THEMES.coral_peach, number: 6 },
    { key: 'slate_gray', config: THEMES.slate_gray, number: 7 },
    { key: 'indigo_sky', config: THEMES.indigo_sky, number: 8 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Custom UI Color Themes</h3>
              <p className="text-xs text-slate-500">Select from 8 curated desktop color schemes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5 custom-scrollbar">
          {themeList.map((item) => {
            const isSelected = selectedThemeKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onSelectTheme(item.key);
                }}
                className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1 shrink-0">
                    <span
                      className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: item.config.primaryColor }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: item.config.secondaryColor }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {item.number}. {item.config.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{item.config.subtitle}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">Changes apply instantly to the desktop environment.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
