exports.run = async (client, message, args, level) => { 
    await message.reply("Bot is shutting down.");
    client.activeStatus =`rebooting. wait for status change before using commands`
    await client.user.setActivity(client.activeStatus, {type: "PLAYING"});
    process.exit(0);
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["shutdown"],
    permLevel: "Hue Administrator",
    disablable: false,
    premium: false
  }
  
  exports.help = {
    name: "reboot",
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Shuts down the bot. If running under PM2, bot will restart automatically.",
    usage: "reboot"
  };