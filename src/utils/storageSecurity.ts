import type { CurrencyState, MilestoneReward, SkinItem, GachaStats } from "../types/loot";

// Default currency state
export const DEFAULT_CURRENCIES: CurrencyState = {
  wildCores: 15000,
  hextechKeys: 100,
  orangeGemstones: 28,
  silverStardust: 650,
  poroCoins: 1200,
  poroEnergy: 1800,
};

// Safe number validation: ensures value is a finite number and not negative
function safeNonNegativeNumber(val: unknown, fallback: number): number {
  if (typeof val === "number" && Number.isFinite(val) && val >= 0) {
    return Math.floor(val);
  }
  return fallback;
}

// Safely validate and sanitize CurrencyState
export function sanitizeCurrencies(data: unknown): CurrencyState {
  if (!data || typeof data !== "object") {
    return DEFAULT_CURRENCIES;
  }
  const obj = data as Record<string, unknown>;
  return {
    wildCores: safeNonNegativeNumber(obj.wildCores, DEFAULT_CURRENCIES.wildCores),
    hextechKeys: safeNonNegativeNumber(obj.hextechKeys, DEFAULT_CURRENCIES.hextechKeys),
    orangeGemstones: safeNonNegativeNumber(obj.orangeGemstones, DEFAULT_CURRENCIES.orangeGemstones),
    silverStardust: safeNonNegativeNumber(obj.silverStardust, DEFAULT_CURRENCIES.silverStardust),
    poroCoins: safeNonNegativeNumber(obj.poroCoins, DEFAULT_CURRENCIES.poroCoins),
    poroEnergy: safeNonNegativeNumber(obj.poroEnergy, DEFAULT_CURRENCIES.poroEnergy),
  };
}

// Safely validate and sanitize SkinItem array
export function sanitizeSkinList(data: unknown): SkinItem[] {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is SkinItem => {
    return (
      Boolean(item) &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.champion === "string" &&
      typeof item.skinName === "string" &&
      typeof item.rarity === "string"
    );
  });
}

// Safely validate and sanitize Milestones array
export function sanitizeMilestones(data: unknown, fallback: MilestoneReward[]): MilestoneReward[] {
  if (!Array.isArray(data)) return fallback;
  return fallback.map((fbItem) => {
    const saved = data.find((d) => d && typeof d === "object" && d.threshold === fbItem.threshold);
    if (saved) {
      return {
        ...fbItem,
        claimed: Boolean(saved.claimed),
      };
    }
    return fbItem;
  });
}

// Safely validate and sanitize GachaStats
export function sanitizeStats(data: unknown, fallback: GachaStats): GachaStats {
  if (!data || typeof data !== "object") return fallback;
  const obj = data as Record<string, unknown>;
  return {
    ...fallback,
    totalChestsOpened: safeNonNegativeNumber(obj.totalChestsOpened, fallback.totalChestsOpened),
    totalWildCoresSpent: safeNonNegativeNumber(obj.totalWildCoresSpent, fallback.totalWildCoresSpent),
    totalKeysSpent: safeNonNegativeNumber(obj.totalKeysSpent, fallback.totalKeysSpent),
    orangeGemstonesTotal: safeNonNegativeNumber(obj.orangeGemstonesTotal, fallback.orangeGemstonesTotal),
    silverStardustTotal: safeNonNegativeNumber(obj.silverStardustTotal, fallback.silverStardustTotal),
    permanentCount: safeNonNegativeNumber(obj.permanentCount, fallback.permanentCount),
    shardCount: safeNonNegativeNumber(obj.shardCount, fallback.shardCount),
    jackpotCount: safeNonNegativeNumber(obj.jackpotCount, fallback.jackpotCount),
    luckRating: typeof obj.luckRating === "number" && Number.isFinite(obj.luckRating) ? obj.luckRating : fallback.luckRating,
    history: Array.isArray(obj.history) ? obj.history.slice(0, 100) : [],
    rarityCounts: {
      ...fallback.rarityCounts,
      ...(typeof obj.rarityCounts === "object" && obj.rarityCounts ? (obj.rarityCounts as typeof fallback.rarityCounts) : {}),
    },
    gemstoneCounts: {
      ...fallback.gemstoneCounts,
      ...(typeof obj.gemstoneCounts === "object" && obj.gemstoneCounts ? (obj.gemstoneCounts as typeof fallback.gemstoneCounts) : {}),
    },
  };
}

// Safe storage getItem wrapper with error handling
export function safeGetStorage<T>(key: string, parser: (val: unknown) => T, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parser(parsed);
  } catch (err) {
    console.warn(`[StorageSecurity] Failed to parse storage item "${key}", using safe default.`, err);
    return fallback;
  }
}

// Safe storage setItem wrapper preventing quota crashes
export function safeSetStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[StorageSecurity] Failed to write storage item "${key}". Storage might be full or blocked.`, err);
    return false;
  }
}
