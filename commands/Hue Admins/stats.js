const { version } = require("discord.js");
const moment = require("moment");
const MessageEmbed = require("discord.js").MessageEmbed
const os = require("os")
require("moment-duration-format");

exports.run = async (client, message, args, level) => {
  function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+""+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}

  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  const hueUsed = formatBytes(process.memoryUsage().heapUsed)
  const total = formatBytes(os.totalmem())
  const usage = formatBytes(os.totalmem() - os.freemem())
  const percentage = Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
  let statisticsEmbed = new MessageEmbed()
    .setColor(client.embedColour("safe"))
    .setTitle(`${client.user.username} Statistics`)
    .addFields(
      { name: `Users Cached`, value: `${client.users.cache.size.toLocaleString()}`, inline: true },
      { name: `Users Verified`, value: `${await client.database.verify.countALL()}`, inline: true },
      { name: `${client.user.username} Uptime`, value: `${duration}`, inline: true },    
      { name: `Servers Cached`, value: `${client.guilds.cache.size.toLocaleString()}`, inline: true },
      { name: `Discord.js Version`, value: `v${version}`, inline: true },
      { name: `Node Version`, value: `${process.version}`, inline: true },
      { name: `System Memory Usage`, value: `${usage}/${total} (${percentage}%)\n${client.user.username} Usage: ${hueUsed}`, inline: true },
      { name: `System OS`, value: `${process.platform}`, inline: true }
    )
    .setTimestamp()
    .setFooter('Statistics updated at', client.user.avatarURL())
    .setAuthor(client.user.username, client.user.avatarURL());
  message.channel.send(statisticsEmbed);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Hue Administrator",
  disablable: false,
  premium: false
};

exports.help = {
  name: "stats",
  category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
  description: "Gives some useful bot statistics",
  usage: "stats"
};
