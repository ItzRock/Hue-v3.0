const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(client.invalidArgs(filename))
    try{
        const logs = client.getChannel(message.guild, message.settings.logs.value);
        const userSearch = client.findUser(message, args[0])
        if(userSearch[0] == false) return message.channel.send(`${userSearch[1]}`)

        const member = userSearch[1]
        const responseStates = {Return: "return", Pass: "pass"}
        const determineReturnResponse = {
            [member.user.id === message.guild.owner.id ? responseStates.Return : responseStates.Pass]: `${client.config.emojis.x} You cannot ${filename} the owner!`,
            [member.user.id === client.user.id ? responseStates.Return : responseStates.Pass]: `Sleep with one eye open tonight.`,
            [member.user.id === message.author.id ? responseStates.Return : responseStates.Pass]: `${client.config.emojis.x} I don't think you want to ${filename} yourself`,
            [(member.roles.highest.position > message.member.roles.highest.position && message.author.id !== message.guild.ownerID) ? responseStates.Return : responseStates.Pass]: `${client.config.emojis.x} You can't ${filename} people with a higher role than yourself!`,
            [member.roles.highest.position > message.guild.me.roles.highest.position ? responseStates.Return : responseStates.Pass]: `${client.config.emojis.x} I can't ${filename} people with a higher role than myself!`,
            [message.member.bannable]: `${message.x} This user is not ${filename}able`
        }; for (var state in determineReturnResponse) {
            var returnResponse = determineReturnResponse[state];
            if (state === responseStates.Return) return message.channel.send(returnResponse);
        }

        let reason = args.slice(1).join(" ");
        const permissionLevel = client.config.permissionLevels.find(l => l.level === level).name;
        const endEXT = `${permissionLevel} ${message.author.tag}`
        if(!reason) reason = `No Reason Provided`
        const loggedReason = `${reason} -- ${endEXT}`
        const DM = client.defaultEmbed()
            .setAuthor(`${client.user.username} Moderation Action`, client.user.avatarURL())
            .setTitle(`You have been ${filename}ed from \`${message.guild.name}\``)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`Reason: \`${loggedReason}\`\nAdministrator: \`${endEXT}\``);
        const loggedEmbed = client.defaultEmbed()
            .setAuthor(`${client.user.username} Moderation Action`, client.user.avatarURL())
            .setThumbnail(member.user.avatarURL())
            .setTitle(`\`${member.user.tag}\` has been ${filename}ed from \`${message.guild.name}\``)
            .setDescription(`Reason: \`${loggedReason}\`\nAdministrator: \`${endEXT}\``)
        await member.send(DM).catch(/* DMs were closed */)
        await client.modFunc.kick(message,member,reason, message.author.tag).catch(err => {
            return message.reply(`Unable to kick \`${member.user.tag}\` \`${err.message}\` `);
        })
        message.channel.send(loggedEmbed)
        if(logs !== undefined){
            logs.send(loggedEmbed)
        }

    }catch(error){message.channel.send(client.errorEmbed(error))}
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
    description: "Kicks user from guild",
    usage: `${filename} <user> [reason]`
};
