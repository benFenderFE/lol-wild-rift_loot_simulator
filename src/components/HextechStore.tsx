import React from "react";
import { ORANGE_GEMSTONE_STORE } from "../data/skins";
import type { SkinItem, StoreItem } from "../types/loot";
import { SkinCard } from "./SkinCard";
import { Diamond, Crown, Sparkles, Check } from "lucide-react";
import { soundEngine } from "../utils/audio";

interface HextechStoreProps {
  orangeGemstones: number;
  ownedSkins: SkinItem[];
  onRedeemSkin: (storeItem: StoreItem) => void;
}

export const HextechStore: React.FC<HextechStoreProps> = ({
  orangeGemstones,
  ownedSkins,
  onRedeemSkin,
}) => {
  const isSkinOwned = (skinId: string) => {
    return ownedSkins.some((s) => s.id === skinId);
  };

  const handleRedeem = (item: StoreItem) => {
    if (orangeGemstones >= item.gemstoneCost && !isSkinOwned(item.skin.id)) {
      soundEngine.playCardReveal("prestige");
      onRedeemSkin(item);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Store Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/40 p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Mythic & Prestige Vault</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 tracking-wider">
            ORANGE GEMSTONE REDEEM SHOP
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Use Orange Gemstones acquired from Hextech Chests to unlock limited
            Mythic skins, Prestige editions, and exclusive chromas.
          </p>
        </div>

        {/* Live Balance Card */}
        <div className="relative z-10 bg-slate-950/90 border border-amber-500/50 rounded-xl p-4 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 text-amber-400">
            <Diamond className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">
              Your Orange Gemstones
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {orangeGemstones.toLocaleString()} 💎
            </div>
          </div>
        </div>
      </div>

      {/* Store Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ORANGE_GEMSTONE_STORE.map((item) => {
          const owned = isSkinOwned(item.skin.id);
          const canAfford = orangeGemstones >= item.gemstoneCost;

          return (
            <div
              key={item.id}
              className={`relative bg-slate-900/90 border rounded-2xl p-4 flex flex-col items-center justify-between shadow-xl transition-all duration-300 ${
                item.featured
                  ? "border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.2)]"
                  : "border-slate-800"
              }`}
            >
              {/* Badges */}
              <div className="w-full flex items-center justify-between mb-2">
                {item.featured && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/40">
                    Featured
                  </span>
                )}
                {item.limited && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-400/40">
                    Limited
                  </span>
                )}
              </div>

              {/* Skin Card */}
              <SkinCard
                skin={item.skin}
                isPermanent={true}
                size="sm"
                showDetails={false}
              />

              {/* Purchase Details */}
              <div className="w-full mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Exchange Price:</span>
                  <span className="font-extrabold text-amber-300 text-sm flex items-center gap-1">
                    <Diamond className="w-3.5 h-3.5 text-amber-400" />
                    {item.gemstoneCost}
                  </span>
                </div>

                <button
                  disabled={owned || !canAfford}
                  onClick={() => handleRedeem(item)}
                  className={`w-full py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md ${
                    owned
                      ? "bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default"
                      : canAfford
                        ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  }`}
                >
                  {owned ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Already In Vault</span>
                    </>
                  ) : canAfford ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Redeem Skin</span>
                    </>
                  ) : (
                    <span>
                      Need {item.gemstoneCost - orangeGemstones} More Gems
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
