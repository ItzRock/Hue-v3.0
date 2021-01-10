module.exports = (client, guild) => {
    if (!guild.available) return; // if the server is having an outage like a loser
   
   client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
   if (client.settings.has(guild.id)) {
     client.settings.delete(guild.id);
   }
   const owner = client.users.cache.get(guild.ownerID)
   var adminCount = 0
    guild.members.cache.forEach(member => {
        if(client.config.AuthorizedUsers.includes(member.user.id)) {
            adminCount++  
        }
        return;
    });
   const embed = {
    "title": "event: `guildDelete`",
    "description": `${client.user.username} has **left** a server.`,
    "timestamp": new Date(),
    "color": client.embedColour(),
    "footer": {
      "text": `${client.user.username} Statistics Logs`
    },
    "thumbnail": {
      "url": guild.iconURL()
    },
    "author": {
      "name": `${client.user.username} Statistics Logs`,
      "icon_url": client.user.avatarURL()
    },
    "fields": [
      {
        "name": "Guild Name",
        "value": `\`${guild.name}\``,
        "inline": true
      },
      {
        "name": "User Count",
        "value": `\`${guild.memberCount}\``,
        "inline": true
      },
      {
        "name": `${client.user.username} Administrators`,
        "value": `\`${adminCount}\``,
        "inline": true
      },
      {
        "name": "Guild Owner",
        "value": `\`${owner.tag} (${guild.ownerID})\``,
        "inline": true
      },
      {
        "name": "Guild ID",
        "value": `\`${guild.id}\``,
        "inline": true
      }
    ]
  };
  client.channels.fetch(client.config.logChannel).then((channel) => {channel.send({embed});});
 };