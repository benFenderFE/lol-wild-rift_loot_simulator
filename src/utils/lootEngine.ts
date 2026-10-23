import { ALL_SKINS } from "../data/skins";
import type {
  BannerType,
  DropResult,
  GachaStats,
  SkinItem,
  SkinRarity,
} from "../types/loot";

// Filter skins by rarity
const standardSkins = ALL_SKINS.filter((s) => s.rarity === "standard");
const epicSkins = ALL_SKINS.filter((s) => s.rarity === "epic");
const legendarySkins = ALL_SKINS.filter((s) => s.rarity === "legendary");
const mythicSkins = ALL_SKINS.filter(
  (s) => s.rarity === "mythic" || s.rarity === "prestige",
);

/**
 * Pick random item from an array
 */
function pickRandom<T>(items: T[]): T {
  if (!items || items.length === 0) return ALL_SKINS[0] as unknown as T;
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Roll an Orange Gemstone bundle based on official Wild Rift drop rates:
 * - 8 Gemstones: 70.0%
 * - 12 Gemstones: 17.0%
 * - 16 Gemstones: 8.0%
 * - 20 Gemstones: 4.90%
 * - 1000 Gemstones: 0.10% (Jackpot)
 */
export function rollOrangeGemstones(): { amount: number; isJackpot: boolean } {
  const rand = Math.random() * 100; // 0 to 100
  if (rand < 0.1) {
    return { amount: 1000, isJackpot: true };
  } else if (rand < 0.1 + 4.9) {
    return { amount: 20, isJackpot: false };
  } else if (rand < 0.1 + 4.9 + 8.0) {
    return { amount: 16, isJackpot: false };
  } else if (rand < 0.1 + 4.9 + 8.0 + 17.0) {
    return { amount: 12, isJackpot: false };
  } else {
    return { amount: 8, isJackpot: false };
  }
}

/**
 * Roll a skin item and determine whether it drops as Permanent (5%) or Shard (95%)
 */
export function rollSkinContent(
  banner: BannerType,
  pityCount: number = 0,
): { skin: SkinItem; isPermanent: boolean } {
  if (banner === "event_mythic") {
    // Event Banner Pity Check
    if (pityCount >= 99) {
      // 100th pull pity guarantees featured Mythic
      return { skin: pickRandom(mythicSkins), isPermanent: true };
    }
    const rand = Math.random() * 100;
    if (rand < 0.005) {
      // ~0.005% Featured Mythic/Prestige Permanent (~0.0003% - 0.0006% per individual skin, exactly as disclosed in-game)
      return { skin: pickRandom(mythicSkins), isPermanent: true };
    } else if (rand < 5.0) {
      // 4.995% Other Permanent Skin (0.5% Legendary, 2.2% Epic, 2.295% Standard)
      const permRand = Math.random() * 4.995;
      if (permRand < 0.5) {
        return { skin: pickRandom(legendarySkins), isPermanent: true };
      } else if (permRand < 2.7) {
        return { skin: pickRandom(epicSkins), isPermanent: true };
      } else {
        return { skin: pickRandom(standardSkins), isPermanent: true };
      }
    } else {
      // 95.0% Shards (Realistic Wild Rift drop distribution: mostly Standard, some Epic, rare Legendary)
      const shardRarityRand = Math.random() * 100;
      if (shardRarityRand < 3.5) {
        // 3.5% Legendary Shard
        return { skin: pickRandom(legendarySkins), isPermanent: false };
      } else if (shardRarityRand < 3.5 + 25.0) {
        // 25.0% Epic Shard
        return { skin: pickRandom(epicSkins), isPermanent: false };
      } else {
        // 71.5% Standard Shard
        return { skin: pickRandom(standardSkins), isPermanent: false };
      }
    }
  }

  // Hextech Chest Standard Mechanics:
  // 5% Permanent, 95% Shard
  const isPermanent = Math.random() < 0.05;

  // Determine skin tier (Calibrated to official Wild Rift & League Hextech rarity distribution)
  const tierRoll = Math.random() * 100;
  let skin: SkinItem;

  if (tierRoll < 0.005) {
    // ~0.005% Mythic/Prestige (~0.0003% - 0.0006% per individual skin)
    skin = pickRandom(mythicSkins);
  } else if (tierRoll < 0.005 + 3.5) {
    // 3.5% Legendary
    skin = pickRandom(legendarySkins);
  } else if (tierRoll < 0.005 + 3.5 + 25.0) {
    // 25.0% Epic
    skin = pickRandom(epicSkins);
  } else {
    // 71.495% Standard
    skin = pickRandom(standardSkins);
  }

  return { skin, isPermanent };
}

/**
 * Single chest opening logic
 */
export function openSingleChest(
  banner: BannerType = "hextech",
  eventPity: number = 0,
): DropResult {
  const { skin, isPermanent } = rollSkinContent(banner, eventPity);
  const { amount: orangeGemstones, isJackpot } = rollOrangeGemstones();

  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    skin,
    isPermanent,
    orangeGemstones,
    timestamp: Date.now(),
    chestType: banner,
    isJackpot,
  };
}

/**
 * Batch roll multiple chests
 */
