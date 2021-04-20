const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(client.invalidArgs(filename))
    if(client.getChannel(message.guild, args[0]) !== undefined){
        const channel = client.getChannel(message.guild, args[0])
        const toSend = args.slice(1).join(" ")
        channel.send(toSend)
    } else {
        const toSend = args.join(" ")
        message.channel.send(toSend)
    }
    try{
        
    }catch(error){message.channel.send(client.errorEmbed(error))}
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator",
    level: 10,
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Make hue say whatever you want. Premium servers only for administrators to prevent dumbasses.",
    usage: `${filename} [channel] <text>`
};
 