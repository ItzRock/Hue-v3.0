const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(`${client.config.emojis.x} Invalid Arguments: \`${client.getArgs(filename)}\``)
    if(!args[0].includes("<:")) return message.channel.send(`${client.config.emojis.x} Error: Only custom emojis are supported!`)
    const id = args[0].match(/\d+/)[0]
    
    return message.channel.send(`${client.config.emojis.check}Emoji ID: \`${id}\`, Emoji Debug: \`${args[0]}\`\nhttps://cdn.discordapp.com/emojis/${id}`)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "get url and id of specified emoji.",
    usage: `${filename} <emoji>`
};
