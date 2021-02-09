const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0] || !args[1] || !args[2]) return message.channel.send(`Invalid Arguments: Usage ${client.getArgs(filename)}`)
    
    const channel = message.guild.channels.cache.get(args[0].replace("<#", "").replace(">", ""))
    if(channel == undefined) return message.channel.send(`Invalid channel, please mention the channel you want to send the message to`)
    const rawtitle = args[1].split("-")
    const title = rawtitle.join(" ")
    const embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .setTimestamp()
        .setTitle(title)
        .setColor(client.embedColour())
        .setDescription(args.slice(2).join(" "));
    message.channel.send(`Successfully Sent!`);
    channel.send(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Send a fancy Embed to a channel",
    usage: `${filename} <channel> <title> <message>`
};
