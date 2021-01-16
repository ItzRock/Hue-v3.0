const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    
    if(!args[0]) return message.channel.send(`Invalid arguments. Usage: ${client.getArgs(filename)}`)
    
    const userLookup = client.findUser(message, args.join(" "))
    if(userLookup[0] == false) return message.channel.send(userLookup[1]);
    const user = userLookup[1]
    const results = await client.database.verify.remove(user.user.id);
    if(results[0] == true) return message.channel.send(`Successfully removed \`${user.user.username}\` from our database.`)
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
