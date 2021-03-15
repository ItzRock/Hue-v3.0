const { MessageEmbed } = require('discord.js');
const os = require("os")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+""+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}


    const hueUsed = formatBytes(process.memoryUsage().heapUsed)
    const total = formatBytes(os.totalmem())
    const usage = formatBytes(os.totalmem() - os.freemem())
    const percentage = Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)

    const embed = client.defaultEmbed()
        .setTitle("Hue Memory Stats")
        .addFields(
            {name:"Memory Installed", value: `\`${total}\``, inline: true},
            {name:"Memory Usage", value: `\`${usage}/${total} (${percentage}%)\``, inline: true},
            {name:"Hue Used Memory", value: `\`${hueUsed}\``, inline: true},
        )
    message.channel.send(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Hue Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "",
    usage: `${filename}`
};
