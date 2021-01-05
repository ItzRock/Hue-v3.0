module.exports = async (client, message) => {
    // Like said in the index most of this comes from hue 2.0 which comes from a guide bot, this file is just a complete rip from hue 2 which hasnt changed much from the orginial https://github.com/AnIdiotsGuide/guidebot/blob/master/events/message.js

    // if a bot then ignore.
    if (message.author.bot) return;
    const settings = message.settings = client.getSettings(message.guild);
  
    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
      return message.reply(`:wave: my prefix is: \`${settings.prefix}\``);
    }
    // not for us
    if (message.content.indexOf(settings.prefix) !== 0) return;

    // define the arguments
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.members.fetch(message.author);
  
    // permlevel
    const level = client.permlevel(message);

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;
  

    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send("This command is unavailable in DMs. Please run in a Server.");
  
    if (level < client.levelCache[cmd.conf.permissionLevels]) {
      if (settings.systemNotice === "true") {
        return message.channel.send(`Invalid Permission Level.
    Your permission level is ${level} (${client.config.permissionLevels.find(l => l.level === level).name})
    This command requires level ${client.levelCache[cmd.conf.permissionLevels]} (${cmd.conf.permissionLevels})`);
      } else {
        return;
      }
    }
    message.author.permissionLevels = level;
    
    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }
    client.logger.cmd(`[CMD] ${client.config.permissionLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
    cmd.run(client, message, args, level);
  };