import React from "react";
import {
  Crown,
  Volume2,
  VolumeX,
  HelpCircle,
  ChevronLeft,
  RotateCcw,
  Layers,
  Store,
  BarChart2,
  Shield,
  Languages,
} from "lucide-react";
import { soundEngine } from "../utils/audio";
import { type Language, translations } from "../utils/i18n";

interface NavbarProps {
  activeView: "loot" | "stats" | "workshop" | "store";
  onSelectView: (view: "loot" | "stats" | "workshop" | "store") => void;
  onOpenRates: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetStats?: () => void;
  lang?: Language;
  onToggleLang?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  onOpenRates,
  isMuted,
  onToggleMute,
  onResetStats,
  lang = "th",
  onToggleLang,
}) => {
  const t = translations[lang] || translations.th;

  return (
    <header className="w-full bg-slate-950/95 border-b border-amber-500/30 sticky top-0 z-40 backdrop-blur-md shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Store Title & Prestige Select Badge */}
        <div className="flex items-center gap-2.5">
          {/* Back Arrow */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectView("loot");
            }}
            className="p-1 rounded-lg text-amber-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Return to Main Store"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* STORE Title with Question Mark */}
          <div className="flex items-center gap-1.5">
            <h1
              onClick={() => onSelectView("loot")}
              className="text-base sm:text-lg font-black tracking-widest text-slate-100 uppercase font-cinzel cursor-pointer hover:text-amber-300 transition-colors"
            >
              {t.store}
            </h1>
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenRates();
              }}
              className="w-5 h-5 rounded-full border border-slate-600 hover:border-amber-400 flex items-center justify-center text-slate-400 hover:text-amber-300 transition-colors"
              title={t.infoTitle}
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Prestige Select Category Badge */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-500/50 text-amber-300 text-[10px] tracking-wider uppercase font-extrabold shadow-sm">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>{t.prestigeSelectBadge}</span>
          </div>
        </div>

        {/* Center: Quick Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectView("loot");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all uppercase tracking-wider ${
              activeView === "loot"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.chests}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectView("stats");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all uppercase tracking-wider ${
              activeView === "stats"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{t.stats}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectView("workshop");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all uppercase tracking-wider ${
              activeView === "workshop"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t.workshop}</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectView("store");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all uppercase tracking-wider ${
              activeView === "store"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t.gemShop}</span>
          </button>
        </nav>

        {/* Right: Language Switcher, Free Rolls Badge, Reset All & Audio */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          {onToggleLang && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleLang();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-500/40 transition-colors text-xs font-bold"
              title="สลับภาษา / Switch Language (TH / EN)"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang.toUpperCase()}</span>
            </button>
          )}

          {/* Free Rolls Mode Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.freeRollsBadge}</span>
          </div>

          {/* Reset All Shortcut Button */}
          {onResetStats && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onResetStats();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-800 hover:border-red-500/40 transition-colors text-xs font-bold"
              title={t.resetAll}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{t.resetAll}</span>
            </button>
          )}

          {/* Audio Mute/Unmute */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition-colors"
            title={isMuted ? "Unmute SFX" : "Mute SFX"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
