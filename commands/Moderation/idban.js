const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    let reason = `Banned by ${message.author.tag}`
    if(!args[0]) return message.channel.send(`who am i meant to ban?`)
    if(args[1]) reason = 
    message.guild.members.ban(args[0], { reason: " loser" } )
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "ban a user by using their discord ID",
    usage: `${filename}  <id> <reason>`
};
