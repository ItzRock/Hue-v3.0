const { version } = require("discord.js");
const moment = require("moment");
const MessageEmbed = require("discord.js").MessageEmbed
require("moment-duration-format");

exports.run = (client, message, args, level) => {
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  let statisticsEmbed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle(`Statistics - ${client.user.username}`)
    .setDescription('Statistics displayed: ``Mem``, ``Uptime``, ``Users``, ``Servers``, ``Channels``, ``Discord.js``, ``Node``')
    .addFields(
      { name: `• Mem Usage`, value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
      { name: `• Uptime`, value: `${duration}`, inline: true },
      { name: `• Users`, value: `${client.users.cache.size.toLocaleString()}`, inline: true },
      { name: `• Servers`, value: `${client.guilds.cache.size.toLocaleString()}`, inline: true },
      { name: `• Channels`, value: `${client.channels.cache.size.toLocaleString()}`, inline: true },
      { name: `• Discord.js`, value: `v${version}`, inline: true },
      { name: `• Node`, value: `${process.version}`, inline: true }
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
  category: __dirname.split("\\")[__dirname.split("\\").length - 1],
  description: "Gives some useful bot statistics",
  usage: "stats"
};
