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

### LEETIFY Statistics
- 🏆 Competitive Rank
- ⭐ Rating
- 🎯 Aim score
- 📍 Positioning score
- 💣 Utility score

### Avatar Display
The bot automatically sends the player's Steam avatar along with the information.

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
- **Leetify API** - advanced CS2 analytics and ratings
- **Node.js** - backend application

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Fill in your API keys:
   - **STEAM_API_KEY** - Get from https://steamcommunity.com/dev/apikey
   - **FACEIT_API_KEY** - Get from https://developers.faceit.com
   - **TELEGRAM_TOKEN** - Get from @BotFather
   - **LEETIFY_API_KEY** - Get from https://leetify.com/app/developer
4. Install dependencies: `npm install`
5. Start the bot: `npm start`