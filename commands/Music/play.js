const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const searchFor = require('youtube-search-api').GetListByKeyword
const ytdl = require("ytdl-core")
exports.run = async (client, message, args, level) => {
    try {
        const songInfo = await ytdl.getInfo(args.join(" "));
        const serverQueue = client.music.queue.get(message.guild.id);
        client.music.execute(message, serverQueue);
    } catch (error) {
        const raw = await searchFor(args.join(" "));
        const items = raw.items
        if(items.length === 0 ) return message.channel.send(`Could not find a video.`)
        let search = ""
        const videos = []
        for (let index = 0; index < 10; index++) {
            videos.push({ title: items[index].title, id: items[index].id, thumbnail: items[index].thumbnail.thumbnails[0]})
            search = `${search}\nVideo #${index + 1}: \`${items[index].title}\``
        }
        const embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setTitle(`Reply with the video number you want to play`)
            .setTimestamp()
            .setFooter(client.user.username, client.user.avatarURL())
            .setDescription(search)
            .setColor(client.embedColour())
        const response = await client.awaitReply(message, embed)
        if(response){
            const trackNumber = parseInt(response.replace("#", "")) - 1
            if(trackNumber == undefined) return message.channel.send(`Invalid video number`)
            const serverQueue = client.music.queue.get(message.guild.id);
            const video = message
            video.content = `string https://www.youtube.com/watch?v=${videos[trackNumber].id}`
            client.music.execute(video, serverQueue);
        }
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
    description: "",
    usage: `${filename} [optional] <required>`
};