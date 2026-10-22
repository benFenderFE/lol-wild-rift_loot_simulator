import React, { useState } from "react";
import type { SkinItem } from "../types/loot";
import { SkinCard } from "./SkinCard";
import { Sparkles, Hammer, Trash2, ShieldCheck, Box } from "lucide-react";
import { soundEngine } from "../utils/audio";

interface InventoryWorkshopProps {
  permanentSkins: SkinItem[];
  skinShards: SkinItem[];
  silverStardust: number;
  onDisenchantShard: (shardId: string) => void;
  onDisenchantAllShards: () => void;
  onForgePermanent: (shard: SkinItem) => void;
}

export const InventoryWorkshop: React.FC<InventoryWorkshopProps> = ({
  permanentSkins,
  skinShards,
  silverStardust,
  onDisenchantShard,
  onDisenchantAllShards,
  onForgePermanent,
}) => {
  const [activeTab, setActiveTab] = useState<"shards" | "permanent">("shards");

  const totalDisenchantValue = skinShards.reduce(
    (sum, s) => sum + s.disenchantYield,
    0,
  );

  const handleForge = (shard: SkinItem) => {
    if (silverStardust >= shard.costStardust) {
      soundEngine.playCardReveal(shard.rarity);
      onForgePermanent(shard);
    }
  };

  const handleDisenchant = (shardId: string) => {
    soundEngine.playClick();
    onDisenchantShard(shardId);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Navigation Tabs & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("shards")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === "shards"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Skin Shards ({skinShards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("permanent")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === "permanent"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Owned Permanents ({permanentSkins.length})</span>
          </button>
        </div>

        {/* Stardust Balance & Quick Disenchant */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span className="text-slate-400">Silver Stardust:</span>
            <span className="text-sky-300 font-extrabold">
              {silverStardust.toLocaleString()}
            </span>
          </div>

          {activeTab === "shards" && skinShards.length > 0 && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Disenchant all ${skinShards.length} shards for +${totalDisenchantValue} Silver Stardust?`,
                  )
                ) {
                  onDisenchantAllShards();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-sky-950 text-sky-300 border border-sky-500/40 hover:bg-sky-900 transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Disenchant All (+{totalDisenchantValue} ✨)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab: Skin Shards Workshop */}
      {activeTab === "shards" && (
        <div className="space-y-4">
          {skinShards.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center text-slate-500 text-sm">
              <p>Your Skin Shard inventory is empty.</p>
              <p className="text-xs text-slate-600 mt-1">
                Open Hextech Chests to collect shards for forging!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skinShards.map((shard, index) => {
                const canCraft = silverStardust >= shard.costStardust;
                return (
                  <div
                    key={`${shard.id}-${index}`}
                    className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col items-center shadow-lg transition-all"
                  >
                    <SkinCard
                      skin={shard}
                      isPermanent={false}
                      size="sm"
                      showDetails={false}
                    />

                    {/* Shard Actions */}
                    <div className="w-full mt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                        <span>Forge Cost:</span>
                        <span
                          className={`font-bold ${canCraft ? "text-sky-300" : "text-red-400"}`}
                        >
                          {shard.costStardust} ✨
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleDisenchant(shard.id)}
                          className="px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                          title="Disenchant into Silver Stardust"
                        >
                          +{shard.disenchantYield} ✨
                        </button>

                        <button
                          disabled={!canCraft}
                          onClick={() => handleForge(shard)}
                          className="px-2 py-1.5 rounded bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                          title={
                            canCraft
                              ? "Forge into permanent skin"
                              : "Insufficient Silver Stardust"
                          }
                        >
                          <Hammer className="w-3.5 h-3.5" />
                          <span>Forge</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Owned Permanent Skins */}
      {activeTab === "permanent" && (
        <div className="space-y-4">
          {permanentSkins.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center text-slate-500 text-sm">
              <p>You haven't unlocked any permanent skins yet.</p>
              <p className="text-xs text-slate-600 mt-1">
                Open chests or forge skin shards in the workshop!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {permanentSkins.map((skin, idx) => (
                <div
                  key={`${skin.id}-${idx}`}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col items-center shadow-lg"
                >
                  <SkinCard
                    skin={skin}
                    isPermanent={true}
                    size="sm"
                    showDetails={false}
                  />
                  <div className="w-full mt-2 text-center">
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      Permanent Collection
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
