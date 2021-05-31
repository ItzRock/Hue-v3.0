const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0] || !args[1]) return message.channel.send(client.invalidArgs(filename))
    try{
        const logs = client.getChannel(message.guild, message.settings.logs.value);
        const userSearch = client.findUser(message, args[0])
        if(userSearch[0] == false) return message.channel.send(`${userSearch[1]}`)

        const member = userSearch[1]
        if (member.user.id === message.guild.owner.id) 
            return message.channel.send(`${client.config.emojis.x} You cannot ${filename} the owner!`)
        if (member.user.id === client.user.id)
            return message.channel.send(`${client.config.emojis.x} I'd prefer you don't ${filename} me`)
        if (member.user.id === message.author.id)
            return message.channel.send(`${client.config.emojis.x} I don't think you want to ${filename} yourself`)
        if (member.roles.highest.position > message.member.roles.highest.position && message.author.id !== message.guild.ownerID)
            return message.channel.send(`${client.config.emojis.x} You can't ${filename} people with a higher role than yourself!`);

        let reason = args.slice(1).join(" ");
        const permissionLevel = client.config.permissionLevels.find(l => l.level === level).name;
        const endEXT = `${permissionLevel} ${message.author.tag}`
        const caseID = await client.cases.addCase(message.guild, member.user.id, reason, "WARN", message.author.tag)
        const loggedEmbed = client.defaultEmbed()
            .setAuthor(`${client.user.username} Moderation Action`, client.user.avatarURL())
            .setThumbnail(member.user.avatarURL())
            .setTitle(`\`${member.user.tag}\` has been ${filename}ed`)
            .setDescription(`Reason: \`${reason}\`\nAdministrator: \`${endEXT}\``)
            .setFooter(`Case ID: ${caseID}`, client.user.avatarURL())
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
    description: "Warn Users for doing stupid things",
    usage: `${filename} <user> <reason>`
};
