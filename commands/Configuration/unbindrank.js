const { MessageEmbed } = require('discord.js');
const noblox = require("noblox.js");
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(`${client.config.emojis.x} Invalid Arguments: \`${client.getArgs(filename)}\``);
    const binds = message.settings["binds"].value
    const newBinds = []
    args[0] = parseInt(args[0])

    const discord_search = args[0].length > 3

    binds.forEach(rankSearch =>{ 
        if(discord_search == true){
            if(rankSearch.discord !== args[0]) newBinds.push(rankSearch)
        } else {
            if(rankSearch.rblx !== args[0]) newBinds.push(rankSearch)
        }
    })

    try {
        client.enmap.edit(message, newBinds, "binds")
        return message.channel.send(`${client.config.emojis.check} Successfully unbound \`${args[0]}\``)
    } catch (error) {
        console.log(error);
        return message.channel.send(`${error.name} : ${error.message}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["unbindrole", "unbind"],
    permLevel: "Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "unbinds a rank from discord role",
    usage: `${filename} <Rank POS ID RBLX / Discord Role ID>`
};
