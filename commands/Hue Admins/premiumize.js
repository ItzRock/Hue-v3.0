const { MessageEmbed } = require('discord.js');
const { valueOf } = require('ffmpeg-static');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const value = message.settings.premium.value
    client.enmap.edit(message, !value, "premium")
    message.channel.send(`Set this server's premium status to \`${!value}\``)
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
    description: "Gives access to servers to use premium commands. (please get anthony's approval first)",
    usage: `${filename}`
};
