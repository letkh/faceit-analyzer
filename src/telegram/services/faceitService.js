const axios = require('axios')
const logger = require('../../utils/logger')

async function getSteamId(nickname) {
    try {
        const response = await axios.get(
            `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${nickname}`
        )
        if (response.data.response.success === 1) {
            return response.data.response.steamid
        }
        return null
    } catch (error) {
        logger.error({ nickname, error: error.message }, 'Steam API error')
        return null
    }
}

async function getFaceitPlayerBySteamId(steamId) {
    try {
        const response = await axios.get(
            `https://open.faceit.com/data/v4/players?game=cs2&game_player_id=${steamId}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
            }
        )
        return response.data
    } catch (error) {
        logger.error({ steamId, error: error.message }, 'Faceit API error')
        return null
    }
}

async function getSteamProfile(steamId) {
    try {
        const response = await axios.get(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamId}`
        )
        if (response.data.response.players && response.data.response.players.length > 0) {
            return response.data.response.players[0]
        }
        return null
    } catch (error) {
        logger.error({ steamId, error: error.message }, 'Steam profile error')
        return null
    }
}

async function getCS2Playtime(steamId) {
    try {
        const response = await axios.get(
            `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_API_KEY}&steamid=${steamId}&include_appinfo=true&appids_filter=1958310`
        )
        if (response.data.response.games && response.data.response.games.length > 0) {
            const cs2 = response.data.response.games.find(g => g.appid === 1958310)
            if (cs2) {
                return Math.round(cs2.playtime_forever / 60)
            }
        }
        return null
    } catch (error) {
        logger.error({ steamId, error: error.message }, 'CS2 playtime error')
        return null
    }
}

async function getFaceitPlayerStats(playerId) {
    try {
        const response = await axios.get(
            `https://open.faceit.com/data/v4/players/${playerId}/stats/cs2`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
            }
        )
        return response.data
    } catch (error) {
        logger.error({ playerId, error: error.message }, 'Faceit stats error')
        return null
    }
}

async function getFormattedPlayerStats(player, stats) {
    if (!stats || !stats.lifetime) return null
    
    const lifetime = stats.lifetime
    const elo = player?.games?.cs2?.faceit_elo || 'N/A'
    
    return {
        elo,
        winRate: lifetime['Win Rate %'] || 'N/A',
        matches: lifetime['Matches'] || 'N/A',
        hs: lifetime['Average Headshots %'] || 'N/A',
        kd: lifetime['Average K/D Ratio'] || 'N/A',
        adr: lifetime['ADR'] || 'N/A',
        registered: player.activated_at,
        country: player.country
    }
}

module.exports = { 
    getFaceitPlayerBySteamId, 
    getSteamId, 
    getSteamProfile,
    getCS2Playtime,
    getFaceitPlayerStats,
    getFormattedPlayerStats
}
