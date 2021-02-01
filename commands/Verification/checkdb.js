const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const noblox = require("noblox.js")
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`This command is only available in servers with ${client.user.username}'s verification system enabled.`)

    const msg = await message.channel.send(`Request Pending.`)
    if(!args[0]){
        //Self Lookup
        const rawdata = await client.database.verify.read(message.author.id)
        if(rawdata[0] == false) return message.channel.send(`${rawdata[1]}`)
        const data = rawdata[1]
        const thumbnailRaw = await client.apis.https.get(`https://thumbnails.roblox.com/v1/users/avatar?format=Png&isCircular=false&size=720x720&userIds=${data.RobloxID}`)
        const thumbURL = thumbnailRaw.data[0].imageUrl
        const updatedUsername = await noblox.getUsernameFromId(data.RobloxID)
        const embed = new MessageEmbed()
            .setAuthor(`${client.user.username} Database Lookup`, client.user.avatarURL())
            .setFooter(`If anything is incorrect contact a Hue Admin`, client.user.avatarURL())
            .setColor(client.embedColour())
            .setTimestamp()
            .setThumbnail(thumbURL)
            .setTitle(`${client.user.username} Database Information`)
            .setDescription(`Checked User <@${message.author.id}>`)
            .addField('Roblox Username', `\`${updatedUsername}\``, true)
            .addField('Roblox ID', `\`${data.RobloxID}\``, true)
            .addField('Roblox Profile Link', `[Profile Found Here](https://www.roblox.com/users/${data.RobloxID}/profile)`, true)
        await msg.delete()
        message.channel.send(embed)
    } else {
        //Other user lookup
        const user = client.findUser(message, args[0])
        if(user[0] == false) return message.channel.send(`${user[1]}`)
        const rawdata = await client.database.verify.read(user[1].user.id)
        if(rawdata[0] == false) {
            await msg.delete()
            return message.channel.send(`${rawdata[1]}`)
        }
        const data = rawdata[1]
        const thumbnailRaw = await client.apis.https.get(`https://thumbnails.roblox.com/v1/users/avatar?format=Png&isCircular=false&size=720x720&userIds=${data.RobloxID}`)
        const thumbURL = thumbnailRaw.data[0].imageUrl
        const updatedUsername = await noblox.getUsernameFromId(data.RobloxID)
        const embed = new MessageEmbed()
            .setAuthor(`${client.user.username} Database Lookup`, client.user.avatarURL())
            .setFooter(`If anything is incorrect contact a Hue Admin`, client.user.avatarURL())
            .setColor(client.embedColour())
            .setThumbnail(thumbURL)
            .setTimestamp()
            .setTitle(`${client.user.username} Database Information`)
            .setDescription(`Checked User <@${data.DiscordID}>`)
            .addField('Roblox Username', `\`${updatedUsername}\``, true)
            .addField('Roblox ID', `\`${data.RobloxID}\``, true)
            .addField('Roblox Profile Link', `[Profile Found Here](https://www.roblox.com/users/${data.RobloxID}/profile)`, true)
        await msg.delete()
        message.channel.send(embed)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["db"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Database search for selected user.",
    usage: `${filename} [user]`
};
