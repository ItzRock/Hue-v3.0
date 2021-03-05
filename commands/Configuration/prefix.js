const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(`Invalid Arguments. Usage: \`${client.commands.get(filename).help.usage}\``);
    const settings = message.settings;
    
    const id = args.join(" ")
    const off = ["off", "stop", 'none']
    if(off.includes(args[0].toLowerCase())) {
        client.enmap.edit(message, client.config.defaultSettings.prefix.value, "prefix")
        return message.channel.send(`The prefix is now \`${id}\`.`);
    } else {
        client.enmap.edit(message, id, "prefix")
        message.channel.send(`The prefix is now \`${id}\``);
    }
    
    
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator",
    disablable: false,
    premium: false
};
  
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Modify the prefix to how you like it",
    usage: "prefix <new prefix>"
};