const { MessageEmbed } = require('discord.js');
const noblox = require("noblox.js")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`${client.config.emojis.exclamation} This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    const msg = await message.channel.send(`${client.config.emojis.exclamation} Request Pending.`)
    if(!args[0]){ // self
        const rawdata = await client.database.verify.read(message.author.id)
        if(rawdata[0] == false) {
            await msg.delete()
            return message.channel.send(`${client.config.emojis.x}${rawdata[1]}`)
        }
        const data = rawdata[1]
        const thumb = (await noblox.getPlayerThumbnail([data.RobloxID], 720, "png", false))[0].imageUrl
        const embed = new MessageEmbed()
            .setAuthor(`${client.user.username} Database Lookup`, client.user.avatarURL())
            .setFooter(`If anything is incorrect contact a Hue Admin`, client.user.avatarURL())
            .setColor(client.embedColour())
            .setTimestamp()
            .setThumbnail(thumb)
            .setTitle(`${client.user.username} Database Information`)
            .setDescription(`Checked User <@${message.author.id}>`)
            .addField('Roblox Username', `\`${data.RobloxUsername}\``, true)
            .addField('Roblox ID', `\`${data.RobloxID}\``, true)
            .addField('Roblox Profile Link', `[Profile Found Here](https://www.roblox.com/users/${data.RobloxID}/profile)`, true)
        await msg.delete()
        message.channel.send(embed)
    } else { // Other Users
        const rawuser = client.findUser(message, args[0])
        if(rawuser[0] == false) {
            await msg.delete()
            return message.channel.send(`${rawuser[1]}`)
        }
        const user = rawuser[1]
        const rawdata = await client.database.verify.read(user.user.id)
        if(rawdata[0] == false) {
            await msg.delete()
            return message.channel.send(`${client.config.emojis.exclamation}${rawdata[1]}`)
        }
        const data = rawdata[1]
        const thumb = (await noblox.getPlayerThumbnail([data.RobloxID], 720, "png", false))[0].imageUrl
        const embed = new MessageEmbed()
            .setAuthor(`${client.user.username} Database Lookup`, client.user.avatarURL())
            .setFooter(`If anything is incorrect contact a Hue Admin`, client.user.avatarURL())
            .setColor(client.embedColour())
            .setTimestamp()
            .setThumbnail(thumb)
            .setTitle(`${client.user.username} Database Information`)
            .setDescription(`Checked User <@${data.DiscordID}>`)
            .addField('Roblox Username', `\`${data.RobloxUsername}\``, true)
            .addField('Roblox ID', `\`${data.RobloxID}\``, true)
            .addField('Roblox Profile Link', `[Profile Found Here](https://www.roblox.com/users/${data.RobloxID}/profile)`, true)
        await msg.delete()
        message.channel.send(embed)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["checkdb", "db"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Find if a user is linked to the hue database",
    usage: `${filename} [Discord User]`
};
