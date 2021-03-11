const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const client = require('nekos.life');
const {sfw} = new client();
exports.run = async (client, message, args, level) => {
    message.channel.startTyping()
    const image = (await sfw.neko()).url
    message.channel.send("Image uses API so if lewd image use ;disable neko",{files: [image]})
    message.channel.stopTyping()
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "This uses an API so if an image is lewd you can disable the command.",
    usage: `${filename}`
};
