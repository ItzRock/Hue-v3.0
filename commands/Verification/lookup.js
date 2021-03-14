const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const noblox = require("noblox.js")
const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`${client.config.emojis.exclamation} This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    if(!args[0]) return message.channel.send(`${client.config.emojis.x} Invalid Arguments: \`${client.getArgs(filename)}\``)
    const msg = await message.channel.send(`${client.config.emojis.exclamation} Request Pending.`)
    
    try {
        const user = await noblox.getIdFromUsername(args.join(" "))
        await msg.delete()
        if(user == undefined) return message.channel.send(`${client.config.emojis.x} This user does not exist!`)
        const playerInfo = await noblox.getPlayerInfo({userId: user})
        let OldNames = playerInfo.oldNames.join("\n")
        if(OldNames == "") OldNames = "None"
        const hueDB = await client.database.verify.readROBLOXID(user)
        let hueDesc = "No info was found"
        if(hueDB[0] == true) {
            if(client.users.cache.get(hueDB[1].DiscordID) !== undefined) {
                const disUser = client.users.cache.get(hueDB[1].DiscordID)
                hueDesc = `**Discord Tag**: \`${disUser.tag}\`\n**Discord ID**: \`${disUser.id}\`\n\n<@${disUser.id}>`
            } else hueDesc = `**Discord ID**: ${hueDB[1].DiscordID}`
        }
        let desc = "No Description"
        if(playerInfo.blurb.substring(0, 999) !== "") desc = playerInfo.blurb.substring(0, 999)

        const miliseconds = parseInt(playerInfo.age) * 24 * 60 * 60 * 1000;
        const duration = moment.duration(miliseconds).format("Y [years], M [months]");

        const embed = client.defaultEmbed()
            .setTitle(`Info on \`${playerInfo.username}\``)
            .setThumbnail((await noblox.getPlayerThumbnail([user], 720, "png", false))[0].imageUrl)
            .addField("Roblox Username", `[${playerInfo.username}](https://www.roblox.com/users/${user}/profile)`, true)
            .addField("Roblox ID", user, true)
            .addField("Account Age", `${duration} old\n(${playerInfo.joinDate.getFullYear()}-${playerInfo.joinDate.getMonth() + 1}-${playerInfo.joinDate.getDate()})`, true)
            .addField("Old Names", `\`${OldNames.substring(0, 999)}\``, true)
            .addField("Stats", `Friends: \`${playerInfo.friendCount}\`\nFollowers: \`${playerInfo.followerCount}\``, true)
            .addField("Hue DB Info", `${hueDesc}`, true)
            .addField("Description", `${desc}`)
        message.channel.send(embed)
    } catch (error) {
        const embed = client.errorEmbed(error)
        message.channel.send(embed)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["robloxsearch", "find", "rblxseach"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Search for a roblox user.",
    usage: `${filename} <Roblox Username>`
};
