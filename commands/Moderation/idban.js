const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    let reason = `Banned by ${message.author.tag}`
    if(!args[0]) return message.channel.send(`who am i meant to ban?`)
    if(args[1]) reason = args.slice(1).join(" ");
    message.guild.members.ban(args[0], { reason: reason } )
    const permissionLevel = client.config.permissionLevels.find(l => l.level === level).name;
    const endEXT = `${permissionLevel} ${message.author.tag}`
    const LOGEmbed = new MessageEmbed()
        .setAuthor(`${client.user.username} Moderation Action`,client.user.avatarURL())
        .setFooter(`${client.user.username}`, client.user.avatarURL())
        .setTitle(
      `\`${args[0]}\` has been ID banned from \`${message.guild.name}\``
    )
    .setColor(client.embedColour())
    .setThumbnail(message.guild.iconURL())
    .setTimestamp()
    .setDescription(`Reason: \`${reason}\`\nAdministrator: \`${endEXT}\``);
    const logs = client.getChannel(message.guild, message.settings.logs.value)
    if(logs !== undefined){
        logs.send(LOGEmbed)
    }
    message.channel.send(LOGEmbed)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "ban a user by using their discord ID",
    usage: `${filename}  <id> <reason>`
};
