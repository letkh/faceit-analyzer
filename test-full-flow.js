const {
  getFaceitPlayerBySteamId,
  getSteamProfile,
  getCS2Playtime,
  getFaceitPlayerStats,
  getFormattedPlayerStats
} = require('./src/telegram/services/faceitService')

async function testFullFlow() {
  const steamId = '76561199326245090' // letkh Steam ID
  
  try {
    console.log('Fetching complete player info...\n')
    
    // Get Faceit player by Steam ID
    const faceitPlayer = await getFaceitPlayerBySteamId(steamId)
    if (!faceitPlayer) {
      console.log('❌ Faceit player not found')
      return
    }
    
    console.log('✅ Faceit player found:', faceitPlayer.nickname)
    
    // Get Steam profile
    const steamProfile = await getSteamProfile(steamId)
    console.log('✅ Steam profile found')
    
    // Get CS2 playtime
    const cs2Playtime = await getCS2Playtime(steamId)
    console.log(`✅ CS2 playtime: ${cs2Playtime}h`)
    
    // Get Faceit stats
    const faceitStats = await getFaceitPlayerStats(faceitPlayer.player_id)
    console.log('✅ Faceit stats found')
    
    // Format stats
    const formattedStats = await getFormattedPlayerStats(faceitPlayer, faceitStats)
    console.log('\n📊 Formatted Stats:')
    console.log(JSON.stringify(formattedStats, null, 2))
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

require('dotenv').config()
testFullFlow()
