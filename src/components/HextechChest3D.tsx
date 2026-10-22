import React from "react";
import { Sparkles, Key } from "lucide-react";
import type { BannerType } from "../types/loot";

interface HextechChestProps {
  banner: BannerType;
  isOpening: boolean;
  onOpen: (count: number) => void;
  canAfford: boolean;
  keysCount: number;
  skipAnimation: boolean;
  onToggleSkip: (val: boolean) => void;
}

export const HextechChest3D: React.FC<HextechChestProps> = ({
  banner,
  isOpening,
  onOpen,
  canAfford,
  keysCount,
  skipAnimation,
  onToggleSkip,
}) => {
  const getBannerInfo = () => {
    switch (banner) {
      case "event_mythic":
        return {
          title: "PRESTIGE SELECT & 2026 GACHA BANNER",
          subtitle:
            "Featured: Prestige Select High Noon Yone & Soul Fighter Irelia (Guaranteed at 100 draws)",
          chestGlow: "from-amber-500/30 via-red-600/20 to-transparent",
          crystalColor: "bg-amber-400 shadow-[0_0_40px_#f59e0b]",
          costLabel: "100 Wild Cores / roll",
          open1Label: "Summon 1x (100 WC)",
          open5Label: "Summon 5x (500 WC)",
          open10Label: "Summon 10x (1,000 WC)",
        };
      case "poro":
        return {
          title: "PORO CHEST (FREE-TO-PLAY)",
          subtitle:
            "Earn Poro Energy toward guaranteed Random Skin Chest at 5,000 Energy",
          chestGlow: "from-pink-400/20 via-purple-500/10 to-transparent",
          crystalColor: "bg-pink-400 shadow-[0_0_35px_#f472b6]",
          costLabel: "200 Poro Coins / chest",
          open1Label: "Open 1x (200 Coins)",
          open5Label: "Open 5x (1,000 Coins)",
          open10Label: "Open 10x (2,000 Coins)",
        };
      case "hextech":
      default:
        return {
          title: "HEXTECH CHEST (WILD RIFT OFFICIAL)",
          subtitle:
            "Guaranteed Skin / Shard + Orange Gemstones (Jackpot 1,000 OG: 0.10%)",
          chestGlow: "from-amber-400/25 via-cyan-500/20 to-transparent",
          crystalColor: "bg-cyan-400 shadow-[0_0_45px_#22d3ee]",
          costLabel: "10 Hextech Keys (150 Wild Cores) per chest",
          open1Label: "Open 1 Chest (10 Keys)",
          open5Label: "Open 5 Chests (50 Keys)",
          open10Label: "Open 10 Chests (100 Keys)",
        };
    }
  };

  const info = getBannerInfo();

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Ambient background particle aura */}
      <div
        className={`absolute -inset-10 bg-radial ${info.chestGlow} blur-3xl pointer-events-none opacity-80`}
      />

      {/* Banner Header Info */}
      <div className="text-center z-10 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs tracking-widest font-bold uppercase mb-2 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Loot Patch 2026 Active</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 tracking-wider">
          {info.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300/80 max-w-xl mx-auto mt-1 font-medium">
          {info.subtitle}
        </p>
      </div>

      {/* Hextech Chest Visual Stage */}
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center my-2 select-none group">
        {/* Animated magic runic circles */}
        <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-[spin_24s_linear_infinite]" />
        <div className="absolute inset-6 rounded-full border border-dashed border-cyan-400/30 animate-[spin_18s_linear_infinite_reverse]" />
        <div className="absolute inset-12 rounded-full border border-amber-400/20" />

        {/* Floating Light Pillars */}
        <div className="absolute w-2 h-72 bg-gradient-to-t from-transparent via-cyan-400/30 to-transparent blur-xs rotate-45" />
        <div className="absolute w-2 h-72 bg-gradient-to-t from-transparent via-amber-400/30 to-transparent blur-xs -rotate-45" />

        {/* The Hextech Chest SVG model */}
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
            className="w-56 h-56 sm:w-68 sm:h-68 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
          >
            <defs>
              <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
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

            {/* Chest Shadow */}
            <ellipse
              cx="120"
              cy="210"
              rx="75"
              ry="14"
              fill="#000"
              opacity="0.6"
            />

            {/* Chest Lower Base */}
            <path
              d="M 50 115 L 190 115 L 180 185 L 60 185 Z"
              fill="url(#chestBody)"
              stroke="url(#goldRim)"
              strokeWidth="4"
            />

            {/* Hextech Runic Inscriptions on Base */}
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

            {/* Chest Upper Lid */}
            <path
              d="M 40 115 Q 120 70 200 115 L 195 125 L 45 125 Z"
              fill="url(#chestBody)"
              stroke="url(#goldRim)"
              strokeWidth="4"
            />

            {/* Gold Corner Plates & Rivets */}
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

            {/* Center Piltover Hextech Gemstone Lock Core */}
            <g transform="translate(120, 120)">
              {/* Outer Golden Dial */}
              <circle
                r="26"
                fill="#0f172a"
                stroke="url(#goldRim)"
                strokeWidth="3.5"
              />
              <circle
                r="22"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.8"
              />

              {/* Glowing Hextech Crystal Core */}
              <polygon
                points="0,-14 12,-4 8,13 -8,13 -12,-4"
                fill="url(#hextechCore)"
                stroke="#e0f2fe"
                strokeWidth="1.5"
                filter="url(#hextechGlow)"
              />
              <circle r="4" fill="#ffffff" filter="url(#hextechGlow)" />
            </g>

            {/* Subtle highlight sheen */}
            <path
              d="M 60 95 Q 120 75 180 95"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              opacity="0.35"
            />
          </svg>

          {/* Central Pulsating Halo */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full pointer-events-none ${
              info.crystalColor
            } ${isOpening ? "scale-150 animate-ping" : "animate-pulse"}`}
          />
        </div>
      </div>

      {/* Opening Controls Bar */}
      <div className="z-10 w-full max-w-xl flex flex-col items-center gap-3">
        {/* Key Balance & Price Reminder */}
        <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Keys in bag:</span>
            <span className="text-amber-300 font-bold">{keysCount}</span>
          </span>

          <label className="flex items-center gap-1.5 cursor-pointer bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 hover:border-slate-500 transition-colors">
            <input
              type="checkbox"
              checked={skipAnimation}
              onChange={(e) => onToggleSkip(e.target.checked)}
              className="accent-amber-400 rounded cursor-pointer"
            />
            <span className="text-[11px] text-slate-300">
              Fast Mode (Skip Anim)
            </span>
          </label>
        </div>

        {/* Buttons Row: 1x, 5x, 10x */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <button
            disabled={isOpening || !canAfford}
            onClick={() => onOpen(1)}
            className="group relative px-4 py-3 rounded-lg font-bold tracking-wider text-xs sm:text-sm uppercase transition-all duration-200 overflow-hidden bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-t border-amber-200"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
            <span className="relative z-10 flex flex-col items-center">
              <span>Open 1x</span>
              <span className="text-[10px] font-semibold text-slate-900/80">
                10 Keys (150 WC)
              </span>
            </span>
          </button>

          <button
            disabled={isOpening || !canAfford}
            onClick={() => onOpen(5)}
            className="group relative px-4 py-3 rounded-lg font-bold tracking-wider text-xs sm:text-sm uppercase transition-all duration-200 overflow-hidden bg-gradient-to-b from-sky-400 via-cyan-500 to-sky-600 text-slate-950 shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.6)] hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-t border-sky-200"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
            <span className="relative z-10 flex flex-col items-center">
              <span>Open 5x</span>
              <span className="text-[10px] font-semibold text-slate-900/80">
                50 Keys (750 WC)
              </span>
            </span>
          </button>

          <button
            disabled={isOpening || !canAfford}
            onClick={() => onOpen(10)}
            className="group relative px-4 py-3 rounded-lg font-bold tracking-wider text-xs sm:text-sm uppercase transition-all duration-200 overflow-hidden bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-t border-yellow-100"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
            <span className="relative z-10 flex flex-col items-center">
              <span>Open 10x</span>
              <span className="text-[10px] font-semibold text-slate-900/80">
                100 Keys (1,500 WC)
              </span>
            </span>
          </button>
        </div>

        {/* Quick Fast Sim for Big Data Collectors */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-slate-400">
            Data Collector Sim:
          </span>
          <button
            disabled={isOpening}
            onClick={() => onOpen(50)}
            className="text-[11px] text-amber-300 hover:text-amber-200 bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded border border-amber-500/30 font-semibold transition-colors"
          >
            Simulate 50x
          </button>
          <button
            disabled={isOpening}
            onClick={() => onOpen(100)}
            className="text-[11px] text-amber-300 hover:text-amber-200 bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded border border-amber-500/30 font-semibold transition-colors"
          >
            Simulate 100x
          </button>
        </div>
      </div>
    </div>
  );
};
