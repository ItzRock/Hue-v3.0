const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0] || !args[1]) return message.channel.send(`Invalid arguments. Expected: \`${message.settings.prefix.value}${client.getArgs(filename)}\``)
    if(client.config.AuthorizedUsers.includes(args[0]))
    let target = client.users.cache.get(args[0])
    const reason = args.slice(1).join(" ");
    if(target == undefined){    // Do a unknowned ban

    }
    else{

    }
    
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Hue Administrator",
    disablable: false,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Globally bans user from all Hue servers.",
    usage: `${filename} <userID> <reason>`
};
