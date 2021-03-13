const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const client = require('nekos.life');
const {sfw} = new client();
exports.run = async (client, message, args, level) => {
    message.channel.startTyping()
    const image = (await sfw.meow()).url
    message.channel.send({files: [image]})
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
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "kitty cat!!!!!",
    usage: `${filename}`
};
