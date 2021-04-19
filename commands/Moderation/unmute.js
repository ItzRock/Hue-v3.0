const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(client.invalidArgs(filename))
    try{
        const logs = client.getChannel(message.guild, message.settings.logs.value);
        const mutedRole = client.getRole(message.guild, message.settings.mutedrole.value)
        if(mutedRole == undefined) return message.channel.send(`${client.config.emojis.x} Error: cannot find muted role. Please fix this in the config`)
        
        const userSearch = client.findUser(message, args[0])
        if(userSearch[0] == false) return message.channel.send(`${userSearch[1]}`)

        const member = userSearch[1]
        if (member.user.id === message.guild.owner.id) 
            return message.channel.send(`${client.config.emojis.x} I cannot ${filename} the owner!`)
        if (member.user.id === client.user.id)
            return message.channel.send(`${client.config.emojis.x} i will kill you if i am muted`)
        if (member.user.id === message.author.id)
            return message.channel.send(`${client.config.emojis.x} I don't think you want to ${filename} yourself`)
        if (member.roles.highest.position > message.member.roles.highest.position && message.author.id !== message.guild.ownerID)
            return message.channel.send(`${client.config.emojis.x} You can't ${filename} people higher role than yourself!`);
        if (member.roles.highest.position > message.guild.me.roles.highest.position)
            return message.channel.send(`${client.config.emojis.x} I can't ${filename} people with a higher role than myself!`);
        const muted = message.settings.mutedUsers.value
        const MutedRole = member.roles.cache.has(mutedRole.id)
            
        if(MutedRole == false) return message.channel.send(`${client.config.emojis.exclamation} This user is not muted.`)
        client.modFunc.unmute(message, member, mutedRole)
        message.channel.send(`\`${member.user.tag}\` Has been unmuted`);
        
    }catch(error){message.channel.send(client.errorEmbed(error))}
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Moderator",
    level: 5,
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Unmutes a user.",
    usage: `${filename} <User>`
};
