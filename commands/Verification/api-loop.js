const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const reply = await client.awaitReply(message, "Are you sure you want to run this. This may cause harm to the database. ( y / n ) ")
    if(reply == "y"){
        const bucket = []
        const users = Array.from( client.users.cache.keys() )
        for (let i = 0; i < users.length; i++) {
            console.log(`${i} / ${users.length}`);
            const userID = users[i];
            const user = client.users.cache.get(userID)
            if(user.bot == false) {
                client.database.verify.read(userID).then(dbInfo => {
                    if(dbInfo[0] == false) bucket.push(userID)
                    console.log(bucket.length);
                })
            }
        }
        message.channel.send(bucket.length);
    } else { return message.channel.send(`cancelled!`) }
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
