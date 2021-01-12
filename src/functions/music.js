const ytdl = require("ytdl-core")
module.exports = (client) => {
    client.music = {}
    client.music.queue = new Map();
    client.music.execute = async (message, serverQueue) => {
        const args = message.content.split(" ");

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send("You need to be in a voice channel to play music!");
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("I need the permissions to join and speak in your voice channel!");
        }

        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
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
            console.log(err);
            client.music.queue.delete(message.guild.id);
            return message.channel.send(err);
        }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to the queue!`);
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
        serverQueue.connection.dispatcher.end();
    }
    client.music.play = (guild, song) => {
        console.log(song);
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
            .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }
}