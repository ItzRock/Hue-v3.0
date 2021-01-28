const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const serverQueue = client.music.queue.get(message.guild.id);
    client.music.skip(message, serverQueue);
    message.channel.send(`Skipping current song.`)
    return;
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Force skips videos in the queue",
    usage: `${filename}`
};