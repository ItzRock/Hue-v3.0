const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`${client.config.emojis.exclamation} This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    const verifiedRole = client.getRole(message.guild, message.settings.verifiedRole.value)
    if(verifiedRole == undefined) return message.channel.send(`${client.config.emojis.x} This guild's configuration hasn't been properly set up. please set a valid verified role.`);

    if(!args[0]){
        update(message.member);
    } else {
        if(level < 2) return message.channel.send(`${client.config.emojis.x} Updating users can only be done as a guild administrator.`)
        const rawuser = client.findUser(message, args[0])
        if(rawuser[0] == false) return message.channel.send(`${rawuser[1]}`)
        
        const user = rawuser[1]
        update(user);
    }

    async function update(member){
        if(member.user.id == member.guild.ownerID) return message.channel.send(`${client.config.emojis.x} Cannot update the server owner`)
        const DBData = await client.database.verify.read(member.user.id)
        if(DBData[0] == false) return message.channel.send(`${client.config.emojis.exclamation}${DBData[1]}`)
        const dbInfo = DBData[1];
        setNick(member, dbInfo.RobloxUsername);
    }
    async function setNick(member, nick){
        try {
            await member.setNickname(nick)
            message.channel.send(`${client.config.emojis.check} Successfully Updated \`\`${member.user.tag}\`\``)
        } catch (error) {
            return message.channel.send("Error: failed to set nick. (most likely bad perms)")
        }
    }
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
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "",
    usage: `${filename} [User (level 2 required.)]`
};
