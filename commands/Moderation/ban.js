const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) {
        return message.channel.send(`No user provided. Usage: \`${client.commands.get(`${filename}`).help.usage}\``);
    };
    const guild = message.guild
    // Logs
    let logsValue
    try {
        logsValue = message.settings.logs.value.replace("<#", "").replace(">", "")
    } catch (error) {
        // doesnt exist in key
    }
    let logs
    if(logsValue !== undefined){
    if(logsValue.match(/^[0-9]+$/) != null){
        // Contains Numbers
        logs = client.channels.cache.get(logsValue)
    }else{
        // Is a String
        logs = guild.channels.cache.find(channel => channel.name === logsValue)
    }}
    const user = client.findUser(message, args[0])
    if(user[0] == false) return message.channel.send(`${user[1]}`)
    if (user[1].user.id === message.guild.owner.id) {
        return message.channel.send(`You cannot ${filename} the owner!`)
    };
    if (user[1].user.id === client.user.id) {
        return message.channel.send(`I'd prefer you don't ${filename} me`)
    };
    if (user[1].user.id === message.author.id) {
        return message.channel.send(`I don't think you want to ${filename} yourself`)
    };
    if (user[1].roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID) {
        return message.channel.send(`You can't ${filename} people higher role than yourself!`);
    };
    let reason = args.slice(1).join(" ");
    const permissionLevel = client.config.permissionLevels.find(l => l.level === level).name;
    const endEXT = `${permissionLevel} ${message.author.tag}`
    if(!reason) reason = `No Reason Provided`
    const LOGreason = `${reason} -- ${endEXT}`

    const DM = new MessageEmbed()
        .setAuthor(`${client.user.username} Moderation Action`, client.user.avatarURL())
        .setFooter(`${client.user.username}`, client.user.avatarURL())
        .setTitle(`You have been ${filename}ned from \`${message.guild.name}\``)
        .setColor(client.embedColour())
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        .setDescription(`Reason: \`${reason}\`\nAdministrator: \`${endEXT}\``)
    const LOGEmbed = new MessageEmbed()
      .setAuthor(
        `${client.user.username} Moderation Action`,
        client.user.avatarURL()
      )
      .setFooter(`${client.user.username}`, client.user.avatarURL())
      .setTitle(
        `\`${user[1].user.tag}\` has been ${filename}ned from \`${message.guild.name}\``
      )
      .setColor(client.embedColour())
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setDescription(`Reason: \`${reason}\`\nAdministrator: \`${endEXT}\``);
    try {
        await user[1].send(DM)   
    } catch (error) {
    // dms closed
    }
    message.channel.send(LOGEmbed)
    user[1].ban({reason : LOGreason})
    if(logs !== undefined){
        logs.send(LOGEmbed)
    }
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
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Ban a user from a guild",
    usage: `${filename} <User> [Reason]`
};
