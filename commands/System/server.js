const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    message.channel.send("Offical Hue server sent, check your dms!")
    message.author.send("discord.gg/QwgnZ83XD3")
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["support", "support-server"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Get a link for the offical Hue server",
    usage: `${filename}`
};
