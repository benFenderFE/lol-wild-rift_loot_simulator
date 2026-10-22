import React, { useState } from "react";
import {
  Sparkles,
  Key,
  Shield,
  Store,
  RotateCcw,
  Eye,
  Box,
  Check,
  ChevronRight,
  Puzzle,
  AlertCircle,
} from "lucide-react";
import type { BannerType, GachaStats } from "../types/loot";
import { soundEngine } from "../utils/audio";

interface HextechChestProps {
  banner: BannerType;
  isOpening: boolean;
  onOpen: (count: number) => void;
  canAfford: boolean;
  keysCount: number;
  skipAnimation: boolean;
  onToggleSkip: (val: boolean) => void;
  stats?: GachaStats;
  onResetStats?: () => void;
  onNavigateView?: (view: "loot" | "stats" | "workshop" | "store") => void;
  onOpenRates?: () => void;
}

export const HextechChest3D: React.FC<HextechChestProps> = ({
  banner,
  isOpening,
  onOpen,
  canAfford,
  keysCount,
  skipAnimation,
  onToggleSkip,
  stats,
  onResetStats,
  onNavigateView,
  onOpenRates,
}) => {
  const [viewMode, setViewMode] = useState<"stage" | "chest">("stage");
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // 5-roll cycle for the center dial
  const rollsInCycle = stats ? stats.totalChestsOpened % 5 : 0;

  const handleResetConfirm = () => {
    soundEngine.playClick();
    if (onResetStats) {
      onResetStats();
    }
    setShowResetConfirm(false);
  };

  const bannerTitle =
    banner === "event_mythic"
      ? "PRESTIGE SELECT SHOWCASE"
      : banner === "poro"
        ? "PORO ENERGY TREASURE"
        : "STELLAR BONDS HEXTECH SHOWCASE";

  return (
    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center select-none">
      {/* Top Quick Stats HUD & Reset Button Banner */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-900/90 border border-amber-500/30 rounded-xl mb-4 backdrop-blur-md shadow-lg">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{bannerTitle}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-slate-300 text-[11px] font-semibold border-l border-slate-700 pl-4">
            <span>
              Keys Available:{" "}
              <strong className="text-amber-300">
                {keysCount.toLocaleString()}
              </strong>
            </span>
            <span>
              Total Chests:{" "}
              <strong className="text-amber-400">
                {stats?.totalChestsOpened.toLocaleString() ?? 0}
              </strong>
            </span>
            <span>
              Gemstones Hit:{" "}
              <strong className="text-amber-400">
                {stats?.orangeGemstonesTotal.toLocaleString() ?? 0}
              </strong>
            </span>
            <span>
              Jackpot 1,000 OG:{" "}
              <strong className="text-yellow-300 font-bold">
                {stats?.jackpotCount ?? 0}
              </strong>
            </span>
            <span>
              Luck:{" "}
              <strong className="text-cyan-300">
                {stats?.luckRating.toFixed(1) ?? "100.0"}%
              </strong>
            </span>
          </div>
        </div>

        {/* Home Page Reset Stats Button */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Authentic Stage vs 3D Chest Model */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setViewMode(viewMode === "stage" ? "chest" : "stage");
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold border border-slate-700 transition-colors"
            title="Toggle between in-game Stage Showcase and 3D Chest view"
          >
            {viewMode === "stage" ? (
              <>
                <Box className="w-3.5 h-3.5 text-amber-400" />
                <span>3D Chest View</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Stage Showcase</span>
              </>
            )}
          </button>

          {/* Reset All Stats Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowResetConfirm(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Reset all simulation statistics back to zero"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Statistics</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset Stats */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border-2 border-red-500/50 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider font-cinzel">
                Reset All Statistics?
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                This will clear all total rolls, gemstones earned, drop history,
                and luck rating. Your current currency balance will be kept.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-lg shadow-red-600/30"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Stage Container (Styled to match Wild Rift in-game screenshot) */}
      <div className="relative w-full aspect-[16/9] min-h-[460px] sm:min-h-[540px] md:min-h-[620px] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col justify-between p-4 sm:p-6 bg-slate-950">
        {/* Background Image: Authentic Cathedral Hextech Stage */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: "url('/images/wild_rift_store_stage.jpg')",
          }}
        />

        {/* Ambient Dark Gradient Vignette for UI Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />

        {/* Left Floating Sidebar Navigation Cards (Exact replica of screenshot) */}
        <div className="relative z-20 flex flex-col gap-3 max-w-[200px] sm:max-w-[240px] pt-2">
          {/* Card 1: EXCHANGE STORE */}
          <button
            onClick={() => {
              soundEngine.playClick();
              if (onNavigateView) onNavigateView("store");
            }}
            className="group relative flex items-center gap-3 p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-amber-950/40 border border-amber-500/50 hover:border-amber-400 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300 text-left active:scale-95"
          >
            {/* Glowing Golden Gemstone Icon */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Store className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-black tracking-wider text-amber-300 uppercase font-cinzel">
                  EXCHANGE STORE
                </span>
                <ChevronRight className="w-4 h-4 text-amber-400/70 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                Redeem Skins with OG
              </span>
            </div>
          </button>

          {/* Card 2: SHARD WORKSHOP */}
          <button
            onClick={() => {
              soundEngine.playClick();
              if (onNavigateView) onNavigateView("workshop");
            }}
            className="group relative flex items-center gap-3 p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-slate-950/90 via-slate-900/90 to-slate-900/40 border border-slate-700/80 hover:border-amber-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-300 text-left active:scale-95"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-amber-700 via-amber-900 to-slate-900 p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-amber-600/30">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Puzzle className="w-5 h-5 text-amber-400/90" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-black tracking-wider text-slate-200 uppercase font-cinzel">
                  SHARD WORKSHOP
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                Disenchant & Forge
              </span>
            </div>
          </button>

          {/* Bottom Left Announcement & Daily Limit */}
          <div className="mt-auto space-y-1 pt-4 hidden sm:block">
            <button
              onClick={() => {
                soundEngine.playClick();
                if (onOpenRates) onOpenRates();
              }}
              className="flex items-center gap-1.5 text-[10px] text-slate-300 hover:text-amber-300 transition-colors uppercase font-bold tracking-wider"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>CONTENT ANNOUNCEMENT</span>
            </button>
            <div className="text-[10px] text-slate-400 font-semibold tracking-wide">
              Daily limit:{" "}
              <span className="text-slate-200">
                {stats?.totalChestsOpened ?? 0}/200
              </span>
            </div>
          </div>
        </div>

        {/* Center Stage Character Floating Name Badges (From Screenshot) */}
        {viewMode === "stage" ? (
          <div className="relative z-10 w-full flex items-end justify-between px-2 sm:px-8 mb-4 pointer-events-none">
            {/* Left Character: High Noon Ashe */}
            <div className="text-center bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.8)] pointer-events-auto hover:border-pink-400/60 transition-colors">
              <span className="text-[10px] sm:text-xs font-bold text-slate-200 tracking-wide font-cinzel flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]" />
                High Noon Ashe Mythic Chroma
              </span>
            </div>

            {/* Center Featured: Prestige Battle Bunny Miss Fortune */}
            <div className="text-center bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-full border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.4)] pointer-events-auto hover:scale-105 transition-transform">
              <span className="text-xs sm:text-sm font-black text-cyan-200 tracking-wider font-cinzel flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                Prestige Select Battle Bunny Miss Fortune
              </span>
            </div>

            {/* Right Character: Prestige Stargazer Talon */}
            <div className="text-center bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.8)] pointer-events-auto hover:border-amber-400/60 transition-colors">
              <span className="text-[10px] sm:text-xs font-bold text-slate-200 tracking-wide font-cinzel flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                Prestige Stargazer Talon
              </span>
            </div>
          </div>
        ) : (
          /* Alternative 3D Interactive Chest Model View */
          <div className="relative z-10 w-full flex flex-col items-center justify-center my-auto">
            <div
              className={`relative z-10 transition-transform duration-500 ease-out cursor-pointer ${
                isOpening
                  ? "animate-bounce scale-110"
                  : "hover:scale-105 animate-[float_4s_ease-in-out_infinite]"
              }`}
              onClick={() => !isOpening && onOpen(1)}
            >
              <svg
                viewBox="0 0 240 240"
                className="w-48 h-48 sm:w-60 sm:h-60 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  <linearGradient
                    id="goldRim"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="35%" stopColor="#d97706" />
                    <stop offset="70%" stopColor="#92400e" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>

                  <linearGradient
                    id="chestBody"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="50%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#020617" />
                  </linearGradient>

                  <linearGradient
                    id="hextechCore"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>

                  <filter id="hextechGlow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <ellipse
                  cx="120"
                  cy="210"
                  rx="75"
                  ry="14"
                  fill="#000"
                  opacity="0.6"
                />
                <path
                  d="M 50 115 L 190 115 L 180 185 L 60 185 Z"
                  fill="url(#chestBody)"
                  stroke="url(#goldRim)"
                  strokeWidth="4"
                />
                <path
                  d="M 75 145 L 90 165 L 150 165 L 165 145"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  opacity="0.8"
                  filter="url(#hextechGlow)"
                />
                <line
                  x1="120"
                  y1="125"
                  x2="120"
                  y2="185"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
                <path
                  d="M 40 115 Q 120 70 200 115 L 195 125 L 45 125 Z"
                  fill="url(#chestBody)"
                  stroke="url(#goldRim)"
                  strokeWidth="4"
                />
                <polygon
                  points="40,115 65,115 55,135 38,125"
                  fill="url(#goldRim)"
                />
                <polygon
                  points="200,115 175,115 185,135 202,125"
                  fill="url(#goldRim)"
                />
                <polygon
                  points="58,183 75,183 70,170 54,170"
                  fill="url(#goldRim)"
                />
                <polygon
                  points="182,183 165,183 170,170 186,170"
                  fill="url(#goldRim)"
                />
                <g transform="translate(120, 120)">
                  <circle
                    r="26"
                    fill="#0f172a"
                    stroke="url(#goldRim)"
                    strokeWidth="3.5"
                  />
                  <circle
                    r="15"
                    fill="url(#hextechCore)"
                    className={
                      isOpening ? "animate-ping" : "animate-pulse"
                    }
                    filter="url(#hextechGlow)"
                  />
                  <polygon
                    points="0,-10 8,0 0,10 -8,0"
                    fill="#ffffff"
                    opacity="0.9"
                  />
                </g>
              </svg>
            </div>
            <p className="text-xs text-amber-300 font-semibold mt-2 tracking-wider uppercase font-cinzel">
              Click chest or use buttons below to open
            </p>
          </div>
        )}

        {/* Bottom Gacha Console (Golden Beveled Piltover Console from Screenshot) */}
        <div className="relative z-30 w-full flex flex-col items-center">
          <div className="relative flex items-center justify-center gap-1 sm:gap-3 bg-slate-950/90 border-2 border-amber-500/60 rounded-full p-1.5 sm:p-2 shadow-[0_0_30px_rgba(0,0,0,0.9)] max-w-2xl w-full">
            {/* Left Button: 10 OPEN 1 TIME(S) */}
            <button
              disabled={isOpening || !canAfford}
              onClick={() => onOpen(1)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-6 rounded-full font-black tracking-widest text-xs sm:text-sm uppercase transition-all duration-200 bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-slate-900/90 hover:from-amber-600 hover:to-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 hover:border-amber-300 shadow-md active:scale-95 disabled:opacity-50"
            >
              <Key className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-cinzel whitespace-nowrap">
                10 OPEN 1 TIME(S)
              </span>
            </button>

            {/* Center Metallic Dial / Medallion */}
            <div
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 via-amber-600 to-amber-950 p-1 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => !isOpening && onOpen(1)}
              title="Current 5-draw milestone cycle"
            >
              <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center border border-amber-500/50">
                <Key className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black text-amber-300 font-mono">
                  {rollsInCycle}/5
                </span>
              </div>
              <div className="absolute -bottom-2 w-5 h-5 rounded-full bg-slate-900 border border-amber-400 flex items-center justify-center">
                <Check className="w-3 h-3 text-amber-400" />
              </div>
            </div>

            {/* Right Button: 50 OPEN 5 TIME(S) */}
            <button
              disabled={isOpening || !canAfford}
              onClick={() => onOpen(5)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-6 rounded-full font-black tracking-widest text-xs sm:text-sm uppercase transition-all duration-200 bg-gradient-to-r from-slate-900/90 via-amber-900/60 to-amber-950/80 hover:from-amber-500 hover:to-amber-600 text-amber-300 hover:text-slate-950 border border-amber-500/40 hover:border-amber-300 shadow-md active:scale-95 disabled:opacity-50"
            >
              <Key className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-cinzel whitespace-nowrap">
                50 OPEN 5 TIME(S)
              </span>
            </button>
          </div>

          {/* Sub-bar: Skip Animation Checkbox & High Volume Simulators */}
          <div className="w-full max-w-2xl flex items-center justify-between px-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={skipAnimation}
                onChange={(e) => onToggleSkip(e.target.checked)}
                className="w-4 h-4 rounded border-amber-500/50 text-amber-500 bg-slate-900 focus:ring-0 cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] sm:text-xs text-slate-300 font-bold uppercase tracking-wider font-cinzel">
                SKIP REWARD ANIMATION
              </span>
            </label>

            {/* High Volume Simulation buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                Simulate:
              </span>
              <button
                disabled={isOpening}
                onClick={() => onOpen(10)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-amber-300 border border-amber-500/30 transition-colors"
              >
                10x
              </button>
              <button
                disabled={isOpening}
                onClick={() => onOpen(50)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-amber-300 border border-amber-500/30 transition-colors"
              >
                50x
              </button>
              <button
                disabled={isOpening}
                onClick={() => onOpen(100)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-amber-300 border border-amber-500/30 transition-colors"
              >
                100x
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
