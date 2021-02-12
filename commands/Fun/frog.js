const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const images = [
        "https://cdn.discordapp.com/attachments/612224501954117632/800863724985909268/holy_frog.mp4",
        "https://media.discordapp.net/attachments/612224501954117632/791833075721175050/image0.jpg?width=700&height=676"
    ]
    message.channel.send(images.random())
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["forg"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "forg :)",
    usage: `${filename}`
};
