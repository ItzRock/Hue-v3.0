const { MessageEmbed } = require('discord.js');
const noblox = require('noblox.js')
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    
    if(!args[0] || !args[1]) return message.channel.send(`Invalid arguments. Usage: ${client.getArgs(filename)}`)

    if(settings.verifiedRole.value == undefined) return message.channel.send(`Error: cannot find verified role. Please fix this in the config`)
    let verifiedRole
    const roleValue = settings.verifiedRole.value.replace("<#", "").replace(">", "")
    // Find verified role
    if(roleValue.match(/^[0-9]+$/) != null){
        // Contains Numbers
        verifiedRole = guild.roles.cache.get(roleValue)
    }else{
        // Is a String
        verifiedRole = guild.roles.cache.find(role => role.name === roleValue)
    }
    if(verifiedRole == undefined) return message.channel.send(`Error: cannot find verified role. Please fix this in the config`)

    // Find unverified role
    let umverifiedRole
    if(settings.unverifiedRole.value !== undefined){
        const unverifiedroleValue = settings.unverifiedRole.value.replace("<#", "").replace(">", "")
        // Find unverified role
        if(unverifiedroleValue.match(/^[0-9]+$/) != null){
            // Contains Numbers
            umverifiedRole = guild.roles.cache.get(unverifiedroleValue)
        }else{
            // Is a String
            umverifiedRole = guild.roles.cache.find((role) => role.name === unverifiedroleValue);
        }
    }
    // Get the user
    const userLookup = client.findUser(message, args.join(" "))
    if(userLookup[0] == false) return message.channel.send(userLookup[1]);
    const user = userLookup[1]

    // Checking to make sure they are not already verified
    const count = client.database.verify.count(user.user.id)
    if(count !== 0) return message.channel.send(`This user may already be verified.`);

    // Get data from roblox.
    
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Manually verify's a user.",
    usage: `${filename} <user> <roblox username>`
};
