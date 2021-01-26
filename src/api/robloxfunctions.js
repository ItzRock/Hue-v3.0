module.exports = (client) => {
    client.apis.roblox = {}
    client.apis.roblox.avatarURL = async function(robloxID){
        const data = await client.apis.https.get(`https://thumbnails.roblox.com/v1/users/avatar?format=Png&isCircular=false&size=720x720&userIds=${robloxID}`)
        return data.data[0].imageUrl
    }
}