export function openMultipleChests(
  count: number,
  banner: BannerType = "hextech",
  startPity: number = 0,
): { drops: DropResult[]; newPity: number } {
  const drops: DropResult[] = [];
  let currentPity = startPity;

  for (let i = 0; i < count; i++) {
    const drop = openSingleChest(banner, currentPity);
    drops.push(drop);

    if (banner === "event_mythic") {
      if (drop.skin.rarity === "mythic" && drop.isPermanent) {
        currentPity = 0; // Reset pity
      } else {
        currentPity++;
      }
    }
  }

  return { drops, newPity: currentPity };
}

/**
 * Calculate player's live Luck Score (100 is exact statistical expected value)
 */
export function calculateLuckRating(stats: GachaStats): number {
  if (stats.totalChestsOpened === 0) return 100;

  // 1. Permanent skin luck component (expected: 5%)
  const permRate = (stats.permanentCount / stats.totalChestsOpened) * 100;
  const permScore = (permRate / 5.0) * 40; // 40 weight

  // 2. Orange Gemstone luck component (expected: 10.9 OG/chest)
  const avgOg = stats.orangeGemstonesTotal / stats.totalChestsOpened;
  const ogScore = (avgOg / 10.9) * 40; // 40 weight

  // 3. High rarity hit component (expected legendary + mythic ~ 4%)
  const highTierCount =
    stats.rarityCounts.legendary +
    stats.rarityCounts.mythic +
    stats.rarityCounts.prestige;
  const highTierRate = (highTierCount / stats.totalChestsOpened) * 100;
  const rarityScore = (highTierRate / 4.0) * 20; // 20 weight

  // 4. Jackpot bonus
  const jackpotBonus = stats.jackpotCount * 25;

  const rawScore = permScore + ogScore + rarityScore + jackpotBonus;
  return Math.max(10, Math.round(rawScore));
}

/**
 * Update aggregate stats given new drops
 */
export function updateStatsWithDrops(
  prev: GachaStats,
  newDrops: DropResult[],
  costPerChestWc: number = 150,
): GachaStats {
  const count = newDrops.length;
  let newPerms = 0;
  let newShards = 0;
  let newOg = 0;
  let newJackpots = 0;

  const rarityMap: Record<SkinRarity, number> = {
    standard: 0,
    epic: 0,
    legendary: 0,
    mythic: 0,
    prestige: 0,
  };

  const ogMap: Record<"8" | "12" | "16" | "20" | "1000", number> = {
    "8": 0,
    "12": 0,
    "16": 0,
    "20": 0,
    "1000": 0,
  };

  newDrops.forEach((d) => {
    if (d.isPermanent) {
      newPerms++;
    } else {
      newShards++;
    }

    newOg += d.orangeGemstones;
    if (d.isJackpot) newJackpots++;

    const rarityKey = d.skin.rarity;
    rarityMap[rarityKey] = (rarityMap[rarityKey] || 0) + 1;

    const ogKey = String(d.orangeGemstones) as
      | "8"
      | "12"
      | "16"
      | "20"
      | "1000";
    if (ogMap[ogKey] !== undefined) {
      ogMap[ogKey]++;
    }
  });

  const updatedStats: GachaStats = {
    totalChestsOpened: prev.totalChestsOpened + count,
    totalWildCoresSpent: prev.totalWildCoresSpent + count * costPerChestWc,
    totalKeysSpent: prev.totalKeysSpent + count * 10,
    orangeGemstonesTotal: prev.orangeGemstonesTotal + newOg,
    silverStardustTotal: prev.silverStardustTotal,
    permanentCount: prev.permanentCount + newPerms,
    shardCount: prev.shardCount + newShards,
    jackpotCount: prev.jackpotCount + newJackpots,
    rarityCounts: {
      standard: prev.rarityCounts.standard + rarityMap.standard,
      epic: prev.rarityCounts.epic + rarityMap.epic,
      legendary: prev.rarityCounts.legendary + rarityMap.legendary,
      mythic: prev.rarityCounts.mythic + rarityMap.mythic,
      prestige: prev.rarityCounts.prestige + rarityMap.prestige,
    },
    gemstoneCounts: {
      "8": prev.gemstoneCounts["8"] + ogMap["8"],
      "12": prev.gemstoneCounts["12"] + ogMap["12"],
      "16": prev.gemstoneCounts["16"] + ogMap["16"],
      "20": prev.gemstoneCounts["20"] + ogMap["20"],
      "1000": prev.gemstoneCounts["1000"] + ogMap["1000"],
    },
    history: [...newDrops, ...prev.history].slice(0, 500), // keep recent 500
    luckRating: 100, // will recompute
  };

  updatedStats.luckRating = calculateLuckRating(updatedStats);
  return updatedStats;
}

export const INITIAL_STATS: GachaStats = {
  totalChestsOpened: 0,
  totalWildCoresSpent: 0,
  totalKeysSpent: 0,
  orangeGemstonesTotal: 0,
  silverStardustTotal: 0,
  permanentCount: 0,
  shardCount: 0,
  jackpotCount: 0,
  rarityCounts: {
    standard: 0,
    epic: 0,
    legendary: 0,
    mythic: 0,
    prestige: 0,
  },
  gemstoneCounts: {
    "8": 0,
    "12": 0,
    "16": 0,
    "20": 0,
    "1000": 0,
  },
  history: [],
  luckRating: 100,
};
