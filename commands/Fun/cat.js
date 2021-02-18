const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const images = [
        "https://media.discordapp.net/attachments/747261772939002040/800630469112496138/2.png",
        "https://cdn.discordapp.com/attachments/612224501954117632/793995994147717170/image0.png"
    ]
    message.channel.send(images.random())
}

exports.conf = {
    enabled: false,
    guildOnly: true,
    aliases: [],
    permLevel: "Hue Administrator",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "A picture of a cat",
    usage: `${filename}`
};
