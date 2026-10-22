import React, { useEffect, useState, useMemo } from "react";
import confetti from "canvas-confetti";
import type { DropResult } from "../types/loot";
import { SkinCard } from "./SkinCard";
import { soundEngine } from "../utils/audio";
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Check,
  Diamond,
  Filter,
  Crown,
  Flame,
  Shield,
  Layers,
} from "lucide-react";

import { type Language, translations } from "../utils/i18n";

interface OpeningModalProps {
  isOpen: boolean;
  drops: DropResult[];
  onClose: () => void;
  onOpenAgain: (count: number) => void;
  lang?: Language;
}

type FilterCategory =
  | "all"
  | "permanent"
  | "shard"
  | "gemstones"
  | "mythic"
  | "legendary"
  | "epic";

export const OpeningModal: React.FC<OpeningModalProps> = ({
  isOpen,
  drops,
  onClose,
  onOpenAgain,
  lang = "th",
}) => {
  const t = translations[lang] || translations.th;
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>("all");

  const hasJackpot =
    isOpen &&
    drops.some((d) => d.isJackpot || d.orangeGemstones === 1000);
  const hasMythic =
    isOpen &&
    drops.some(
      (d) => d.skin.rarity === "mythic" || d.skin.rarity === "prestige",
    );

  useEffect(() => {
    if (!isOpen || drops.length === 0) return;

    if (hasJackpot) {
      soundEngine.playJackpot();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#fef08a", "#06b6d4", "#e0f2fe"],
      });
    } else if (hasMythic) {
      soundEngine.playCardReveal("mythic");
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#38bdf8", "#f59e0b"],
      });
    } else {
      soundEngine.playChestBurst();
    }
  }, [isOpen, drops, hasJackpot, hasMythic]);

  const totalOrangeGems = useMemo(
    () => drops.reduce((sum, d) => sum + d.orangeGemstones, 0),
    [drops],
  );
  const permanentCount = useMemo(
    () => drops.filter((d) => d.isPermanent).length,
    [drops],
  );
  const shardCount = drops.length - permanentCount;
  const gemstoneDropsCount = useMemo(
    () => drops.filter((d) => d.orangeGemstones > 0).length,
    [drops],
  );
  const mythicCount = useMemo(
    () =>
      drops.filter(
        (d) => d.skin.rarity === "mythic" || d.skin.rarity === "prestige",
      ).length,
    [drops],
  );
  const legendaryCount = useMemo(
    () => drops.filter((d) => d.skin.rarity === "legendary").length,
    [drops],
  );
  const epicCount = useMemo(
    () => drops.filter((d) => d.skin.rarity === "epic").length,
    [drops],
  );

  const filteredDrops = useMemo(() => {
    switch (selectedFilter) {
      case "permanent":
        return drops.filter((d) => d.isPermanent);
      case "shard":
        return drops.filter((d) => !d.isPermanent);
      case "gemstones":
        return drops.filter((d) => d.orangeGemstones > 0);
      case "mythic":
        return drops.filter(
          (d) => d.skin.rarity === "mythic" || d.skin.rarity === "prestige",
        );
      case "legendary":
        return drops.filter((d) => d.skin.rarity === "legendary");
      case "epic":
        return drops.filter((d) => d.skin.rarity === "epic");
      case "all":
      default:
        return drops;
    }
  }, [drops, selectedFilter]);

  if (!isOpen || drops.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Background radial rays */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-cyan-950/20 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/95 border-2 border-amber-500/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] p-4 sm:p-5 flex flex-col items-center my-auto overflow-hidden">
        {/* Top Gold Corner Accents */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-amber-300 rounded-tl-lg" />
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-amber-300 rounded-tr-lg" />
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-amber-300 rounded-bl-lg" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-amber-300 rounded-br-lg" />

        {/* Jackpot Announcement Banner */}
        {hasJackpot && (
          <div className="w-full mb-3 py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-center tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse shrink-0">
            <Trophy className="w-5 h-5 text-slate-950" />
            <span className="text-xs sm:text-sm">
              {t.jackpotBanner}
            </span>
            <Trophy className="w-5 h-5 text-slate-950" />
          </div>
        )}

        {/* Modal Header (Compact for laptop) */}
        <div className="text-center mb-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-amber-300 font-bold uppercase tracking-widest bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30 mb-0.5">
            <Sparkles className="w-3 h-3" />
            <span>{t.prestigeSelect}</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-100 tracking-wider font-cinzel">
            {t.rewardsTitle}
          </h2>
          <p className="text-[11px] text-slate-400">
            {lang === "th"
              ? `เปิดไปทั้งหมด ${drops.length} กล่อง`
              : `You opened ${drops.length} ${drops.length === 1 ? "chest" : "chests"}`}
          </p>
        </div>

        {/* Category Filter Tabs Bar */}
        <div className="w-full flex items-center justify-center gap-1.5 flex-wrap py-2 border-y border-slate-800/80 mb-2 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1 mr-1 hidden sm:flex">
            <Filter className="w-3 h-3 text-amber-400" />
            {t.bannerCategory}
          </span>

          <button
            onClick={() => {
              soundEngine.playClick();
              setSelectedFilter("all");
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedFilter === "all"
                ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                : "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
            }`}
          >
            {t.filterAll} ({drops.length})
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setSelectedFilter("permanent");
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedFilter === "permanent"
                ? "bg-emerald-500 text-slate-950 shadow-md scale-105"
                : "bg-slate-800/80 text-emerald-400 hover:text-emerald-300 hover:bg-slate-700"
            }`}
          >
            <Crown className="w-3 h-3" />
            <span>{t.filterPermanent} ({permanentCount})</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setSelectedFilter("shard");
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedFilter === "shard"
                ? "bg-cyan-500 text-slate-950 shadow-md scale-105"
                : "bg-slate-800/80 text-cyan-400 hover:text-cyan-300 hover:bg-slate-700"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{t.filterShards} ({shardCount})</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setSelectedFilter("gemstones");
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedFilter === "gemstones"
                ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                : "bg-slate-800/80 text-amber-400 hover:text-amber-300 hover:bg-slate-700"
            }`}
          >
            <Diamond className="w-3 h-3" />
            <span>{t.filterGemstones} ({gemstoneDropsCount})</span>
          </button>

          {mythicCount > 0 && (
            <button
              onClick={() => {
                soundEngine.playClick();
                setSelectedFilter("mythic");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedFilter === "mythic"
                  ? "bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-md scale-105"
                  : "bg-slate-800/80 text-pink-400 hover:text-pink-300 hover:bg-slate-700"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{t.filterPrestige} ({mythicCount})</span>
            </button>
          )}

          {legendaryCount > 0 && (
            <button
              onClick={() => {
                soundEngine.playClick();
                setSelectedFilter("legendary");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedFilter === "legendary"
                  ? "bg-red-500 text-white shadow-md scale-105"
                  : "bg-slate-800/80 text-red-400 hover:text-red-300 hover:bg-slate-700"
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>{t.filterLegendary} ({legendaryCount})</span>
            </button>
          )}

          {epicCount > 0 && (
            <button
              onClick={() => {
                soundEngine.playClick();
                setSelectedFilter("epic");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedFilter === "epic"
                  ? "bg-sky-500 text-slate-950 shadow-md scale-105"
                  : "bg-slate-800/80 text-sky-400 hover:text-sky-300 hover:bg-slate-700"
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Epic ({epicCount})</span>
            </button>
          )}
        </div>

        {/* Reward Cards Scrollable Container (laptop screen friendly height) */}
        <div className="w-full flex-1 max-h-[46vh] overflow-y-auto px-2 py-2 flex flex-wrap items-center justify-center gap-3.5 scrollbar-thin scrollbar-thumb-amber-500/40">
          {filteredDrops.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No items match this category filter.
            </div>
          ) : (
            filteredDrops.map((drop, idx) => (
              <div
                key={`${drop.id}-${idx}`}
                className="animate-[fadeInUp_0.3s_ease-out_forwards]"
                style={{ animationDelay: `${Math.min(idx * 0.05, 0.4)}s` }}
              >
                <SkinCard
                  skin={drop.skin}
                  isPermanent={drop.isPermanent}
                  orangeGemstones={drop.orangeGemstones}
                  size={drops.length > 5 ? "sm" : "md"}
                  showDetails={true}
                />
              </div>
            ))
          )}
        </div>

        {/* Pull Aggregate Summary Bar */}
        <div className="w-full mt-2 p-2 sm:p-2.5 bg-slate-950/80 rounded-xl border border-white/10 flex flex-wrap items-center justify-around gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <Diamond className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Orange Gemstones:</span>
            <span className="text-amber-300 font-extrabold text-sm font-mono">
              +{totalOrangeGems}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Permanents:</span>
            <span className="text-emerald-300 font-extrabold text-sm font-mono">
              {permanentCount}
            </span>
            <span className="text-[11px] text-slate-500">
              ({shardCount} shards)
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            Showing{" "}
            <strong className="text-amber-300">
              {filteredDrops.length}
            </strong>{" "}
            of {drops.length} items
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 w-full shrink-0">
          <button
            onClick={() => {
              setSelectedFilter("all");
              onOpenAgain(drops.length);
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold tracking-wider text-xs uppercase bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {lang === "th"
                ? `สุ่มอีกครั้ง (${drops.length}x)`
                : `Open Again (${drops.length}x)`}
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedFilter("all");
              onClose();
            }}
            className="flex items-center gap-1.5 px-7 py-2 rounded-lg font-extrabold tracking-wider text-xs uppercase bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.4)] border-t border-amber-200"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t.collectRewards}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
