const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]){
        const embed = new MessageEmbed()
            .setColor(client.embedColour())
            .setTitle(`${message.author.username}'s Avatar`)
            .setImage(message.author.avatarURL({format: "png", dynamic: true, size: 2048}))
        message.channel.send(embed)
    }else{
        const findUser = client.findUser(message, args[0])
        if(findUser[0] == false) return message.channel.send(findUser[1]);
        const embed = new MessageEmbed()
            .setColor(client.embedColour())
            .setTitle(`${findUser[1].user.username}'s Avatar`)
            .setImage(findUser[1].user.avatarURL({format: "png", dynamic: true, size: 2048}))
        message.channel.send(embed)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["pfp", "icon"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Get a user's profile picture",
    usage: `${filename} [user]`
};
