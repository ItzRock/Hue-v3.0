const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const noblox = require("noblox.js")
exports.run = async (client, message, args, level) => {
    const reply = await client.awaitReply(message, `${client.config.emojis.exclamation} `+"Are you sure you want to run this. This may cause harm to the database. ( y / n ) ")
    if(reply == "y"){
        const bucket = []
        const users = Array.from( client.users.cache.keys() )
        console.log(`Checking ${users.length} users.`);
        const msg = await message.channel.send(`${client.config.emojis.exclamation} Checking ${users.length} users. Please wait a minute.`)
        for (let i = 0; i < users.length; i++) {
            const userID = users[i];
            const user = client.users.cache.get(userID)
            if(user.bot == false) {
                client.database.verify.read(userID).then(dbInfo => {
                    if(dbInfo[0] == false) bucket.push(userID)
                    if(i + 1 == client.users.cache.size){
                        stage2(bucket, msg)
                    }
                })
            }
        }
    } else { return message.channel.send(`cancelled!`) }
    function stage2(bucket, msg){
        msg.edit(`${client.config.emojis.exclamation} Currently ${bucket.length} users are not verified. Working on verifying them.`)
        let index = -1
        const newBucket = []
        let errored = 0
        const interval = setInterval(async () => {
            index++
            try {
                const data = await checkAPI(bucket[index])
                newBucket.push({discordID: bucket[index], IDS: data})
            } catch (error) {
                errored++
                setTimeout(()=> {}, 1000)
                msg.edit(`${client.config.emojis.exclamation} Currently ${bucket.length} users are not verified. Working on verifying them. (Errored ${errored})`)
        
            }
            if(index == bucket.length) {
                stage3(newBucket, msg)
                clearInterval(interval)
            }
        }, 1000)
    }
    async function checkAPI(discordID){
        discordID = discordID.toString()
        const ids = []

        const rover = await client.apis.rover(discordID);
        const bloxlink = await client.apis.bloxlink(discordID);
        if(rover.id !== undefined) ids.push(rover.id);
        if(bloxlink.id !== undefined) ids.push(bloxlink.id);
        return ids
    }
    let success = 0
    let theOkay = false
    function stage3(bucket, msg){
        message.channel.send({
            files: [
                {
                    name: "data.json",
                    attachment: Buffer.from(JSON.stringify(bucket))
                }
            ]
        })
        const newBucket = []
        for(i = 0; i < bucket.length; i++){
            const user = bucket[i]
            const userObj = client.users.cache.get(user.discordID)
            
            if(user.IDS.length == 0) newBucket.push(`${userObj.tag} was not found.`);
            if(user.IDS.length == 1) {
                newBucket.push(`${userObj.tag} was found as ${user.IDS[0]}.`)
                verify(user.discordID, user.IDS[0])
            }
            if(user.IDS.length == 2){
                newBucket.push(`${userObj.tag} was found as ${user.IDS[0]} | ${user.IDS[1]}.`) 
                verify(user.discordID, user.IDS[0])
            }
            if(i === bucket.length - 1){
                message.channel.send(`${message.check} Successfully Verified ${success} users.`,{
                    files: [
                        {
                            name: "data.txt",
                            attachment: Buffer.from(newBucket.join("\n"))
                        }
                    ]
                })
            }
        }
    }
    async function verify(disID, rblxID){
        const user = client.users.cache.get(disID)
        success++
        const robloxUsername = await noblox.getUsernameFromId(rblxID)
        client.database.verify.event(user.tag, robloxUsername, rblxID, "Global API Loop", "Global API Loop", "Global API Loop")
        client.database.verify.write(robloxUsername, rblxID, disID)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["al"],
    permLevel: "Hue Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "do not run unless you are okay with api spamming",
    usage: `${filename}`
};
