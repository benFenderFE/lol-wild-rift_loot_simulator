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
import { StatisticsPanel } from "./components/StatisticsPanel";
import { InventoryWorkshop } from "./components/InventoryWorkshop";
import { HextechStore } from "./components/HextechStore";
import { RateInfoModal } from "./components/RateInfoModal";
import { CurrencyModal } from "./components/CurrencyModal";
import { Sparkles, Crown } from "lucide-react";
import { type Language, translations } from "./utils/i18n";
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
  const [banner] = useState<BannerType>("event_mythic");
  const [lang, setLang] = useState<Language>(() => {
    const saved = safeGetStorage<Language>(
      "wr_loot_lang",
      (val) => (val === "en" || val === "th" ? val : "th"),
      "th",
    );
    return saved;
  });

  const handleToggleLang = () => {
    const nextLang = lang === "th" ? "en" : "th";
    setLang(nextLang);
    safeSetStorage("wr_loot_lang", nextLang);
  };

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

  // Open chest logic (Unlimited Free Sandbox)
  const handleOpenChests = (count: number) => {
    if (isOpening) return;

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

      // Accumulate Orange Gemstones from drops for Store redemption
      setCurrencies((prev) => ({
        ...prev,
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
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenRates={() => setIsRateModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onResetStats={handleResetAll}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Content Area (Laptop-friendly padding) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 py-2 sm:py-3 flex flex-col items-center">
        {/* Banner Category (PRESTIGE SELECT Only) */}
        {activeView === "loot" && (
          <div className="w-full max-w-lg flex items-center justify-between mb-2.5 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-amber-950/80 px-4 py-2 rounded-xl border border-amber-500/40 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  {translations[lang].bannerCategory}
                </span>
                <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wider font-cinzel">
                  {translations[lang].prestigeSelect}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>100 PITY</span>
            </div>
          </div>
        )}

        {/* View 1: Loot Chest Centerpiece */}
        {activeView === "loot" && (
          <div className="w-full flex flex-col items-center gap-3">
            <HextechChest3D
              banner={banner}
              isOpening={isOpening}
              onOpen={handleOpenChests}
              skipAnimation={skipAnimation}
              onToggleSkip={setSkipAnimation}
              stats={stats}
              onResetStats={handleResetAll}
              onNavigateView={setActiveView}
              onOpenRates={() => setIsRateModalOpen(true)}
              lang={lang}
            />
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
        lang={lang}
      />

      {/* Rate Info Modal */}
      <RateInfoModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        lang={lang}
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
