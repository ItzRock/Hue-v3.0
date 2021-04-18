const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    return message.channel.send(`DISABLE FOR SHORT PERIOD TO REDO!`)
    if(!args[0] || !args[1] || !args[2]) return message.channel.send(client.invalidArgs(filename))
    try{
        const logs = client.getChannel(message.guild, message.settings.logs.value);
        const mutedRole = client.getRole(message.guild, message.settings.mutedrole.value)
        try{client.timeParser(args[1])} catch(error){ return message.channel.send(`${client.config.emojis.exclamation} Error! \`${error.message}\``) }
        const time = client.timeParser(args[1])
        if(mutedRole == undefined) return message.channel.send(`${client.config.emojis.x} Error: cannot find muted role. Please fix this in the config`)
        
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
            return message.channel.send(`${client.config.emojis.x} You can't ${filename} people higher role than yourself!`);

        let reason = args.slice(2).join(" ");

        const muted = message.settings.mutedUsers.value
        let MutedRole = member.roles.cache.has(mutedRole.id)
        
        if(MutedRole == true) return message.channel.send(`${client.config.emojis.exclamation} This user is already ${filename}d.`)
        muted.forEach(async record => {
            if(record.id == member.user.id){
                client.HueMap.removeObject(message.guild.id, "mutedUsers", record)
            }
        })

        const permissionLevel = client.config.permissionLevels.find(l => l.level === level).name;
        const endEXT = `${permissionLevel} ${message.author.tag}`
        if(!reason) reason = `No Reason Provided`
        const LOGEmbed = client.defaultEmbed()
            .setAuthor(`${client.user.username} Moderation Action`, client.user.avatarURL())
            .setFooter(`${client.user.username}`, client.user.avatarURL())
            .setTitle(`\`${member.user.tag}\` has been ${filename}d`)
            .setColor(client.embedColour())
            .setThumbnail(member.user.avatarURL())
            .setDescription(`Reason: \`${reason}\`\nAdministrator: \`${endEXT}\``);
        if(logs !== undefined) logs.send(LOGEmbed)
        message.channel.send(LOGEmbed)    

        // I WANT TO CRY, THIS IS THE ONLY WAY IT WILL WORK FOR SOME DAMN REASON.
        serverLog().then(()=>serverLog())

        async function serverLog(){
            await client.HueMap.add(message.guild.id, "mutedUsers",
            { 
                id: member.user.id, 
                roles: member._roles,
            })    
        }
        


        await client.modFunc.mute(message, member, mutedRole)
        const timeout = setTimeout(()=>{
            client.modFunc.unmute(message, member, mutedRole)
            message.channel.send(`\`${member.user.tag}\` Has been automatically unmuted`);
            clearTimeout(timeout)
        }, time)
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
    description: "",
    usage: `${filename} <user> <time> <reason>`
};
