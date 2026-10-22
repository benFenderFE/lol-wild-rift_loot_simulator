import { useState, useEffect } from "react";
import type {
  BannerType,
  CurrencyState,
  DropResult,
  GachaStats,
  MilestoneReward,
  SkinItem,
  StoreItem,
} from "./types/loot";
import { INITIAL_MILESTONES } from "./data/skins";
import {
  INITIAL_STATS,
  openMultipleChests,
  updateStatsWithDrops,
} from "./utils/lootEngine";
import { soundEngine } from "./utils/audio";
import { Navbar } from "./components/Navbar";
import { HextechChest3D } from "./components/HextechChest3D";
import { OpeningModal } from "./components/OpeningModal";
import { MilestoneTracker } from "./components/MilestoneTracker";
import { StatisticsPanel } from "./components/StatisticsPanel";
import { InventoryWorkshop } from "./components/InventoryWorkshop";
import { HextechStore } from "./components/HextechStore";
import { RateInfoModal } from "./components/RateInfoModal";
import { CurrencyModal } from "./components/CurrencyModal";
import { Sparkles, Layers, Flame } from "lucide-react";
import {
  safeGetStorage,
  safeSetStorage,
  sanitizeCurrencies,
  sanitizeMilestones,
  sanitizeSkinList,
  sanitizeStats,
  DEFAULT_CURRENCIES,
} from "./utils/storageSecurity";

