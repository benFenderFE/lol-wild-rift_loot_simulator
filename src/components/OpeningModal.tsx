import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import type { DropResult } from "../types/loot";
import { SkinCard } from "./SkinCard";
import { soundEngine } from "../utils/audio";
import { Sparkles, Trophy, RotateCcw, Check, Diamond } from "lucide-react";

interface OpeningModalProps {
  isOpen: boolean;
  drops: DropResult[];
  onClose: () => void;
  onOpenAgain: (count: number) => void;
}

export const OpeningModal: React.FC<OpeningModalProps> = ({
  isOpen,
  drops,
  onClose,
  onOpenAgain,
}) => {
  if (!isOpen || drops.length === 0) return null;

  const totalOrangeGems = drops.reduce((sum, d) => sum + d.orangeGemstones, 0);
  const permanentCount = drops.filter((d) => d.isPermanent).length;
  const hasJackpot = drops.some(
    (d) => d.isJackpot || d.orangeGemstones === 1000,
  );
  const hasMythic = drops.some(
    (d) => d.skin.rarity === "mythic" || d.skin.rarity === "prestige",
  );

  useEffect(() => {
    if (hasJackpot) {
      soundEngine.playJackpot();
      // Grand golden confetti blast
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#fef08a", "#06b6d4", "#e0f2fe"],
      });
    } else if (hasMythic) {
      soundEngine.playCardReveal("mythic");
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#38bdf8", "#f59e0b"],
      });
    } else {
      soundEngine.playChestBurst();
    }
  }, [hasJackpot, hasMythic]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fade-in overflow-y-auto">
      {/* Background radial rays */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-cyan-950/20 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-5xl bg-slate-900/95 border-2 border-amber-500/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] p-6 flex flex-col items-center my-auto">
        {/* Top Gold Corner Accents */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-amber-300 rounded-tl-lg" />
        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-amber-300 rounded-tr-lg" />
        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-amber-300 rounded-bl-lg" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-amber-300 rounded-br-lg" />

        {/* Jackpot / High Tier Announcement Banner */}
        {hasJackpot && (
          <div className="w-full mb-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-center tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse">
            <Trophy className="w-6 h-6 text-slate-950" />
            <span className="text-sm sm:text-lg">
              JACKPOT! 1,000 ORANGE GEMSTONES WON! (0.10% CHANCE)
            </span>
            <Trophy className="w-6 h-6 text-slate-950" />
          </div>
        )}

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hextech Crafting Unlocked</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-wider">
            REWARDS ACQUIRED
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            You opened {drops.length} {drops.length === 1 ? "chest" : "chests"}
          </p>
        </div>

        {/* Reward Cards Grid */}
        <div
          className={`w-full max-h-[60vh] overflow-y-auto px-2 py-4 flex flex-wrap items-center justify-center gap-4 scrollbar-thin scrollbar-thumb-amber-500/40 ${
            drops.length > 5 ? "justify-center" : ""
          }`}
        >
          {drops.map((drop, idx) => (
            <div
              key={drop.id}
              className="animate-[fadeInUp_0.4s_ease-out_forwards]"
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <SkinCard
                skin={drop.skin}
                isPermanent={drop.isPermanent}
                orangeGemstones={drop.orangeGemstones}
                size={drops.length > 4 ? "sm" : "md"}
                showDetails={true}
              />
            </div>
          ))}
        </div>

        {/* Pull Aggregate Summary Bar */}
        <div className="w-full mt-4 p-3 bg-slate-950/80 rounded-xl border border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Diamond className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Total Orange Gemstones:</span>
            <span className="text-amber-300 font-extrabold text-base">
              +{totalOrangeGems}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Permanent Skins:</span>
            <span className="text-emerald-300 font-extrabold text-base">
              {permanentCount}{" "}
              <span className="text-xs text-slate-400 font-normal">
                ({drops.length - permanentCount} shards)
              </span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 w-full">
          <button
            onClick={() => onOpenAgain(drops.length)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold tracking-wider text-xs sm:text-sm uppercase bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all hover:scale-105 active:scale-95 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Open Again ({drops.length}x)</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-extrabold tracking-wider text-xs sm:text-sm uppercase bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.4)] border-t border-amber-200"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Collect</span>
          </button>
        </div>
      </div>
    </div>
  );
};
