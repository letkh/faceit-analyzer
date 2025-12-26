const axios = require('axios')
require('dotenv').config()

async function testLeetify() {
    const steamId = '76561199326245090'
    const apiKey = process.env.LEETIFY_API_KEY
    
    console.log('Testing Leetify API...')
    console.log(`API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET'}`)
    console.log(`Steam ID: ${steamId}\n`)
    
    try {
        const url = `https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steamId}`
        console.log('Request URL:', url)
        
        const response = await axios.get(url, {
            headers: apiKey ? { 'Authorization': apiKey } : {}
        })
        
        console.log('✅ Success! Response:')
        console.log(JSON.stringify(response.data, null, 2))
    } catch (error) {
        console.log('❌ Error:', error.response?.status, error.response?.statusText)
        console.log('Message:', error.message)
        if (error.response?.data) {
            console.log('Response data:', JSON.stringify(error.response.data, null, 2))
        }
    }
}

testLeetify()
