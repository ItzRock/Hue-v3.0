const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const noblox = require("noblox.js")
exports.run = async (client, message, args, level) => {
    try {
        const binds = message.settings["binds"].value
        let msg = ""
        for(i = 0; i < binds.length; i++ ){
            const bind = binds[i]
            const rblxRoleInfo = await noblox.getRole(message.settings.groupID.value.toString(), parseInt(bind.rblx))
            const rblxRole  = `${rblxRoleInfo.name} (${bind.rblx})`
            const discordRoleMSG = `${(client.getRole(message.guild, bind.discord)).name} (${bind.discord})`
            msg = `${msg}\n Roblox \`${rblxRole}\` is bounded to Discord \`${discordRoleMSG}\``
        }
        if(msg == "") msg = "There are no binds for this guild."
        const embed = client.defaultEmbed()
            .setTitle(`Bounded Ranks for ${message.guild.name}`)
            .setDescription(msg)
        message.channel.send(embed)
    } catch (error) {
        console.log(error);
        return message.channel.send(`${error.name} : ${error.message}`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["binds"],
    permLevel: "Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "View role bindings for the current guild.",
    usage: `${filename}`
};
