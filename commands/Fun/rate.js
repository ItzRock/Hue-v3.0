const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(`Invalid arguments. I can't rate nothing!`)
    const rating = client.randomNumber(0,10)
    message.channel.send(`I give \`${args.join(" ")}\` a \`${rating}/10\``)
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
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "",
    usage: `${filename} <thing>`
};