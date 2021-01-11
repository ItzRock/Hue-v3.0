const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(`Invalid Arguments. Usage: \`${client.commands.get(filename).help.usage}\``);
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
    const settings = message.settings;
  
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
    
    const id = args[0].replace("<#", '').replace(">", '')
    const off = ["off", "stop", 'none']
    if(off.includes(args[0].toLowerCase())) {
        client.enmap.edit(message, undefined, "logs")
        return message.channel.send(`Moderation Logs have been disabled.`);
    } else {
        client.enmap.edit(message, id, "logs")
        message.channel.send(`Moderation logs will appear in <#${id}>`);
    }
    
    
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["setLogs", "logChannel"],
    permLevel: "Administrator",
    disablable: false,
    premium: false
};
  
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Change the bot's logs location. make sure you either mention a channel or use the channel id, it might not work correctly if you just use a channel name.",
    usage: "logs <channel mention>"
};