const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if (!args[0]) return message.channel.send(client.invalidArgs(filename));
    try {
        const logs = client.getChannel(message.guild, message.settings.logs.value);
        const mutedRole = client.getRole(message.guild, message.settings.mutedrole.value)
        if (mutedRole == undefined) return message.channel.send(`${client.config.emojis.x} Error: cannot find muted role. Please fix this in the config`)
        
        const userSearch = client.findUser(message, args[0])
        if (userSearch[0] == false) return message.channel.send(`${userSearch[1]}`)

        const member = userSearch[1]
        const responseStates = {Return: "return", Pass: "pass"}
        const determineReturnResponse = {
            [member.user.id === message.guild.owner.id ? responseStates.Return : responseStates.Pass]: `${client.config.emojis.x} You cannot ${filename} the owner!`,
            [member.user.id === client.user.id ? responseStates.Return : responseStates.Pass]: `${client.config.emojis.x} I will kill you if i am muted`,
            [member.user.id === message.author.id ? responseStates.Return : responseStates.Pass]: `${client.config.emojis.x} I don't think you want to ${filename} yourself`,
            [(member.roles.highest.position > message.member.roles.highest.position && message.author.id !== message.guild.ownerID) ? responseStates.Return : responseStates.Pass]: `${client.config.emojis.x} You can't ${filename} people with a higher role than yourself!`,
            [member.roles.highest.position > message.guild.me.roles.highest.position ? responseStates.Return : responseStates.Pass]: `${client.config.emojis.x} I can't ${filename} people with a higher role than myself!`,
        }; for (var state in determineReturnResponse) {
            var returnResponse = determineReturnResponse[state];
            if (state === responseStates.Return) return message.channel.send(returnResponse);
        }
        
        const MutedRole = member.roles.cache.has(mutedRole.id)
        const permissionLevel = client.config.permissionLevels.find(l => l.level === level).name;
        const endEXT = `${permissionLevel} ${message.author.tag}`

        if (MutedRole == false) return message.channel.send(`${client.config.emojis.exclamation} This user is not muted.`)
        client.modFunc.unmute(message, member, mutedRole, `Manually unmuted by Administrator: \`${endEXT}\``)
        message.channel.send(`\`${member.user.tag}\` Has been unmuted`);
        
    } catch(error) {message.channel.send(client.errorEmbed(error))}
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
