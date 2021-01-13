const { MessageEmbed } = require('discord.js');
const ytdl = require("ytdl-core")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    return message.channel.send(`Me not worky`)
    const serverQueue = client.music.queue.get(message.guild.id);
    if(serverQueue === undefined) return message.channel.send(`Nothing is playing in the queue`)
    const currentSong = serverQueue.songs[0];
    const queue = serverQueue.songs.shift();
    var queueMessage = "**Current Queue**"
    
    for (let i = 0; i < queue.length; i++) {
        const song = queue[index];
        queueMessage = `${queueMessage}Position: \`${i + 1}\`, ${song.title}: By: ${song.other.ownerChannelName}\n`
    }
    if(queue.length === 0) queueMessage = `No other songs are in the queue`
    const queueEmbed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .setThumbnail()
        .setColor(client.embedColour())
        .setTitle(`Current queue for: ${message.guild.name}`)
        .setThumbnail(currentSong.other.thumbnails[currentSong.other.thumbnails.length - 1].url)
        .addField(`Currently Playing`, `${currentSong.title}: By: ${currentSong.other.ownerChannelName}`)
        .addField(`In Queue`, `${queueMessage}`)
    message.channel.send(queueEmbed)
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
