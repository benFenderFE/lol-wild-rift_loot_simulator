import React, { useState } from "react";
import type { GachaStats } from "../types/loot";
import {
  BarChart3,
  TrendingUp,
  Download,
  RotateCcw,
  Diamond,
  Flame,
} from "lucide-react";

interface StatisticsPanelProps {
  stats: GachaStats;
  onResetStats: () => void;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  stats,
  onResetStats,
}) => {
  const [currencyUnit, setCurrencyUnit] = useState<"USD" | "THB" | "EUR">(
    "USD",
  );
  const [historyFilter, setHistoryFilter] = useState<
    "all" | "permanent" | "jackpot" | "high_tier"
  >("all");

  // Conversion rates roughly based on Wild Rift store packages
  // ~1,000 Wild Cores = $9.99 USD = ~350 THB = ~9.50 EUR
  const getConvertedPrice = (wc: number) => {
    switch (currencyUnit) {
      case "THB":
        return `฿${((wc / 1000) * 350).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case "EUR":
        return `€${((wc / 1000) * 9.5).toFixed(2)}`;
      case "USD":
      default:
        return `$${((wc / 1000) * 9.99).toFixed(2)}`;
    }
  };

  const total = stats.totalChestsOpened;
  const actualAvgOg =
    total > 0 ? (stats.orangeGemstonesTotal / total).toFixed(2) : "0.00";
  const expectedAvgOg = "10.90";

  const actualPermRate =
    total > 0 ? ((stats.permanentCount / total) * 100).toFixed(2) : "0.00";
  const actualJackpotRate =
    total > 0 ? ((stats.jackpotCount / total) * 100).toFixed(2) : "0.00";

  const getLuckLabel = (rating: number) => {
    if (rating >= 140)
      return {
        label: "🔥 SSS-Tier Godlike Luck!",
        color: "text-amber-400 bg-amber-950/80 border-amber-400",
      };
    if (rating >= 115)
      return {
        label: "✨ Blessed by RNGesus",
        color: "text-emerald-400 bg-emerald-950/80 border-emerald-400",
      };
    if (rating >= 90)
      return {
        label: "⚖️ Normal Riot Odds",
        color: "text-sky-400 bg-sky-950/80 border-sky-400",
      };
    if (rating >= 70)
      return {
        label: "🌧️ Slightly Unlucky",
        color: "text-orange-400 bg-orange-950/80 border-orange-400",
      };
    return {
      label: "💀 Cursed by Riot",
      color: "text-red-400 bg-red-950/80 border-red-400",
    };
  };

  const luckMeta = getLuckLabel(stats.luckRating);

  // Filter history
  const filteredHistory = stats.history.filter((item) => {
    if (historyFilter === "permanent") return item.isPermanent;
    if (historyFilter === "jackpot")
      return item.isJackpot || item.orangeGemstones === 1000;
    if (historyFilter === "high_tier") {
      return (
        item.skin.rarity === "legendary" ||
        item.skin.rarity === "mythic" ||
        item.skin.rarity === "prestige"
      );
    }
    return true;
  });

  // Export to CSV
  const exportCSV = () => {
    const headers = [
      "Timestamp",
      "Champion",
      "Skin Name",
      "Rarity",
      "Drop Type",
      "Orange Gemstones",
      "Jackpot",
    ];
    const rows = stats.history.map((d) => [
      new Date(d.timestamp).toISOString(),
      `"${d.skin.champion}"`,
      `"${d.skin.skinName}"`,
      d.skin.rarity,
      d.isPermanent ? "Permanent Skin" : "Skin Shard",
      d.orangeGemstones,
      d.isJackpot ? "YES" : "NO",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wild_rift_gacha_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(stats, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `wild_rift_gacha_stats_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner: Real-World Spending & Luck Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI: Total Chests Opened */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Chests Opened</span>
            <BarChart3 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-100">
              {total}
            </span>
            <span className="text-xs text-slate-400 ml-1.5">chests</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Keys used:{" "}
            <span className="text-amber-300 font-semibold">
              {stats.totalKeysSpent}
            </span>
          </div>
        </div>

        {/* KPI: Estimated Cost */}
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Money / WC Spent</span>
            <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded text-[10px] border border-slate-800">
              <button
                onClick={() => setCurrencyUnit("USD")}
                className={`px-1 rounded ${currencyUnit === "USD" ? "text-amber-400 font-bold" : "text-slate-500"}`}
              >
                USD
              </button>
              <span>|</span>
              <button
                onClick={() => setCurrencyUnit("THB")}
                className={`px-1 rounded ${currencyUnit === "THB" ? "text-amber-400 font-bold" : "text-slate-500"}`}
              >
                THB
              </button>
              <span>|</span>
              <button
                onClick={() => setCurrencyUnit("EUR")}
                className={`px-1 rounded ${currencyUnit === "EUR" ? "text-amber-400 font-bold" : "text-slate-500"}`}
              >
                EUR
              </button>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-300">
              {getConvertedPrice(stats.totalWildCoresSpent)}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.totalWildCoresSpent.toLocaleString()} Wild Cores
          </div>
        </div>

        {/* KPI: Orange Gemstones Yield */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Orange Gemstones</span>
            <Diamond className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              {stats.orangeGemstonesTotal}
            </span>
            <span className="text-xs text-slate-400">
              Avg:{" "}
              <span className="font-bold text-amber-300">{actualAvgOg}</span> /
              chest
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Official EV:{" "}
            <span className="text-slate-300">{expectedAvgOg} OG / chest</span>
          </div>
        </div>

        {/* KPI: Luck Rating Meter */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Luck Index</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-100">
              {stats.luckRating}%
            </span>
            <span className="text-[10px] text-slate-400">(100% = avg)</span>
          </div>
          <div className="mt-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${luckMeta.color}`}
            >
              {luckMeta.label}
            </span>
          </div>
        </div>
      </div>

      {/* Probability Comparison: Theoretical vs Actual */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span>Official Drop Rates vs. Your Actual Luck</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Permanent Skin Rate */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3.5">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-semibold">
                Permanent Skin Rate
              </span>
              <span className="text-emerald-400 font-bold">
                {actualPermRate}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (Number(actualPermRate) / 10) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Riot Official: 5.00%</span>
              <span className="text-slate-300">
                {stats.permanentCount} Perms / {total} Chests
              </span>
            </div>
          </div>

          {/* 1,000 OG Jackpot Rate */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3.5">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-amber-300 font-semibold">
                1,000 Gem Jackpot
              </span>
              <span className="text-amber-400 font-bold">
                {actualJackpotRate}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-amber-400 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Number(actualJackpotRate) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Riot Official: 0.10% (1 in 1,000)</span>
              <span className="text-amber-300 font-bold">
                {stats.jackpotCount} Hit
              </span>
            </div>
          </div>

          {/* Average Gemstone Drop */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3.5">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-semibold">
                Avg. Orange Gemstones
              </span>
              <span className="text-cyan-400 font-bold">{actualAvgOg} OG</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (Number(actualAvgOg) / 20) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Expected EV: 10.90 OG</span>
              <span className="text-slate-300">
                {Number(actualAvgOg) >= 10.9 ? "▲ Above EV" : "▼ Below EV"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rarity & Gemstone Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skin Tier Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
            Skin Tier Breakdown
          </h4>

          <div className="space-y-3">
            {[
              {
                label: "Mythic / Prestige",
                count: stats.rarityCounts.mythic + stats.rarityCounts.prestige,
                color: "bg-amber-400",
                official: "~2%",
              },
              {
                label: "Legendary",
                count: stats.rarityCounts.legendary,
                color: "bg-orange-500",
                official: "~13%",
              },
              {
                label: "Epic",
                count: stats.rarityCounts.epic,
                color: "bg-teal-400",
                official: "~50%",
              },
              {
                label: "Standard",
                count: stats.rarityCounts.standard,
                color: "bg-slate-400",
                official: "~35%",
              },
            ].map((tier) => {
              const pct =
                total > 0 ? ((tier.count / total) * 100).toFixed(1) : "0.0";
              return (
                <div key={tier.label} className="text-xs">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="font-medium">{tier.label}</span>
                    <span className="text-slate-400">
                      {tier.count}{" "}
                      <span className="text-slate-200 font-bold">({pct}%)</span>{" "}
                      — Target: {tier.official}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${tier.color} h-full rounded-full transition-all duration-300`}
                      style={{ width: `${Math.min(100, Number(pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orange Gemstone Bundle Frequencies */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
            Orange Gemstone Drop Distribution
          </h4>

          <div className="space-y-3">
            {[
              {
                label: "8 Gemstones",
                count: stats.gemstoneCounts["8"],
                officialPct: "70.0%",
              },
              {
                label: "12 Gemstones",
                count: stats.gemstoneCounts["12"],
                officialPct: "17.0%",
              },
              {
                label: "16 Gemstones",
                count: stats.gemstoneCounts["16"],
                officialPct: "8.0%",
              },
              {
                label: "20 Gemstones",
                count: stats.gemstoneCounts["20"],
                officialPct: "4.90%",
              },
              {
                label: "1,000 Gemstones (Jackpot)",
                count: stats.gemstoneCounts["1000"],
                officialPct: "0.10%",
              },
            ].map((bundle) => {
              const pct =
                total > 0 ? ((bundle.count / total) * 100).toFixed(1) : "0.0";
              return (
                <div key={bundle.label} className="text-xs">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="font-medium text-amber-200/90">
                      {bundle.label}
                    </span>
                    <span className="text-slate-400">
                      {bundle.count} times{" "}
                      <span className="text-amber-300 font-bold">({pct}%)</span>{" "}
                      — Target: {bundle.officialPct}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Number(pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* History Log & Data Export Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Drop History Log ({filteredHistory.length})
            </h4>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setHistoryFilter("all")}
                className={`px-2 py-0.5 rounded ${historyFilter === "all" ? "bg-amber-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
              >
                All
              </button>
              <button
                onClick={() => setHistoryFilter("permanent")}
                className={`px-2 py-0.5 rounded ${historyFilter === "permanent" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
              >
                Permanents
              </button>
              <button
                onClick={() => setHistoryFilter("high_tier")}
                className={`px-2 py-0.5 rounded ${historyFilter === "high_tier" ? "bg-orange-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
              >
                Legendary/Mythic
              </button>
              <button
                onClick={() => setHistoryFilter("jackpot")}
                className={`px-2 py-0.5 rounded ${historyFilter === "jackpot" ? "bg-yellow-400 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
              >
                Jackpot 1,000 OG
              </button>
            </div>
          </div>

          {/* Action buttons: Export & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              disabled={total === 0}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={exportJSON}
              disabled={total === 0}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-amber-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm("Reset all collected gacha statistics?")) {
                  onResetStats();
                }
              }}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 px-3 py-1.5 rounded-lg border border-red-800/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Scrollable table */}
        <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/60 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No drops matching the selected filter. Open some chests above!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3 font-semibold">Time</th>
                  <th className="py-2 px-3 font-semibold">Skin Item</th>
                  <th className="py-2 px-3 font-semibold">Tier</th>
                  <th className="py-2 px-3 font-semibold">Type</th>
                  <th className="py-2 px-3 font-semibold text-right">
                    Orange Gemstones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="py-2 px-3 text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-200">
                      <span className="text-amber-200/80 mr-1.5">
                        {item.skin.champion}
                      </span>
                      <span>{item.skin.skinName}</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="uppercase text-[10px] font-bold tracking-wider text-slate-300">
                        {item.skin.rarity}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          item.isPermanent
                            ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                            : "bg-purple-950 text-purple-300 border-purple-500/40"
                        }`}
                      >
                        {item.isPermanent ? "Permanent" : "Shard"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span
                        className={`font-bold ${
                          item.orangeGemstones === 1000
                            ? "text-yellow-300 text-sm animate-pulse"
                            : "text-amber-400"
                        }`}
                      >
                        +{item.orangeGemstones} 💎
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
