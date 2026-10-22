import React from "react";
import type { MilestoneReward } from "../types/loot";
import { Gift, Check, Trophy } from "lucide-react";
import { soundEngine } from "../utils/audio";

interface MilestoneTrackerProps {
  currentChests: number;
  milestones: MilestoneReward[];
  onClaimMilestone: (index: number) => void;
  onResetMilestones?: () => void;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  currentChests,
  milestones,
  onClaimMilestone,
}) => {
  const maxThreshold = milestones[milestones.length - 1]?.threshold || 200;
  const progressPercent = Math.min(100, (currentChests / maxThreshold) * 100);

  const handleClaim = (idx: number) => {
    soundEngine.playChestBurst();
    onClaimMilestone(idx);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-amber-500/30 rounded-xl p-2.5 sm:p-3 shadow-lg backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-cinzel">
              Hextech Milestone Track
            </h3>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400">Progress: </span>
          <span className="text-xs font-black text-amber-300 font-mono">
            {currentChests} / {maxThreshold}
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full my-2">
        {/* Track Line */}
        <div className="w-full h-2 bg-slate-950 rounded-full border border-slate-700 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-amber-300 transition-all duration-500 rounded-full shadow-[0_0_10px_#f59e0b]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Milestone Nodes */}
        <div className="relative flex justify-between items-start mt-2">
          {milestones.map((m, idx) => {
            const isUnlocked = currentChests >= m.threshold;
            return (
              <div
                key={m.threshold}
                className="flex flex-col items-center text-center group cursor-pointer"
                onClick={() => isUnlocked && !m.claimed && handleClaim(idx)}
              >
                {/* Node Pin */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold transition-all duration-300 shadow-md ${
                    m.claimed
                      ? "bg-emerald-950 border-emerald-400 text-emerald-300"
                      : isUnlocked
                        ? "bg-amber-500 border-yellow-200 text-slate-950 animate-bounce ring-2 ring-amber-400/40"
                        : "bg-slate-900 border-slate-700 text-slate-500"
                  }`}
                  title={`${m.label} (at ${m.threshold} chests)`}
                >
                  {m.claimed ? (
                    <Check className="w-3 h-3" />
                  ) : isUnlocked ? (
                    <Gift className="w-3 h-3" />
                  ) : (
                    <span>{m.threshold}</span>
                  )}
                </div>

                {/* Milestone Label */}
                <span className="mt-0.5 text-[9px] font-bold text-slate-300 whitespace-nowrap hidden sm:block">
                  {m.threshold}
                </span>

                {/* Claim Button / Status Pill */}
                {isUnlocked && !m.claimed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClaim(idx);
                    }}
                    className="mt-0.5 px-1 py-0.2 rounded text-[8px] font-black uppercase bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-[0_0_6px_#f59e0b] hover:brightness-110 active:scale-95 transition-all"
                  >
                    Claim
                  </button>
                )}
                {m.claimed && (
                  <span className="mt-0.5 text-[8px] text-emerald-400 font-semibold uppercase">
                    Claimed
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
