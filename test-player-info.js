const axios = require('axios')
require('dotenv').config()

async function testPlayerInfo() {
    const playerId = 'f91f3d4b-bf5e-4a85-a05b-f8a826ac6b76' // letkh
    
    try {
        console.log('Fetching player info...\n')
        const response = await axios.get(
            `https://open.faceit.com/data/v4/players/${playerId}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.FACEIT_API_KEY}`
                }
            }
        )
        
        console.log(JSON.stringify(response.data, null, 2))
        
    } catch (error) {
        console.error('Error:', error.message)
    }
}

testPlayerInfo()
