const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if (!message.member.voice.channel)
            return message.channel.send("You have to be in a voice channel to stop the music!");
    var votedUsers = client.music.skipsUser.get(message.guild.id)
    if(votedUsers == undefined) client.music.skipsUser.set(message.guild.id, [])
    votedUsers = client.music.skipsUser.get(message.guild.id)
    if(votedUsers.includes(message.author.id)) return message.channel.send(`You cannot vote twice!`)
    var currentSkips = client.music.skips.get(message.guild.id);
    if(currentSkips == undefined) client.music.skips.set(message.guild.id, 0);
    currentSkips = client.music.skips.get(message.guild.id);
    const required = Math.round((message.member.voice.channel.members.size - 1) / 2 )
    const newCount = currentSkips + 1
    client.music.skips.set(message.guild.id, newCount);
    votedUsers.push(message.author.id);
    client.music.skipsUser.set(message.guild.id, votedUsers);
    if(newCount >= required){
        message.channel.send(`${required}/${required} voted to skip! Skipping current song.`)
        const serverQueue = client.music.queue.get(message.guild.id);
        client.music.skip(message, serverQueue);
        client.music.skips.delete(message.guild.id);
        client.music.skipsUser.delete(message.guild.id);
        return;
    } else{
        message.channel.send(`${newCount}/${required} voted to skip! needs ${required - newCount} more skips in order to skip`)
        return
    }
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
    description: "Skips videos in the queue",
    usage: `${filename}`
};