export function App() {
  // Navigation & UI state
  const [activeView, setActiveView] = useState<
    "loot" | "stats" | "workshop" | "store"
  >("loot");
  const [banner, setBanner] = useState<BannerType>("hextech");
  const [skipAnimation, setSkipAnimation] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isOpeningModalOpen, setIsOpeningModalOpen] = useState<boolean>(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState<boolean>(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] =
    useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Player currencies (safely validated and sanitized)
  const [currencies, setCurrencies] = useState<CurrencyState>(() =>
    safeGetStorage("wr_loot_currencies", sanitizeCurrencies, DEFAULT_CURRENCIES)
  );

  // Milestones
  const [milestones, setMilestones] = useState<MilestoneReward[]>(() =>
    safeGetStorage(
      "wr_loot_milestones",
      (val) => sanitizeMilestones(val, INITIAL_MILESTONES),
      INITIAL_MILESTONES
    )
  );

  // Collection
  const [permanentSkins, setPermanentSkins] = useState<SkinItem[]>(() =>
    safeGetStorage("wr_loot_permanent_skins", sanitizeSkinList, [])
  );

  const [skinShards, setSkinShards] = useState<SkinItem[]>(() =>
    safeGetStorage("wr_loot_skin_shards", sanitizeSkinList, [])
  );

  // Statistics
  const [stats, setStats] = useState<GachaStats>(() =>
    safeGetStorage(
      "wr_loot_stats",
      (val) => sanitizeStats(val, INITIAL_STATS),
      INITIAL_STATS
    )
  );

  // Recent drops for modal
  const [currentDrops, setCurrentDrops] = useState<DropResult[]>([]);
  const [eventPity, setEventPity] = useState<number>(0);

  // Save changes to localStorage with error/quota catching
  useEffect(() => {
    safeSetStorage("wr_loot_currencies", currencies);
  }, [currencies]);

  useEffect(() => {
    safeSetStorage("wr_loot_milestones", milestones);
  }, [milestones]);

  useEffect(() => {
    safeSetStorage("wr_loot_permanent_skins", permanentSkins);
  }, [permanentSkins]);

  useEffect(() => {
    safeSetStorage("wr_loot_skin_shards", skinShards);
  }, [skinShards]);

  useEffect(() => {
    safeSetStorage("wr_loot_stats", stats);
  }, [stats]);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  // Open chest logic
  const handleOpenChests = (count: number) => {
    if (isOpening) return;

    // Currency check
    let requiredKeys = 0;
    let requiredWc = 0;

    if (banner === "hextech") {
      requiredKeys = count * 10;
      // Auto-convert Wild Cores if not enough keys: 10 keys = 150 WC (15 WC each)
      if (currencies.hextechKeys < requiredKeys) {
        const missingKeys = requiredKeys - currencies.hextechKeys;
        const missingCostWc = missingKeys * 15;
        if (currencies.wildCores < missingCostWc) {
          alert(
            `Not enough Hextech Keys or Wild Cores! You need ${missingCostWc} Wild Cores for ${missingKeys} keys.`,
          );
          setIsCurrencyModalOpen(true);
          return;
        }
        // Deduct WC for missing keys
        requiredWc = missingCostWc;
        requiredKeys = currencies.hextechKeys; // use up available keys
      }
    } else if (banner === "event_mythic") {
      requiredWc = count * 100;
      if (currencies.wildCores < requiredWc) {
        alert(`Not enough Wild Cores! You need ${requiredWc} Wild Cores.`);
        setIsCurrencyModalOpen(true);
        return;
      }
    }

    const executeRolls = () => {
      const { drops, newPity } = openMultipleChests(count, banner, eventPity);
      setEventPity(newPity);

      // Collect new items
      const newPerms: SkinItem[] = [];
      const newShardsList: SkinItem[] = [];
      let totalGemsGained = 0;

      drops.forEach((d) => {
        totalGemsGained += d.orangeGemstones;
        if (d.isPermanent) {
          newPerms.push(d.skin);
        } else {
          newShardsList.push(d.skin);
        }
      });

      // Update wallets
      setCurrencies((prev) => ({
        ...prev,
        wildCores: Math.max(0, prev.wildCores - requiredWc),
        hextechKeys: Math.max(0, prev.hextechKeys - requiredKeys),
        orangeGemstones: prev.orangeGemstones + totalGemsGained,
      }));

      // Update inventory
      setPermanentSkins((prev) => [...newPerms, ...prev]);
      setSkinShards((prev) => [...newShardsList, ...prev]);

      // Update statistics
      const costPerChest = banner === "hextech" ? 150 : 100;
      setStats((prev) => updateStatsWithDrops(prev, drops, costPerChest));

      setCurrentDrops(drops);
      setIsOpening(false);
      setIsOpeningModalOpen(true);
    };

    if (skipAnimation) {
      soundEngine.playChestBurst();
      executeRolls();
    } else {
      setIsOpening(true);
      soundEngine.playChestCharging();
      setTimeout(() => {
        executeRolls();
      }, 750);
    }
  };

  // Claim milestone
  const handleClaimMilestone = (index: number) => {
    const target = milestones[index];
    if (!target || target.claimed) return;

    if (target.type === "keys") {
      setCurrencies((prev) => ({
        ...prev,
        hextechKeys: prev.hextechKeys + target.amount,
      }));
    } else if (target.type === "stardust") {
      setCurrencies((prev) => ({
        ...prev,
        silverStardust: prev.silverStardust + target.amount,
      }));
    } else if (target.type === "chest") {
      // Award 1 free chest roll
      setCurrencies((prev) => ({
        ...prev,
        hextechKeys: prev.hextechKeys + 10,
      }));
    }

    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, claimed: true } : m)),
    );
  };

  // Disenchant single shard
  const handleDisenchantShard = (shardId: string) => {
    const shardIndex = skinShards.findIndex((s) => s.id === shardId);
    if (shardIndex === -1) return;

    const shard = skinShards[shardIndex];
    setCurrencies((prev) => ({
      ...prev,
      silverStardust: prev.silverStardust + shard.disenchantYield,
    }));
    setSkinShards((prev) => prev.filter((_, idx) => idx !== shardIndex));
  };

  // Disenchant all shards
  const handleDisenchantAllShards = () => {
    const totalYield = skinShards.reduce(
      (sum, s) => sum + s.disenchantYield,
      0,
    );
    setCurrencies((prev) => ({
      ...prev,
      silverStardust: prev.silverStardust + totalYield,
    }));
    setSkinShards([]);
  };

  // Forge shard into permanent
  const handleForgePermanent = (shard: SkinItem) => {
    if (currencies.silverStardust < shard.costStardust) return;

    setCurrencies((prev) => ({
      ...prev,
      silverStardust: prev.silverStardust - shard.costStardust,
    }));

    // Remove 1 copy of shard from shards
    const idx = skinShards.findIndex((s) => s.id === shard.id);
    if (idx !== -1) {
      setSkinShards((prev) => prev.filter((_, i) => i !== idx));
    }

    // Add to permanent
    setPermanentSkins((prev) => [shard, ...prev]);
  };

  // Redeem from Hextech Store
  const handleRedeemSkin = (item: StoreItem) => {
    if (currencies.orangeGemstones < item.gemstoneCost) return;

    setCurrencies((prev) => ({
      ...prev,
      orangeGemstones: prev.orangeGemstones - item.gemstoneCost,
    }));

    setPermanentSkins((prev) => [item.skin, ...prev]);
  };

  // Add sandbox currencies
  const handleAddCurrency = (
    type: "wildCores" | "hextechKeys" | "orangeGemstones" | "silverStardust",
    amount: number,
  ) => {
    soundEngine.playClick();
    setCurrencies((prev) => ({
      ...prev,
      [type]: prev[type] + amount,
    }));
  };

  // Reset all stats, workshop inventory, skins, shards, currencies and milestones
  const handleResetAll = () => {
    soundEngine.playClick();
    setStats(INITIAL_STATS);
    setPermanentSkins([]);
    setSkinShards([]);
    setCurrencies(DEFAULT_CURRENCIES);
    setMilestones(INITIAL_MILESTONES);
    setCurrentDrops([]);
    setEventPity(0);

    safeSetStorage("wr_loot_stats", INITIAL_STATS);
    safeSetStorage("wr_loot_permanent_skins", []);
    safeSetStorage("wr_loot_skin_shards", []);
    safeSetStorage("wr_loot_currencies", DEFAULT_CURRENCIES);
    safeSetStorage("wr_loot_milestones", INITIAL_MILESTONES);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currencies={currencies}
        activeView={activeView}
        onSelectView={setActiveView}
        onAddCurrency={() => setIsCurrencyModalOpen(true)}
        onOpenRates={() => setIsRateModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onResetStats={handleResetAll}
      />

      {/* Main Content Area (Laptop-friendly padding) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 py-2 sm:py-3 flex flex-col items-center">
        {/* Banner Selection Switcher (Only visible in 'loot' view) */}
        {activeView === "loot" && (
          <div className="w-full max-w-lg flex items-center justify-center gap-1.5 mb-2.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                soundEngine.playClick();
                setBanner("hextech");
              }}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                banner === "hextech"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stellar Bonds (Hextech)</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setBanner("event_mythic");
              }}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                banner === "event_mythic"
                  ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Prestige Select</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setBanner("poro");
              }}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                banner === "poro"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.4)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Poro Energy</span>
            </button>
          </div>
        )}

        {/* View 1: Loot Chest Centerpiece */}
        {activeView === "loot" && (
          <div className="w-full flex flex-col items-center gap-3">
            <HextechChest3D
              banner={banner}
              isOpening={isOpening}
              onOpen={handleOpenChests}
              canAfford={true}
              keysCount={currencies.hextechKeys}
              skipAnimation={skipAnimation}
              onToggleSkip={setSkipAnimation}
              stats={stats}
              onResetStats={handleResetAll}
              onNavigateView={setActiveView}
              onOpenRates={() => setIsRateModalOpen(true)}
            />

            {/* Milestone Tracker (For Hextech Banner) */}
            {banner === "hextech" && (
              <div className="w-full max-w-5xl mt-1">
                <MilestoneTracker
                  currentChests={stats.totalChestsOpened}
                  milestones={milestones}
                  onClaimMilestone={handleClaimMilestone}
                />
              </div>
            )}
          </div>
        )}

        {/* View 2: Statistics & Data Collection Dashboard */}
        {activeView === "stats" && (
          <div className="w-full max-w-5xl">
            <StatisticsPanel stats={stats} onResetStats={handleResetAll} />
          </div>
        )}

        {/* View 3: Workshop & Inventory */}
        {activeView === "workshop" && (
          <div className="w-full max-w-5xl">
            <InventoryWorkshop
              permanentSkins={permanentSkins}
              skinShards={skinShards}
              silverStardust={currencies.silverStardust}
              onDisenchantShard={handleDisenchantShard}
              onDisenchantAllShards={handleDisenchantAllShards}
              onForgePermanent={handleForgePermanent}
            />
          </div>
        )}

        {/* View 4: Orange Gemstone Store */}
        {activeView === "store" && (
          <div className="w-full max-w-5xl">
            <HextechStore
              orangeGemstones={currencies.orangeGemstones}
              ownedSkins={permanentSkins}
              onRedeemSkin={handleRedeemSkin}
            />
          </div>
        )}
      </main>

      {/* Opening Reveal Modal */}
      <OpeningModal
        isOpen={isOpeningModalOpen}
        drops={currentDrops}
        onClose={() => setIsOpeningModalOpen(false)}
        onOpenAgain={(count) => {
          setIsOpeningModalOpen(false);
          handleOpenChests(count);
        }}
      />

      {/* Rate Info Modal */}
      <RateInfoModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
      />

      {/* Currency Refill Modal */}
      <CurrencyModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        onAdd={handleAddCurrency}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>
            League of Legends: Wild Rift™ Hextech Gacha Simulator (Latest 2026
            Loot Mechanics)
          </span>
          <span className="text-[11px] text-slate-600">
            Simulates official drop rates: 5.0% Perm, 95.0% Shards, 10.90
            OG/Chest EV
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
