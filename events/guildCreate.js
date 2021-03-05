module.exports = (client, guild) => {
    const owner = client.users.cache.get(guild.ownerID)
    client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${owner.tag} (${guild.ownerID})`);
    var adminCount = 0
    guild.members.cache.forEach(member => {
        if(client.config.AuthorizedUsers.includes(member.user.id)) {
            adminCount++  
        }
        return;
    });
    const embed = {
      "title": "event: `guildCreate`",
      "description": `${client.user.username} has **joined** another server!`,
      "timestamp": new Date(),
      "color": client.embedColour("safe"),
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