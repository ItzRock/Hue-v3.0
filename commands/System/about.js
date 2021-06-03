/*
    MAKE SURE YOU CHANGE THIS FOR CUSTOM BOTS
*/
const moment = require("moment");
require("moment-duration-format");
const filename = require('path').basename(__filename).split(".")[0]
const { MessageButton } = require("discord-buttons");
function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+""+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}
exports.run = async (client, message, args, level) => {
    try{
        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
        const hueUsed = formatBytes(process.memoryUsage().heapUsed)
        const embed = client.defaultEmbed()
            .setTitle(`About ${client.user.username}`)
            .setDescription(`[Hue (Current Version Hue v3.2)](https://github.com/ItzRock/Hue-v3.0) is based off of a heavily modified version of Hue v2.0 which respectfully was another heavily modified version of [AnIdiotsGuide's GuideBot](https://github.com/AnIdiotsGuide/guidebot) made by anthony and harry.\n`)
            .addFields(
                {name: `${client.user.username} Stats`, value: `**Commands loaded:** \`${client.commands.size}\`
                **Users Verified In Hue DB:** \`${await client.database.verify.countALL()}\`
                **Users Cached:**:\`${client.users.cache.size}\`
                **Servers Cached:** \`${client.guilds.cache.size}\`
                **Memory Usage:** \`${hueUsed}\`
                **Uptime:** \`${duration}\`
                `},
                {name: "Hue Support Server", value: "[Invite Link Here](https://discord.gg/QwgnZ83XD3)", inline: true},
                {name: "Hue Invite Link", value: "[Invite Link Here](https://discord.com/oauth2/authorize?client_id=738044908656656455&scope=bot&permissions=8)", inline: true},
                
            )
        /*const server = new MessageButton()
            .setLabel("Hue Support Server")
            .setStyle("Link")
            .setURL("https://discord.gg/QwgnZ83XD3")
        const invite = new MessageButton()
            .setLabel(`Hue Invite Link`)
            .setStyle("Link")
            .setURL("https://discord.com/oauth2/authorize?client_id=738044908656656455&scope=bot&permissions=8")*/
        message.channel.send({ embed: embed, /*buttons: [server, invite]*/})
    }catch(error){message.channel.send(client.errorEmbed(error))}
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "About the bot",
    usage: `${filename}`
};
