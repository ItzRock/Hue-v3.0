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
        return message.channel.send(`why was i muted in the first place`)
    };
    if (user[1].roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID) {
        return message.channel.send(`You can't ${filename} people higher role than yourself!`);
    };
    let reason = args.slice(1).join(" ");

    const permissionLevel = client.config.permissionLevels.find(l => l.level === level).name;
    const endEXT = `${permissionLevel} ${message.author.tag}`
    if(!reason) reason = `No Reason Provided`
    const LOGEmbed = `\`${user[1].user.username}\` Has been unmuted.`
    if(logs !== undefined) logs.send(LOGEmbed)
    const muted = Object.values(message.settings.mutedUsers.value);
    let bool
    for (let i = 0; i < muted.length; i++) {
        const mutedUser = muted[i];
        if(mutedUser.member.id == user[1].user.id) bool = true; else bool = false
        
    }
    if(bool == false) return message.channel.send(`This user is not muted`)
    message.channel.send(LOGEmbed)
    /*
        Insert Muting scripts here
    */
    let roles
    let mutedUserEntry
    for (let i = 0; i < muted.length; i++) {
        const mutedUser = muted[i];
        if(mutedUser.member.id == user[1].user.id){
            mutedUserEntry = mutedUser
            roles = mutedUser.OLDroles
        }
    }
    roles.forEach(role => {
        try{
            user[1].roles.add(role)
        }catch(err){/* Probably no permissions */}
    })
   user[1].roles.remove(mutedRole)
   client.enmap.remove(message, mutedUserEntry, "mutedUsers")
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
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: `${filename}s a user`,
    usage: `${filename} <user>`
};
