export type Language = "th" | "en";

export interface Translations {
  // Navigation & Badges
  store: string;
  chests: string;
  stats: string;
  workshop: string;
  gemShop: string;
  freeRollsBadge: string;
  resetAll: string;
  langSwitch: string;
  soundToggle: string;
  infoTitle: string;

  // Category & Banner
  bannerCategory: string;
  prestigeSelect: string;
  prestigeSelectBadge: string;
  bannerTitle: string;
  bannerSubtitle: string;

  // Stage & Buttons
  freeSandbox: string;
  opened: string;
  gemstones: string;
  jackpot: string;
  luck: string;
  chest3D: string;
  stageShowcase: string;
  open1: string;
  open5: string;
  skipAnimation: string;
  sim: string;

  // Reset Modal
  resetModalTitle: string;
  resetModalDesc: string;
  resetConfirm: string;
  cancel: string;

  // Opening Reward Modal
  rewardsTitle: string;
  jackpotBanner: string;
  mythicBanner: string;
  totalGemsGained: string;
  permanentSkins: string;
  skinShards: string;
  filterAll: string;
  filterPermanent: string;
  filterShards: string;
  filterGemstones: string;
  filterPrestige: string;
  filterLegendary: string;
  filterEpic: string;
  openAgain1: string;
  openAgain5: string;
  collectRewards: string;
}

export const translations: Record<Language, Translations> = {
  th: {
    store: "ร้านค้า",
    chests: "สุ่มกาชา",
    stats: "สถิติ",
    workshop: "เวิร์กช็อป",
    gemShop: "ร้านอัญมณี",
    freeRollsBadge: "สุ่มฟรีไม่จำกัด",
    resetAll: "รีเซ็ตทั้งหมด",
    langSwitch: "TH",
    soundToggle: "เปิด/ปิดเสียง",
    infoTitle: "ดูกติกาและอัตราดรอป",

    bannerCategory: "หมวดหมู่:",
    prestigeSelect: "PRESTIGE SELECT (ตู้คัดสรรเพรสทีจ)",
    prestigeSelectBadge: "PRESTIGE SELECT",
    bannerTitle: "ตู้สุ่มคัดสรรเพรสทีจ (PRESTIGE SELECT)",
    bannerSubtitle: "การันตีสกิน Mythic / Prestige พิเศษในรอบ 100 สุ่ม",

    freeSandbox: "ฟรีไม่จำกัด",
    opened: "เปิดแล้ว",
    gemstones: "อัญมณีส้ม",
    jackpot: "แจ็คพอต 1k",
    luck: "ดวงสุ่ม",
    chest3D: "กล่อง 3D",
    stageShowcase: "หน้าเวที",
    open1: "10 ตั๋ว / สุ่ม 1 ครั้ง",
    open5: "50 ตั๋ว / สุ่ม 5 ครั้ง",
    skipAnimation: "ข้ามแอนิเมชันเปิดของรางวัล",
    sim: "จำลอง",

    resetModalTitle: "ยืนยันการรีเซ็ตข้อมูลทั้งหมด?",
    resetModalDesc: "การรีเซ็ตจะล้างสถิติการสุ่ม, คลังสกินถาวร และเศษชิ้นส่วนในเวิร์กช็อปทั้งหมดให้กลับเป็นค่าเริ่มต้น",
    resetConfirm: "ยืนยันรีเซ็ตทั้งหมด",
    cancel: "ยกเลิก",

    rewardsTitle: "ยินดีด้วย! คุณได้รับของรางวัล",
    jackpotBanner: "💥 มหาโชคแจ็คพอต 1,000 อัญมณีสีส้ม! 💥",
    mythicBanner: "✨ สกินระดับตำนาน MYTHIC / PRESTIGE ปรากฏกาย! ✨",
    totalGemsGained: "อัญมณีสีส้มที่ได้รับ",
    permanentSkins: "สกินถาวร",
    skinShards: "เศษสกิน",
    filterAll: "ทั้งหมด",
    filterPermanent: "สกินถาวร",
    filterShards: "เศษสกิน",
    filterGemstones: "อัญมณีส้ม",
    filterPrestige: "PRESTIGE SELECT",
    filterLegendary: "เลเจนดารี",
    filterEpic: "เอปิค",
    openAgain1: "สุ่มอีก 1 ครั้ง",
    openAgain5: "สุ่มอีก 5 ครั้ง",
    collectRewards: "เก็บของรางวัล",
  },
  en: {
    store: "STORE",
    chests: "Chests",
    stats: "Stats",
    workshop: "Workshop",
    gemShop: "Gem Shop",
    freeRollsBadge: "Unlimited Free Rolls",
    resetAll: "Reset All",
    langSwitch: "EN",
    soundToggle: "Toggle SFX",
    infoTitle: "View Gacha Rates & Rules",

    bannerCategory: "Category:",
    prestigeSelect: "PRESTIGE SELECT",
    prestigeSelectBadge: "PRESTIGE SELECT",
    bannerTitle: "PRESTIGE SELECT SHOWCASE",
    bannerSubtitle: "Guaranteed Featured Mythic/Prestige on pull #100",

    freeSandbox: "Free Sandbox",
    opened: "Opened",
    gemstones: "Gemstones",
    jackpot: "1k Jackpot",
    luck: "Luck",
    chest3D: "3D Chest",
    stageShowcase: "Stage Showcase",
    open1: "10 OPEN 1 TIME(S)",
    open5: "50 OPEN 5 TIME(S)",
    skipAnimation: "SKIP REWARD ANIMATION",
    sim: "Sim",

    resetModalTitle: "Reset All Stats & Workshop?",
    resetModalDesc: "This will permanently erase all stats, unlocked permanent skins, shards, and restore everything to initial state.",
    resetConfirm: "Confirm Full Reset",
    cancel: "Cancel",

    rewardsTitle: "Rewards Obtained",
    jackpotBanner: "💥 ULTIMATE JACKPOT: 1,000 ORANGE GEMSTONES! 💥",
    mythicBanner: "✨ MYTHIC / PRESTIGE EXCLUSIVE LOOT! ✨",
    totalGemsGained: "Orange Gemstones Gained",
    permanentSkins: "Permanent Skins",
    skinShards: "Skin Shards",
    filterAll: "All",
    filterPermanent: "Permanents",
    filterShards: "Shards",
    filterGemstones: "Gemstones",
    filterPrestige: "PRESTIGE SELECT",
    filterLegendary: "Legendary",
    filterEpic: "Epic",
    openAgain1: "Open 1 Again",
    openAgain5: "Open 5 Again",
    collectRewards: "Collect Rewards",
  },
};
