const axios = require('axios')
const logger = {
    info: (...args) => console.log('[INFO]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args),
    error: (...args) => console.error('[ERROR]', ...args)
}

const LEETIFY_BASE_URL = 'https://api-public.cs-prod.leetify.com'

async function getLeetifyProfile(steamId) {
    try {
        const response = await axios.get(
            `${LEETIFY_BASE_URL}/v3/profile`,
            {
                params: { steam64_id: steamId },
                headers: {
                    'Authorization': process.env.LEETIFY_API_KEY || ''
                }
            }
        )
        return response.data
    } catch (error) {
        logger.error({ steamId, error: error.message }, 'Leetify profile error')
        return null
    }
}

async function getLeetifyMatches(steamId, limit = 5) {
    try {
        const response = await axios.get(
            `${LEETIFY_BASE_URL}/v3/profile/matches`,
            {
                params: { steam64_id: steamId, limit },
                headers: {
                    'Authorization': process.env.LEETIFY_API_KEY || ''
                }
            }
        )
        return response.data
    } catch (error) {
        logger.error({ steamId, error: error.message }, 'Leetify matches error')
        return null
    }
}

module.exports = {
    getLeetifyProfile,
    getLeetifyMatches
}
