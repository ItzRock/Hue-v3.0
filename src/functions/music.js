const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core")
module.exports = (client) => {
    client.music = {}
    client.music.queue = new Map();
    client.music.execute = async (message, serverQueue) => {
        const args = message.content.split(" ");
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send("You need to be in a voice channel to play music!");
        //if(message.channel.type = "dm") return message.channel.send(`You need to be in a guild in order to run this command`)
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("I need the permissions to join and speak in your voice channel!");
        }

        var songInfo
        try {
            songInfo = await ytdl.getInfo(args[1]);
        } catch (error) {
            console.log(error);
            return message.channel.send(`Error, cannot play that video. is it a valid youtube domain?`)
        }
        if(songInfo.videoDetails.isLive == true || songInfo.videoDetails.isLiveContent == true) return message.channel.send(`I cannot play live streams!`)
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            other: songInfo.videoDetails
        };

        if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        client.music.queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            client.music.play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            client.music.queue.delete(message.guild.id);
            return message.channel.send(err);
        }
        } else {
            serverQueue.songs.push(song);
            const embed = new MessageEmbed()
                .setAuthor(client.user.username, client.user.avatarURL())
                .setFooter(client.user.username, client.user.avatarURL())
                .setTimestamp()
                .setColor(client.embedColour())
                .setTitle(`${client.user.username} Music System`)
                .setDescription(`Queued **${song.title}**\nBy: ${song.other.author.name}`)
                .setThumbnail(song.other.thumbnails[song.other.thumbnails.length - 1].url)
            return message.channel.send(embed);
        }
    }
    client.music.skip = async (message, serverQueue) => {
        if (!message.member.voice.channel)
            return message.channel.send("You have to be in a voice channel to stop the music!");
        if (!serverQueue)
            return message.channel.send("There is no song that I could skip!");
        serverQueue.connection.dispatcher.end();
    }
    client.music.stop = (message, serverQueue) => {
        if (!message.member.voice.channel)
            return message.channel.send("You have to be in a voice channel to stop the music!");
        
        if (!serverQueue)
            return message.channel.send("There is no song that I could stop!");
        
        serverQueue.songs = [];
       try{serverQueue.connection.dispatcher.end();}
       catch(err){

       }
    }
    client.music.play = (guild, song) => {
        const serverQueue = client.music.queue.get(guild.id);
        if (!song) {
            serverQueue.voiceChannel.leave();
            client.music.queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on("finish", () => {
                serverQueue.songs.shift();
                client.music.play(guild, serverQueue.songs[0]);
            })
            .on("error", error => {return serverQueue.textChannel.send(`Unable to play: \`${song.title}\``)});
        
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        const embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setFooter(client.user.username, client.user.avatarURL())
            .setTimestamp()
            .setColor(client.embedColour())
            .setTitle(`${client.user.username} Music System`)
            .setDescription(`Now Playing **${song.title}**\nBy: ${song.other.author.name}`)
            .setThumbnail(song.other.thumbnails[song.other.thumbnails.length - 1].url)
        serverQueue.textChannel.send(embed);
    }
}