const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[1] | !args[0]) return message.channel.send(`Invalid Arguments: ${client.getArgs(filename)}`)
    client.activeStatus = `${args.slice(1).join(" ")} | Hue v3.1`
            
    client.user.setActivity(client.activeStatus, {type: args[0].toUpperCase()});
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Hue Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "say the funny",
    usage: `${filename} <TYPE> <content>`
};
