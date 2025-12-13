# faceit-analyzer

Telegram bot for analyzing CS2 player profiles through Steam and Faceit API integration.

## Features

The bot provides complete player information based on Steam profile:

### STEAM Information
- 📅 Registration date
- 🔗 Vanity URL
- ⏱️ CS2 playtime

### FACEIT Statistics
- 🎯 ELO rating
- 📊 Win Rate (%)
- 🎮 Number of matches
- 🎯 Headshots (%)
- ⚔️ K/D Ratio
- 📈 ADR (Average Damage per Round)
- 🌍 Country
- 📅 Faceit registration date

## How to Use

1. **By Steam ID from profile:**
   ```
   https://steamcommunity.com/profiles/76561199326245090
   ```

2. **By Steam Vanity URL:**
   ```
   https://steamcommunity.com/id/letkh-
   ```

3. **By text nickname:**
   ```
   letkh-
   ```

## Technology Stack

- **Telegram Bot API** - bot interaction
- **Steam API** - profile data and playtime
- **Faceit API** - CS2 player statistics
- **Node.js** - backend application