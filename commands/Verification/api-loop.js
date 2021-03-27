const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
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
        const interval = setInterval(async () => {
            index++
            const data = await checkAPI(bucket[index])
            newBucket.push({discordID: bucket[index], IDS: data})
            if(index == bucket.length) {
                stage3(newBucket, msg)
                clearInterval(interval)
            }
        }, 1000)
    }
    async function checkAPI(discordID){
        const ids = []
        const rover = await client.apis.rover(discordID);
        const bloxlink = await client.apis.bloxlink(discordID);
        if(rover !== false) ids.push(rover.id);
        if(bloxlink !== false) ids.push(bloxlink.id);
        return ids
    }

    function stage3(bucket, msg){
        msg.edit(JSON.stringify(bucket))
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
