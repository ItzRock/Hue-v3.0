const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    message.channel.send(`Check your DMS!`)
    const embed = client.defaultEmbed()
        .setTitle(`Bot Invite.`)
        .setThumbnail(client.user.avatarURL({format: "png", size: 2048}))
        .addField("Full Admin Permissions", `The bot will be able to run every command without encountering errors.\n[Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)`, true)
        .addField("Permission Choice", `The bot was not scripted for this and may encounter errors if the bot tries to run something and doesn't have permission\n[Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=536211191)`, true)
        
    return message.author.send(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["bot-invite"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "get the bot's invite link",
    usage: `${filename}`
};