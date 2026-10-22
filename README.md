# League of Legends: Wild Rift - Hextech Loot & Gacha Simulator (Latest Patch)

A realistic, high-fidelity **Wild Rift Hextech Loot & Gacha Simulator** built with React 19, TypeScript, Vite, and Tailwind CSS. Designed to replicate the authentic in-game Hextech Crafting UI, audio, probabilities, and provide in-depth statistical data collection for your gacha luck.

---

## 🎮 Key Features

### 1. Authentic Wild Rift UI & Animations

- **Hextech Visual Style**: Deep sapphire & gold aesthetic, runic inscriptions, floating magical crystal core.
- **Chest Opening Sequence**:
  - Realistic chest charging, rumbling, and bursting open.
  - Web Audio API synthesized SFX (Hextech unlock chime, rarity fanfare, jackpot fanfare) without external audio file loading failures.
  - Multi-card reveal sequence with rarity borders (Prestige, Mythic, Legendary, Epic, Standard).
  - Fast Mode toggle ("Skip Animation") for high-speed rolls.

### 2. Official Wild Rift Loot Mechanics (Latest Patch)

- **Hextech Chests**:
  - Cost: **10 Hextech Keys** (= **150 Wild Cores**, 15 WC/key).
  - **Skin Content Roll**:
    - **Permanent Skin**: `5.00%`
    - **Skin Shard**: `95.00%`
  - **Orange Gemstone Independent Roll**:
    - 8 Gemstones: `70.0%`
    - 12 Gemstones: `17.0%`
    - 16 Gemstones: `8.0%`
    - 20 Gemstones: `4.90%`
    - **1,000 Gemstones (Jackpot!)**: `0.10%` (1 in 1,000 chests)
  - **Milestone Rewards Track**:
    - Guaranteed rewards at 5, 10, 25, 50, 100, 120, 140, 160, 180, and 200 chests.
    - Click to claim bonus Keys, Silver Stardust, and Selection Chests!

### 3. Alternative Gacha Banners

- **Calligraphia / Supreme Cells Gacha**:
  - 100 Wild Cores / roll.
  - 100-pull hard pity for guaranteed featured Mythic skin.
- **Poro Chests (Free-to-Play)**:
  - 200 Poro Coins per chest.
  - Fills Poro Energy toward guaranteed Random Skin Chest at 5,000 Energy.

### 4. Comprehensive Gacha Data Collection & Luck Analytics

- **Live Spending Tracker**:
  - Total Chests Opened, Hextech Keys used, and Wild Cores consumed.
  - Real-world equivalent cost in **USD ($)**, **THB (฿)**, or **EUR (€)**.
- **Live Luck Rating Index**:
  - Centered at `100%` (average luck).
  - Dynamically calculates your luck status based on:
    - Actual Permanent Skin rate vs. official `5.00%`.
    - Actual Average Orange Gemstones vs. expected `10.90 OG/chest`.
    - 1,000 OG Jackpots hit vs. `0.10%`.
    - High-tier (Legendary & Mythic) drop frequency.
- **Visual Distribution Charts**:
  - Skin Tier breakdown (Mythic/Prestige, Legendary, Epic, Standard).
  - Orange Gemstones frequency breakdown (8, 12, 16, 20, 1000).
- **Export Data**:
  - **Export CSV**: Complete raw dataset ready for Microsoft Excel, Google Sheets, or data analysis.
  - **Export JSON**: Full structured data backup.
  - **Filterable History Log**: Filter by All, Permanents, High-Tier, or 1,000 OG Jackpots.

### 5. Hextech Vault & Workshop

- **Owned Permanent Skins**: View all unlocked skins in your permanent collection.
- **Skin Shards**:
  - Disenchant unwanted shards for **Silver Stardust** (`+150` to `+600`).
  - Forge shards into permanent skins using Silver Stardust.
  - **1-Click "Disenchant All Shards"** for fast conversion.
- **Orange Gemstone Redeem Store**:
  - Exchange accumulated Orange Gemstones for exclusive Prestige & Mythic skins (e.g. Prestige Mythmaker Gwen, Prestige Soul Fighter Yasuo, Hextech Kassadin, Ashen Knight Pyke).

---

## 🚀 Running the App

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Server runs locally at: `http://localhost:5173/`
