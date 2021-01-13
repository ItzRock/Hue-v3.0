const { MessageEmbed } = require('discord.js');
const ytdl = require("ytdl-core")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const serverQueue = client.music.queue.get(message.guild.id);
    console.log(serverQueue);
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
    usage: `${filename} [optional] <required>`
};
