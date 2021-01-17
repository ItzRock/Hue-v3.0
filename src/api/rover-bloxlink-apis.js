module.exports = (client) => {
    client.apis.bloxlink = async (DiscordID) => {
        const api = `https://api.blox.link/v1/user/${DiscordID}`;
        const data = await client.apis.https.get(api)
        if(data.status !== 'ok') return false
        const formatted = { status: data.status, id: data.primaryAccount }
        return formatted
    }
    client.apis.rover = async (DiscordID) => {
        const api = `https://verify.eryn.io/api/user/${DiscordID}`;
        const data = await client.apis.https.get(api)
        if(data.status !== 'ok') return false
        const formatted = { status: data.status, id: data.robloxId }
        return formatted
    }
}