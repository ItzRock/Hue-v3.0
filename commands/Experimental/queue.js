const { MessageEmbed } = require('discord.js');
const ytdl = require("ytdl-core")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const nowPlaying = client.music.nowPlaying.get(message.guild.id)
    const serverQueue = client.music.queue.get(message.guild.id);
    if(nowPlaying === undefined) return message.channel.send(`Nothing is playing in the queue`)
    const currentSong = nowPlaying
    const queue = serverQueue.songs
    var queueMessage = ""
    
    for (let i = 1; i < queue.length; i++) {
        const song = queue[i];
        queueMessage = `${queueMessage}Position: \`${i}\`, **${song.title}**\nBy: **${song.other.ownerChannelName}**\n`
    }
    if(queueMessage == "") queueMessage = `No other songs are in the queue`
    const queueEmbed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .setThumbnail()
        .setColor(client.embedColour())
        .setTitle(`Current queue for: ${message.guild.name}`)
        .setThumbnail(currentSong.other.thumbnails[currentSong.other.thumbnails.length - 1].url)
        .addField(`Currently Playing`, `**${currentSong.title}**\nBy: **${currentSong.other.ownerChannelName}**`)
        .addField(`In Queue`, `${queueMessage}`)
    message.channel.send(queueEmbed)
}

exports.conf = {
    enabled: false,
    guildOnly: true,
    aliases: ["np", "nowplaying"],
    permLevel: "User",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Displays current server queue",
    usage: `${filename}`
};
