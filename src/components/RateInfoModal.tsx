import React from "react";
import { X, Info, Sparkles, Diamond, ShieldCheck } from "lucide-react";
import type { Language } from "../utils/i18n";

interface RateInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const RateInfoModal: React.FC<RateInfoModalProps> = ({
  isOpen,
  onClose,
  lang = "th",
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
              {lang === "th"
                ? "กติกาการสุ่มและอัตราดรอป (PRESTIGE SELECT)"
                : "Loot Rules & Drop Rates (PRESTIGE SELECT)"}
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
              {lang === "th"
                ? "1. ภาพรวมตู้สุ่ม PRESTIGE SELECT"
                : "1. Prestige Select Overview"}
            </h4>
            <p>
              {lang === "th" ? (
                <>
                  ตู้สุ่มจำลองฟรีไม่จำกัด (Unlimited Free Sandbox) การันตีสกินระดับ{" "}
                  <strong>Mythic / Prestige พิเศษในรอบ 100 สุ่ม</strong> (Pity
                  System) การเปิด 1 กล่องจะได้รับ 2 รางวัลพร้อมกันเสมอ:
                  <strong> ของรางวัลสกิน</strong> (สกินถาวรหรือเศษสกิน) และถุง
                  <strong> อัญมณีสีส้ม (Orange Gemstones)</strong>
                </>
              ) : (
                <>
                  Unlimited Free Sandbox simulator. Guaranteed featured{" "}
                  <strong>Mythic / Prestige skin at pull #100</strong>. Opening a
                  chest yields two simultaneous drops:
                  <strong> Skin Content</strong> (Permanent Skin or Shard) and
                  a bundle of <strong>Orange Gemstones</strong>.
                </>
              )}
            </p>
          </div>

          {/* Section 2: Skin Probabilities */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-cyan-300 text-sm mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              {lang === "th"
                ? "2. อัตราความน่าจะเป็นของสกิน"
                : "2. Skin Content Probability"}
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">
                  {lang === "th"
                    ? "โอกาสได้สกินถาวร (Permanent)"
                    : "Permanent Skin Drop"}
                </span>
                <span className="text-emerald-400 font-extrabold text-base">
                  5.00%
                </span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">
                  {lang === "th"
                    ? "โอกาสได้เศษสกิน (Skin Shard)"
                    : "Skin Shard Drop"}
                </span>
                <span className="text-purple-400 font-extrabold text-base">
                  95.00%
                </span>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="font-semibold text-slate-300 mb-1">
                {lang === "th"
                  ? "สัดส่วนระดับความหายาก (Rarity Tiers):"
                  : "Rarity Distribution:"}
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-slate-900">
                <span>Standard (สกินทั่วไป)</span>
                <span className="font-mono text-slate-200 font-bold">~71.00%</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-slate-900">
                <span className="text-teal-300">Epic (สกินเอปิก)</span>
                <span className="font-mono text-teal-300 font-bold">~25.00%</span>
              </div>
              <div className="flex justify-between py-1 px-2 rounded bg-slate-900">
                <span className="text-orange-400">Legendary (สกินเลเจนดารี)</span>
                <span className="font-mono text-orange-400 font-bold">~3.50%</span>
              </div>
              <div className="flex justify-between py-1.5 px-2 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 font-bold">
                <span>Mythic / Prestige Select (เพรสทีจ)</span>
                <span className="font-mono text-yellow-300 text-right">
                  0.0003% - 0.0006% / สกิน ({lang === "th" ? "การันตีรอบที่ 100" : "Pity pull #100"})
                </span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-500 italic">
              {lang === "th"
                ? "*ในเกมจริงสกิน Prestige มีโอกาสสุ่มเจอตรงๆ น้อยมาก (~0.0003% - 0.0006% ต่อตัว) ผู้เล่นจะได้ผ่านระบบการันตีรอบที่ 100 (Pity) หรือสะสมอัญมณีสีส้มไปแลกในร้านค้า"
                : "*In-game, Prestige skins have an extremely low direct pull rate (~0.0003% - 0.0006% per skin). They are primarily acquired via 100-pull Pity or Orange Gemstone store redemption."}
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
            {lang === "th" ? "เข้าใจแล้ว" : "Understood"}
          </button>
        </div>
      </div>
    </div>
  );
};
