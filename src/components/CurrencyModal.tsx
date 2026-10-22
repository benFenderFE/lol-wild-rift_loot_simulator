import React from "react";
import { X, Coins, Key, Diamond, Sparkles } from "lucide-react";

interface CurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    type: "wildCores" | "hextechKeys" | "orangeGemstones" | "silverStardust",
    amount: number,
  ) => void;
}

export const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Simulator Sandbox Wallet
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          Add free simulation currency anytime to test high-volume gacha rates
          without limits.
        </p>

        <div className="mt-4 space-y-3">
          {/* Wild Cores */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                Wild Cores
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onAdd("wildCores", 1500)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-bold transition-colors"
              >
                +1,500
              </button>
              <button
                onClick={() => onAdd("wildCores", 10000)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-bold transition-colors"
              >
                +10,000
              </button>
            </div>
          </div>

          {/* Hextech Keys */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-semibold text-slate-200">
                Hextech Keys
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onAdd("hextechKeys", 50)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-bold transition-colors"
              >
                +50 Keys
              </button>
              <button
                onClick={() => onAdd("hextechKeys", 500)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-bold transition-colors"
              >
                +500 Keys
              </button>
            </div>
          </div>

          {/* Orange Gemstones */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Diamond className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">
                Orange Gemstones
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onAdd("orangeGemstones", 100)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-bold transition-colors"
              >
                +100 💎
              </button>
              <button
                onClick={() => onAdd("orangeGemstones", 1000)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-xs font-bold transition-colors"
              >
                +1,000 💎
              </button>
            </div>
          </div>

          {/* Silver Stardust */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-300" />
              <span className="text-xs font-semibold text-slate-200">
                Silver Stardust
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onAdd("silverStardust", 1000)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-sky-300 text-xs font-bold transition-colors"
              >
                +1,000 ✨
              </button>
              <button
                onClick={() => onAdd("silverStardust", 5000)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-sky-300 text-xs font-bold transition-colors"
              >
                +5,000 ✨
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
