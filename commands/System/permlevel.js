const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const friendly = client.config.permissionLevels.find(l => l.level === level).name;
    message.reply(`Your permission level is: ${level} - ${friendly}`);
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["mylevel"],
    permLevel: "User",
    disablable: true,
    premium: false
  };
  
  exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Tells you your permission level for the current message location.",
    usage: `${filename}`
  };
  