const { MessageEmbed } = require('discord.js');
const { getUsernameFromId } = require("noblox.js")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`${client.config.emojis.exclamation} This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    const verifiedRole = client.getRole(message.guild, message.settings.verifiedRole.value)
    const unverifiedRole = client.getRole(message.guild, message.settings.unverifiedRole.value)
    if(verifiedRole == undefined) return message.channel.send(`${client.config.emojis.x} The guild's configuration hasn't been properly set up. please set a valid verified role.`);


    if(!args[0]){
        const isVerified = await client.database.verify.count(message.author.id) == 1
        if(isVerified == false) return message.channel.send(`${client.config.emojis.x} Cannot unlink from our database when you are not in the database.`);
        const rawdata = await client.database.verify.read(message.author.id)
        const data = rawdata[1]
        const name = await getUsernameFromId(data.RobloxID)
        const mesage = `${client.config.emojis.exclamation} Are you sure to unlink from: \`${name}\` you will lose the guild's verified roles and have to reverify. (respond \`yes\` or \`no\`)`
        const response = await client.awaitReply(message, mesage)

        if(response == "yes" || response == "y"){
            remove(message.author, message.member, name);
        } else { return message.channel.send(`${client.config.emojis.check} Action cancelled`)}
    }
    else {
        if(settings.premium.value !== true) return message.channel.send(`${client.config.emojis.x} Unlinking other users is only available for premium guilds`)
        if(level < 2) return message.channel.send(`${client.config.emojis.x} Admin permissions are required to unlink other users.`)
        const rawuser = client.findUser(message, args[0])
        if(rawuser[0] == false) return message.channel.send(`${rawuser[1]}`)
        const member = rawuser[1]
        if(client.config.AuthorizedUsers.includes(member.user.id) && !client.config.AuthorizedUsers.includes(message.author.id)){
            return message.channel.send(`${client.config.emojis.x} You may not change the database information of a Hue Administrator. This will be reported.`)
            // Don't report it just to scare em lmao
        }
        const isVerified = await client.database.verify.count(member.user.id) == 1
        if(isVerified == false) return message.channel.send(`${client.config.emojis.x} User does not have a record to unlink.`);
        const data = await client.database.verify.read(member.user.id)
        const name = data[1].RobloxUsername
        remove(member.user, member, name)
    }
    async function remove(user, member, rblxName){
        await client.database.verify.remove(user.id)
        message.channel.send(`${client.config.emojis.check} \`${user.tag}\` is no longer verified as \`${rblxName}\``)
        remRoles(member)
    }
    function remRoles(member){
        member.roles.cache.forEach(role => {
            if(role.name !== "@everyone"){
                try{ member.roles.remove(role); } catch(err) {}
            }
        })
        member.roles.remove(verifiedRole);
        try {if(unverifiedRole !== undefined || member.roles.get(unverifiedRole.id)) member.roles.add(unverifiedRole);} catch (error) {} 
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
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Unlinks you from your roblox account",
    usage: `${filename} [User (admin perms required)]`
};
