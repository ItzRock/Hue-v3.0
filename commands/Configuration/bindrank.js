const { MessageEmbed } = require('discord.js');
const noblox = require("noblox.js");
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[1] || !args[0]) return message.channel.send(`${client.config.emojis.x} Invalid Arguments: \`${client.getArgs(filename)}\``);
    if(message.settings.groupID.value == false || message.settings.groupID.value == undefined) return message.channel.send(`${client.config.emojis.x} The config value: \`groupID\` needs to have a value.`)
    if(client.isNumeric(args[0]) == false || args[0].length > 3 || parseInt(args[0]) > 255) return message.channel.send(`${client.config.emojis.x} Error: Roblox Rank should be the position num in the hierarchy see this for example `, {files: ["https://cdn.itzrock.xyz/hue/rankpos.png"]});
    if(client.isNumeric(args[1]) == false || client.getRole(message.guild, args[1]) == undefined) return message.channel.send(`${client.config.emojis.x} Error: For the Discord Role please use an ID as names are not supported\nTo get a role ID, click on a user to open a user pop out, right click on a role and click copy id.`, {files: ["https://cdn.itzrock.xyz/hue/discordROLEid.png"]});

    
    const rank = {
        rblx: parseInt(args[0]),
        discord: args[1]
    }
    try {
        const rblxRoleInfo = await noblox.getRole(message.settings.groupID.value, parseInt(rank.rblx))
        const rblxRole  = `${rblxRoleInfo.name} (${rank.rblx})`
        const discordRole = `${(client.getRole(message.guild, args[1])).name} (${rank.discord})`
        
        const boundRanks = message.settings["binds"].value
        var found = false;
        for(var i = 0; i < boundRanks.length; i++) {
            if (boundRanks[i].discord == rank.discord) {
                found = true;
                break;
            }
        }
        if(found == true) return message.channel.send(client.config.emojis.x +" This rank is already bounded to this role.")
        
        client.enmap.add(message, rank, "binds")
        return message.channel.send(`${client.config.emojis.check} Successfully bound \`${rblxRole}\` to \`${discordRole}\``)
    } catch (error) {
        console.log(error);
        return message.channel.send(`${error.name} : ${error.message}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["bindrole", "bind"],
    permLevel: "Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "binds a rank to a discord role",
    usage: `${filename} <Rank POS ID RBLX> <Role ID DISCORD>`
};
