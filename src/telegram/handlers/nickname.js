const {
  getFaceitPlayerBySteamId,
  getSteamId,
  getSteamProfile,
  getCS2Playtime,
  getFaceitPlayerStats,
  getFormattedPlayerStats
} = require('../services/faceitService')
const { getLeetifyProfile } = require('../services/leetifyService')
const logger = require('../../utils/logger')

function extractNickname(text) {
  const steamIdMatch = text.match(/\/profiles\/(\d+)/)
  if (steamIdMatch) return { type: 'steamid', value: steamIdMatch[1] }

  const nicknameMatch = text.match(/\/id\/([^/?]+)/)
  if (nicknameMatch) return { type: 'nickname', value: nicknameMatch[1] }

  if (text && !text.includes('http') && text.length > 2) {
    return { type: 'nickname', value: text.trim() }
  }

  return null
}

function formatPlayerInfo(faceitPlayer, steamProfile, cs2Playtime, faceitPlayerStats, leetifyProfile) {
  let message = `🎮 **${faceitPlayer.nickname}**\n\n`

  if (steamProfile) {
    message += `**📘 STEAM**\n`
    const steamRegDate = new Date(steamProfile.timecreated * 1000)
    message += `Registered: \`${steamRegDate.toLocaleDateString('ru-RU')}\`\n`

    const vanity = steamProfile.profileurl?.split('/').filter(x => x)[3] || 'N/A'
    message += `Vanity: \`${vanity}\`\n`

    if (cs2Playtime !== null && cs2Playtime !== undefined) {
      message += `CS2 playtime: \`${cs2Playtime}ч\`\n`
    }
    message += `\n`
  }

  message += `**🎯 FACEIT**\n`

  if (faceitPlayer.activated_at) {
    const regDate = new Date(faceitPlayer.activated_at)
    message += `Registered: \`${regDate.toLocaleDateString('ru-RU')}\`\n`
  }

  const country = faceitPlayer.country ? faceitPlayer.country.toUpperCase() : 'Unknown'
  message += `Country: 🌍 ${country}\n`

  if (faceitPlayerStats) {
    const elo = faceitPlayerStats.elo !== 'N/A' ? faceitPlayerStats.elo : 'N/A'
    const winRate = faceitPlayerStats.winRate !== 'N/A' ? faceitPlayerStats.winRate : 'N/A'
    const matches = faceitPlayerStats.matches !== 'N/A' ? faceitPlayerStats.matches : 'N/A'
    const hs = faceitPlayerStats.hs !== 'N/A' ? faceitPlayerStats.hs : 'N/A'
    const kd = faceitPlayerStats.kd !== 'N/A' ? faceitPlayerStats.kd : 'N/A'
    const adr = faceitPlayerStats.adr !== 'N/A' ? faceitPlayerStats.adr : 'N/A'

    message += `ELO: \`${elo}\`\n`
    message += `Win Rate: \`${winRate}%\`\n`
    message += `Matches: \`${matches}\`\n`
    message += `HS: \`${hs}%\`\n`
    message += `K/D: \`${kd}\`\n`
    message += `ADR: \`${adr}\`\n`
  }

  if (leetifyProfile) {
    message += `\n**📊 LEETIFY**\n`
    
    const rating = leetifyProfile.rating
    const stats = leetifyProfile.stats
    const ranks = leetifyProfile.ranks
    
    if (rating) {
      if (rating.aim !== undefined) message += `Aim: \`${rating.aim.toFixed(1)}\`\n`
      if (rating.utility !== undefined) message += `Utility: \`${rating.utility.toFixed(1)}\`\n`
      if (rating.positioning !== undefined) message += `Position: \`${rating.positioning.toFixed(1)}\`\n`
      if (rating.clutch !== undefined) message += `Clutch: \`${rating.clutch > 0 ? '+' : ''}${rating.clutch.toFixed(1)}\`\n`
      if (rating.opening !== undefined) message += `Opening: \`${rating.opening > 0 ? '+' : ''}${rating.opening.toFixed(1)}\`\n`
    }
    
    if (ranks?.leetify !== undefined) {
      message += `Rating: \`${ranks.leetify > 0 ? '+' : ''}${ranks.leetify.toFixed(1)}\`\n`
    }
    
    if (stats) {
      if (stats.preaim !== undefined) message += `Preaim: \`${stats.preaim.toFixed(2)}°\`\n`
      if (stats.reaction_time_ms !== undefined) message += `Time to DMG: \`${Math.round(stats.reaction_time_ms)}ms\`\n`
      if (stats.he_foes_damage_avg !== undefined && stats.he_friends_damage_avg !== undefined) {
        message += `AVG HE DMG: \`${stats.he_foes_damage_avg.toFixed(1)} / ${stats.he_friends_damage_avg.toFixed(1)}\`\n`
      }
    }
    
    if (leetifyProfile.winrate !== undefined) {
      message += `Winrate: \`${(leetifyProfile.winrate * 100).toFixed(0)}%\`\n`
    }
    
    if (leetifyProfile.total_matches) {
      message += `Matches: \`${leetifyProfile.total_matches}\`\n`
    }
  }

  message += `\n🔗 [Faceit Profile](https://www.faceit.com/players/${faceitPlayer.nickname})`
  return message
}

module.exports = {
  filter: (text) => {
    const isSteamUrl = /https:\/\/steamcommunity\.com\/(id\/.+|profiles\/\d+)/.test(text)
    const isPlainText = text && !text.includes('http') && text.trim().length > 2
    return isSteamUrl || isPlainText
  },
  handler: async (ctx) => {
    const extracted = extractNickname(ctx.message.text)
    const userId = ctx.from.id

    if (!extracted) {
      ctx.reply('Invalid Steam URL or nickname')
      return
    }

    try {
      // await ctx.sendChatAction('typing')

      let faceitPlayer = null
      let steamId = null

      if (extracted.type === 'steamid') {
        steamId = extracted.value
        faceitPlayer = await getFaceitPlayerBySteamId(steamId)
      } else if (extracted.type === 'nickname') {
        steamId = await getSteamId(extracted.value)
        if (steamId) {
          faceitPlayer = await getFaceitPlayerBySteamId(steamId)
        }
      }

      if (faceitPlayer) {
        const steamProfile = steamId ? await getSteamProfile(steamId) : null
        const cs2Playtime = steamId ? await getCS2Playtime(steamId) : null
        const leetifyProfile = steamId ? await getLeetifyProfile(steamId) : null
        const faceitPlayerStats = await getFaceitPlayerStats(faceitPlayer.player_id)
        const formattedStats = await getFormattedPlayerStats(faceitPlayer, faceitPlayerStats)

        const message = formatPlayerInfo(faceitPlayer, steamProfile, cs2Playtime, formattedStats, leetifyProfile)
        if (steamProfile?.avatarfull) {
          ctx.replyWithPhoto(steamProfile.avatarfull, {
            caption: message,
            parse_mode: 'Markdown'
          })
        } else {
          ctx.reply(message, { parse_mode: 'Markdown' })
        }
      } else {
        ctx.reply('Player not found')
      }
    } catch (error) {
      logger.error({ userId, error: error.message }, 'Handler error')
      ctx.reply('Error fetching player data')
    }
  }
}
