import React from "react";
import { X, Info, Sparkles, Diamond, ShieldCheck } from "lucide-react";

interface RateInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RateInfoModal: React.FC<RateInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider">
              Hextech Crafting Loot Rules & Drop Rates
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: Overview */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              1. Hextech Chest Overview
            </h4>
            <p>
              Each Hextech Chest costs{" "}
              <strong>10 Hextech Keys (150 Wild Cores)</strong>. Opening a chest
              yields two independent drops simultaneously:
              <strong> Skin Content</strong> (Permanent Skin or Skin Shard) and
              a bundle of <strong>Orange Gemstones</strong>.
            </p>
          </div>

          {/* Section 2: Skin Probabilities */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-cyan-300 text-sm mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              2. Skin Content Probability
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">
                  Permanent Skin Drop
                </span>
                <span className="text-emerald-400 font-extrabold text-base">
                  5.00%
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">Skin Shard Drop</span>
                <span className="text-purple-400 font-extrabold text-base">
                  95.00%
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              *Tiers represented inside the eligible skin pool include Standard
              (~35%), Epic (~50%), Legendary (~13%), and Mythic/Prestige (~2%).
            </p>
          </div>

          {/* Section 3: Orange Gemstone Probabilities */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-amber-300 text-sm mb-2 flex items-center gap-1.5">
              <Diamond className="w-4 h-4 text-amber-400" />
              3. Orange Gemstones Drop Table
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between py-1 px-2 rounded bg-slate-900">
                <span>8 Orange Gemstones</span>
                <span className="font-bold text-slate-200">70.00%</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-slate-900">
                <span>12 Orange Gemstones</span>
                <span className="font-bold text-slate-200">17.00%</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-slate-900">
                <span>16 Orange Gemstones</span>
                <span className="font-bold text-slate-200">8.00%</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-slate-900">
                <span>20 Orange Gemstones</span>
                <span className="font-bold text-slate-200">4.90%</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold">
                <span>1,000 Orange Gemstones (Jackpot)</span>
                <span className="text-yellow-300">0.10% (1 in 1,000)</span>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">
              Theoretical Expected Value (EV):{" "}
              <strong>~10.90 Orange Gemstones</strong> per chest.
            </div>
          </div>

          {/* Section 4: Silver Stardust Crafting */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-sky-300 text-sm mb-2">
              4. Silver Stardust Disenchant & Forge Values
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>
                <strong>Standard Skin Shard:</strong> Yields 150 Stardust
                (Forging cost: 450)
              </li>
              <li>
                <strong>Epic Skin Shard:</strong> Yields 250 Stardust (Forging
                cost: 750)
              </li>
              <li>
                <strong>Legendary Skin Shard:</strong> Yields 350 Stardust
                (Forging cost: 1,000)
              </li>
              <li>
                <strong>Prestige Skin Shard:</strong> Yields 600 Stardust
                (Forging cost: 1,500)
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase transition-all shadow-md"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
