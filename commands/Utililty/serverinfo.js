const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const guild = message.guild
    const embed = client.defaultEmbed()
        .setTitle(`Info on \`${guild.name}\``)
        .setThumbnail(guild.iconURL())
        .addField("Owner", guild.owner, true)
        .addField("ID", guild.id, true)
        .addField("Icon URL", `[Icon URL](${guild.iconURL()})`, true)
        .addField("Server Region", guild.region, true)
        .addField("Server Creation Date", guild.createdAt, true)
        .addField("Members", guild.memberCount, true)
message.channel.send(embed)
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
    description: "View kewl things about the server",
    usage: `${filename}`
};
