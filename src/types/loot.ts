export type SkinRarity =
  | "standard"
  | "epic"
  | "legendary"
  | "mythic"
  | "prestige";

export type BannerType = "hextech" | "event_mythic" | "poro";

export interface SkinItem {
  id: string;
  champion: string;
  skinName: string;
  rarity: SkinRarity;
  costStardust: number;
  disenchantYield: number;
  accentColor: string;
  badgeLabel: string;
  quote?: string;
  imageUrl?: string;
  splashUrl?: string;
  patchVersion?: string;
  role: "Assassin" | "Fighter" | "Mage" | "Marksman" | "Support" | "Tank";
}

export interface DropResult {
  id: string;
  skin: SkinItem;
  isPermanent: boolean;
  orangeGemstones: number;
  timestamp: number;
  chestType: BannerType;
  isJackpot?: boolean;
}

export interface MilestoneReward {
  threshold: number;
  label: string;
  type: "keys" | "stardust" | "chest";
  amount: number;
  claimed: boolean;
  icon: string;
}

export interface CurrencyState {
  wildCores: number;
  hextechKeys: number;
  orangeGemstones: number;
  silverStardust: number;
  poroCoins: number;
  poroEnergy: number;
}

export interface GachaStats {
  totalChestsOpened: number;
  totalWildCoresSpent: number;
  totalKeysSpent: number;
  orangeGemstonesTotal: number;
  silverStardustTotal: number;
  permanentCount: number;
  shardCount: number;
  jackpotCount: number; // 1,000 OG hits
  rarityCounts: {
    standard: number;
    epic: number;
    legendary: number;
    mythic: number;
    prestige: number;
  };
  gemstoneCounts: {
    "8": number;
    "12": number;
    "16": number;
    "20": number;
    "1000": number;
  };
  history: DropResult[];
  luckRating: number; // calculated luck percentage compared to expected
}

export interface StoreItem {
  id: string;
  skin: SkinItem;
  gemstoneCost: number;
  featured?: boolean;
  limited?: boolean;
}
