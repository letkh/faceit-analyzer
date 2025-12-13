const axios = require('axios')
require('dotenv').config()

async function testPlayerData() {
    const playerId = 'f91f3d4b-bf5e-4a85-a05b-f8a826ac6b76' // letkh
    
    try {
        console.log('Fetching Faceit player stats...\n')
        const response = await axios.get(
            `https://open.faceit.com/data/v4/players/${playerId}/stats/cs2`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
            }
        )
        
        console.log('Full response:')
        console.log(JSON.stringify(response.data, null, 2))
        
        console.log('\n\nLifetime stats keys:')
        if (response.data.lifetime) {
            console.log(Object.keys(response.data.lifetime))
        }
        
    } catch (error) {
        console.error('Error:', error.message)
        if (error.response?.data) {
            console.error('Response:', error.response.data)
        }
    }
}

testPlayerData()
