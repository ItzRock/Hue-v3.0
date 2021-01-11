exports.run = async (client, message, args, level) => { 
    await message.reply("Bot is shutting down.");
    await Promise.all(client.commands.map(cmd =>
      client.unloadCommand(cmd)
    ));
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