import React from "react";
import type { CurrencyState } from "../types/loot";
import {
  Sparkles,
  Key,
  Diamond,
  Volume2,
  VolumeX,
  Info,
  Plus,
  Coins,
  Shield,
  Layers,
  Store,
  BarChart2,
} from "lucide-react";
import { soundEngine } from "../utils/audio";

interface NavbarProps {
  currencies: CurrencyState;
  activeView: "loot" | "stats" | "workshop" | "store";
  onSelectView: (view: "loot" | "stats" | "workshop" | "store") => void;
  onAddCurrency: () => void;
  onOpenRates: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currencies,
  activeView,
  onSelectView,
  onAddCurrency,
  onOpenRates,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="w-full bg-slate-950/95 border-b border-amber-500/30 sticky top-0 z-40 backdrop-blur-md shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Wild Rift Hextech Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black tracking-widest text-slate-100 uppercase">
                WILD RIFT
              </h1>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.2 rounded border border-amber-500/40 uppercase">
                Patch 2026
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Hextech Loot & Gacha Simulator
            </p>
          </div>
        </div>

        {/* Center: Navigation Navigation Tabs */}
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
            <span>Chests</span>
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
            <span>Data & Luck</span>
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
            <span>Vault</span>
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
            <span>Gem Shop</span>
          </button>
        </nav>

        {/* Right: Currency Balance Bar & Control Icons */}
        <div className="flex items-center gap-2.5">
          {/* Wild Cores */}
          <div
            className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 text-xs shadow-inner cursor-pointer hover:border-amber-500/40 transition-colors"
            onClick={onAddCurrency}
            title="Click to Refill / Add Sandbox Currencies"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-extrabold text-slate-200">
              {currencies.wildCores.toLocaleString()}
            </span>
            <Plus className="w-3 h-3 text-amber-400 hover:scale-125 transition-transform" />
          </div>

          {/* Hextech Keys */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 text-xs shadow-inner">
            <Key className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-extrabold text-amber-300">
              {currencies.hextechKeys.toLocaleString()}
            </span>
          </div>

          {/* Orange Gemstones */}
          <div className="flex items-center gap-1.5 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/40 text-xs shadow-inner">
            <Diamond className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-black text-amber-400">
              {currencies.orangeGemstones.toLocaleString()}
            </span>
          </div>

          {/* Silver Stardust */}
          <div className="hidden sm:flex items-center gap-1.5 bg-sky-950/40 px-2.5 py-1 rounded-lg border border-sky-500/40 text-xs shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span className="font-extrabold text-sky-300">
              {currencies.silverStardust.toLocaleString()}
            </span>
          </div>

          {/* Rate Info Modal Trigger */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenRates();
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition-colors"
            title="Loot Drop Rates & Probabilities"
          >
            <Info className="w-4 h-4" />
          </button>

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
