const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    
    if(!args[0]) return message.channel.send(`Invalid arguments. Usage: ${client.getArgs(filename)}`)
    const guild = message.guild;
    let verifiedRole
    try{
        const roleValue = settings.verifiedRole.value
          .replace("<#", "")
          .replace(">", "");
        // Find verified role
        
    if(roleValue.match(/^[0-9]+$/) != null){
        // Contains Numbers
        verifiedRole = guild.roles.cache.get(roleValue)
    }else{
        // Is a String
        verifiedRole = guild.roles.cache.find(role => role.name === roleValue)
    }
    }catch(Err){}
    // Find unverified role
    let unverifiedRole
    try {
        if(settings.unverifiedRole.value !== undefined || settings.unverifiedRole.value != false){
            const unverifiedroleValue = settings.unverifiedRole.value.replace("<#", "").replace(">", "")
            // Find unverified role
            if(unverifiedroleValue.match(/^[0-9]+$/) != null){
                // Contains Numbers
                unverifiedRole = guild.roles.cache.get(unverifiedroleValue)
            }else{
                // Is a String
                unverifiedRole = guild.roles.cache.find((role) => role.name === unverifiedroleValue);
            }
        }   
    } catch (error) {
    }


    const userLookup = client.findUser(message, args.join(" "))
    if(userLookup[0] == false) return message.channel.send(userLookup[1]);
    const user = userLookup[1]
    const results = await client.database.verify.remove(user.user.id);
    if(results[0] == true) {
        try {
            if(unverifiedRole !== undefined) user.roles.add(unverifiedRole);
        } catch (error) {
            message.channel.send(`An error has occured and the role was not removed. ${error.name}: ${error.message}`)
        }
        try {
            user.roles.remove(verifiedRole)
        } catch (error) {
            message.channel.send(`An error has occured and the role was not added. ${error.name}: ${error.message}`)
        }
        return message.channel.send(`Successfully removed \`${user.user.username}\` from our database.`)
    }
    else client.logger.error(results[1])
    return message.channel.send(`An error has occured. ${results[1]}`)

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
    description: "removes a user from the database.",
    usage: `${filename} <user>`
};
