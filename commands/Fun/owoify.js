const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const api = new new require('nekos.life')()
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(`${client.config.emojis.x} Inyvawid Awgumenyts. Usage: \`${client.getArgs(filename)}\``)
    const bannedPhrases = [
        "<@",
    ]
    const response = await api.sfw.OwOify({text : args.join(" ")})
    if(response.owo.includes("<@")) return message.channel.send('Cannot send a mention')
    message.channel.send(response.owo)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["owo"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "owo whats this",
    usage: `${filename} <message>`
};
