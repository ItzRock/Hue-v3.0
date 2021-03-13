const { version } = require("discord.js");
const moment = require("moment");
const MessageEmbed = require("discord.js").MessageEmbed
require("moment-duration-format");

exports.run = async (client, message, args, level) => {
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  const usage = Math.round(((require('os').totalmem() - require('os').freemem()) / 1024 / 1024).toFixed(2))
  const total = Math.floor((require("os").totalmem() / 1024 / 1024).toFixed(2));
  let statisticsEmbed = new MessageEmbed()
    .setColor(client.embedColour("safe"))
    .setTitle(`${client.user.username} Statistics`)
    .addFields(
      { name: `Users Cached`, value: `${client.users.cache.size.toLocaleString()}`, inline: true },
      { name: `Users Verified`, value: `${await client.database.verify.countALL()}`, inline: true },
      { name: `System Memory Usage`, value: `${usage}/${total} MB (${Math.floor((usage / total)*100)}%)\n${client.user.username} Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, inline: true },
      { name: `${client.user.username} Uptime`, value: `${duration}`, inline: true },    
      { name: `Servers Cached`, value: `${client.guilds.cache.size.toLocaleString()}`, inline: true },
      { name: `Channels Cached`, value: `${client.channels.cache.size.toLocaleString()}`, inline: true },
      { name: `Discord.js Version`, value: `v${version}`, inline: true },
      { name: `Node Version`, value: `${process.version}`, inline: true },
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
