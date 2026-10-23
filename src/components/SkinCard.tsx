import React, { useState } from "react";
import type { SkinItem, SkinRarity } from "../types/loot";
import {
  Sparkles,
  Shield,
  Swords,
  Zap,
  Crosshair,
  HeartHandshake,
} from "lucide-react";

interface SkinCardProps {
  skin: SkinItem;
  isPermanent?: boolean;
  orangeGemstones?: number;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

const RARITY_THEMES: Record<
  SkinRarity,
  {
    border: string;
    glow: string;
    badgeBg: string;
    badgeText: string;
    symbol: string;
  }
> = {
  prestige: {
    border: "border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.55)]",
    glow: "from-amber-400/30 via-yellow-500/10 to-transparent",
    badgeBg:
      "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black",
    badgeText: "PRESTIGE",
    symbol: "👑",
  },
  mythic: {
    border: "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]",
    glow: "from-cyan-400/25 via-sky-500/10 to-transparent",
    badgeBg: "bg-gradient-to-r from-cyan-400 to-sky-600 text-white font-black",
    badgeText: "MYTHIC",
    symbol: "✦",
  },
  legendary: {
    border: "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.45)]",
    glow: "from-orange-500/25 via-amber-600/10 to-transparent",
    badgeBg:
      "bg-gradient-to-r from-orange-500 via-red-500 to-amber-600 text-white font-bold",
    badgeText: "LEGENDARY",
    symbol: "★",
  },
  epic: {
    border: "border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.35)]",
    glow: "from-teal-400/20 via-emerald-500/10 to-transparent",
    badgeBg:
      "bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold",
    badgeText: "EPIC",
    symbol: "◆",
  },
  standard: {
    border: "border-slate-500/80 shadow-[0_0_10px_rgba(148,163,184,0.2)]",
    glow: "from-slate-400/15 via-slate-600/5 to-transparent",
    badgeBg: "bg-slate-700 text-slate-200 font-semibold",
    badgeText: "STANDARD",
    symbol: "•",
  },
};

const ROLE_ICONS = {
  Assassin: Zap,
  Fighter: Swords,
  Mage: Sparkles,
  Marksman: Crosshair,
  Support: HeartHandshake,
  Tank: Shield,
};

export const SkinCard: React.FC<SkinCardProps> = ({
  skin,
  isPermanent = true,
  orangeGemstones,
  size = "md",
  showDetails = true,
  onClick,
  selected = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const theme = RARITY_THEMES[skin.rarity];
  const RoleIcon = ROLE_ICONS[skin.role] || Sparkles;

  const cardSizes = {
    sm: "w-44 h-64 text-xs",
    md: "w-56 h-80 text-sm",
    lg: "w-64 h-96 text-base",
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border-2 overflow-hidden flex flex-col justify-between transition-all duration-300 select-none bg-slate-950 ${
        cardSizes[size]
      } ${theme.border} ${
        onClick ? "cursor-pointer hover:scale-105 hover:shadow-2xl" : ""
      } ${selected ? "ring-4 ring-amber-400 scale-105" : ""}`}
    >
      {/* Real Internet Artwork Background Image */}
      {skin.imageUrl && !imgError ? (
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
          <img
            src={skin.imageUrl}
            alt={skin.skinName}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover object-top transition-all duration-700 ease-out ${
              imgLoaded ? "scale-100 opacity-90" : "scale-105 opacity-0"
            } group-hover:scale-105`}
          />
          {/* Authentic Wild Rift cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/60 pointer-events-none" />
        </div>
      ) : (
        /* Fallback Vector Crest if offline/blocked */
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
          <div
            className="w-24 h-24 rounded-full border-2 border-amber-400/40 flex items-center justify-center shadow-inner relative"
            style={{ backgroundColor: `${skin.accentColor}22` }}
          >
            <RoleIcon className="w-10 h-10 text-amber-300 drop-shadow" />
            <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_20s_linear_infinite]" />
          </div>
          <span className="mt-2 text-xs font-bold text-slate-300 uppercase tracking-widest">
            {skin.champion}
          </span>
        </div>
      )}

      {/* Decorative Gold Runic Corners */}
      <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-300 z-20" />
      <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-300 z-20" />
      <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-300 z-20" />
      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-300 z-20" />

      {/* Top Header: Rarity & Shard/Permanent Badge */}
      <div className="relative z-10 p-2.5 flex items-center justify-between bg-black/60 backdrop-blur-xs border-b border-white/10">
        <span
          className={`px-2 py-0.5 rounded text-[10px] tracking-widest uppercase shadow-md flex items-center gap-1 ${theme.badgeBg}`}
        >
          <span>{theme.symbol}</span>
          <span>{skin.badgeLabel || theme.badgeText}</span>
        </span>

        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border shadow-md ${
            isPermanent
              ? "bg-emerald-950/90 border-emerald-400 text-emerald-300"
              : "bg-purple-950/90 border-purple-400 text-purple-300"
          }`}
        >
          {isPermanent ? "Permanent" : "Shard"}
        </span>
      </div>

      {/* Center Patch Pill (Shows Latest Patch 2026) */}
      {skin.patchVersion && size !== "sm" && (
        <div className="relative z-10 self-center">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-black/75 text-amber-300 border border-amber-500/40 backdrop-blur-xs shadow-md">
            {skin.patchVersion}
          </span>
        </div>
      )}

      {/* Bottom Info: Champion, Skin Title, Gemstones, Stardust */}
      <div className="relative z-10 p-3 bg-gradient-to-t from-black via-slate-950/90 to-transparent border-t border-white/10 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-amber-300 font-bold tracking-wider uppercase drop-shadow">
            {skin.champion}
          </span>
          <span className="text-[10px] text-slate-300 flex items-center gap-1 drop-shadow">
            <RoleIcon className="w-3 h-3 text-amber-400" />
            {skin.role}
          </span>
        </div>

        <h3
          className="font-extrabold text-slate-100 text-xs sm:text-sm tracking-wide truncate drop-shadow-md"
          title={skin.skinName}
        >
          {skin.skinName}
        </h3>

        {/* Orange Gemstone Bundle Pill (when dropped) */}
        {orangeGemstones !== undefined && (
          <div className="mt-1 pt-1.5 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-semibold text-[11px] flex items-center gap-1">
              💎 Orange Gemstone
            </span>
            <span className="text-amber-300 font-black flex items-center gap-1 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/50 shadow-sm">
              +{orangeGemstones}
            </span>
          </div>
        )}

        {showDetails && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/10">
            <span>Disenchant:</span>
            <span className="text-sky-300 font-bold">
              +{skin.disenchantYield} ✨
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
