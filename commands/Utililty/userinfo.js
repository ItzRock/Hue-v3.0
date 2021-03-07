const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]){
        lookup(message.author, message.member)
    } else {
        const rawuser = client.findUser(message, args[0])
        if(rawuser[0] == false) return message.channel.send(`${client.config.emojis.x}${rawuser[1]}`)
        const member = rawuser[1]
        lookup(member.user, member)
    }

    function lookup(user, member){
        const embed = client.defaultEmbed()
            .setTitle(`Info on \`${user.tag}\``)
            .setThumbnail(user.avatarURL())
            .addField("Tag", user.tag, true)
            .addField("ID", user.id, true)
            .addField("Avatar URL", `[Avatar URL](${user.avatarURL()})`, true)
            .addField("Creation Date", user.createdAt, true)
            .addField("Server Join Date", member.joinedAt, true)
        message.channel.send(embed)
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
    description: "see people's discord info",
    usage: `${filename} [Discord User]`
};
