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
    // Muted Role
    if(message.settings.mutedrole.value == undefined) return message.channel.send(`Error: cannot find muted role. Please fix this in the config`)
    const mutedRoleValue = message.settings.mutedrole.value.replace("<@&", "").replace(">", "")
    let mutedRole
    if(mutedRoleValue.match(/^[0-9]+$/) != null){
        // Contains Numbers
        mutedRole = guild.roles.cache.get(mutedRoleValue)
    }else{
        // Is a String
        mutedRole = guild.roles.cache.find(role => role.name === mutedRoleValue)
    }
    if(mutedRole == undefined) return message.channel.send(`Error: cannot find muted role. Please fix this in the config`)

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

    const muted = Object.values(message.settings.mutedUsers.value);

    let bool
    muted.forEach(mutedUser =>{
        if(mutedUser.member.userID == user[1].user.id) bool = true; else bool = false
    });
    if(bool == true) return message.channel.send(`This user is already ${filename}d. If this is incorrect try \`${message.settings.prefix.value}unmute\``)
    const permissionLevel = client.config.permissionLevels.find(l => l.level === level).name;
    const endEXT = `${permissionLevel} ${message.author.tag}`
    if(!reason) reason = `No Reason Provided`
    const LOGEmbed = new MessageEmbed()
        .setAuthor(`${client.user.username} Moderation Action`, client.user.avatarURL())
        .setFooter(`${client.user.username}`, client.user.avatarURL())
        .setTitle(`\`${user[1].user.tag}\` has been ${filename}d`)
        .setColor(client.embedColour())
        .setThumbnail(user[1].user.avatarURL())
        .setTimestamp()
        .setDescription(`Reason: \`${reason}\`\nAdministrator: \`${endEXT}\``);
    if(logs !== undefined) logs.send(LOGEmbed)
    message.channel.send(LOGEmbed)
    /*
        Insert Muting scripts here
    */
    client.enmap.add(message, { member: { id: user[1].user.id }, OLDroles: user[1]._roles }, "mutedUsers")
    user[1].roles.cache.forEach(role => {
        if(role.name == "@everyone") return
        user[1].roles.remove(role)
    })
   user[1].roles.add(mutedRole)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: `${filename} a user`,
    usage: `${filename} <user> [reason]`
};
