const { MessageEmbed } = require('discord.js');
const { getUsernameFromId } = require("noblox.js")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    const isVerified = await client.database.verify.count(message.author.id) == 1
    if(isVerified == false) return message.channel.send(`Cannot unlink from our database when you are not in the database.`);
    const rawdata = await client.database.verify.read(message.author.id)
    const data = rawdata[1]
    const name = await getUsernameFromId(data.RobloxID)
    const mesage = `Are you sure to unlink from: \`${name}\` you will lose the guild's verified roles and have to reverify. (respond \`yes\` or \`no\`)`
    const response = await client.awaitReply(message, mesage)

    const verifiedRole = client.getRole(message.guild, message.settings.verifiedRole.value)
    const unverifiedRole = client.getRole(message.guild, message.settings.unverifiedRole.value)
    if(verifiedRole == undefined) return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid verified role.`);
    
    
    if(response == "yes" || response == "y"){
        await client.database.verify.remove(message.author.id)
        message.channel.send(`\`${message.author.tag}\` is nolonger verified as \`${name}\``)
        remRoles()
    } else { return message.channel.send(`Action cancelled`)}
    function remRoles(){
        message.member.roles.remove(verifiedRole);
        try {
            if(unverifiedRole !== undefined || message.member.roles.get(unverifiedRole.id)) message.member.roles.add(unverifiedRole);
        } catch (error) {} 
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["unverify"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Unlinks you from your roblox account",
    usage: `${filename}`
};
