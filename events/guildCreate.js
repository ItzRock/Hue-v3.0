const { MessageEmbed } = require("discord.js")
module.exports = async (client, guild) => {
    const owner = client.users.cache.get(guild.ownerID)
    client.HueMap.create(guild.id)
    client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${owner.tag} (${guild.ownerID})`);
    let adminCount = 0
    const admins = []

    guild.members.cache.forEach(member => {
        if(client.config.AuthorizedUsers.includes(member.user.id)) {
            adminCount++  
            admins.push(member.user.tag)
        }
        return;
    });
    let permissions = guild.me.permissions.toArray().join(", ")
    if(guild.me.permissions.toArray().includes("ADMINISTRATOR")) permissions = "ADMINISTRATOR"
    if(permissions.length > 150) permissions = permissions.substring(0,140) + "..."
    const guildCreateEmbed = new MessageEmbed()
      .setThumbnail(guild.iconURL({format: "png", size: 2048}))
      .setTitle("`guildCreate` Event has occured.")
      .setDescription(`${client.user.username} has **joined** another guild!`)
      .setColor(client.embedColour("Safe"))
      .setTimestamp()
      .setAuthor(`${client.user.username}`, client.user.avatarURL({format: "png", size: 2048}))
      .setFooter(`${client.user.username}`, client.user.avatarURL({format: "png", size: 2048}))
      .addFields(
        {name: "Guild Name", value: `\`${guild.name}\` (\`${guild.id}\`)`, inline: true},
        {name: "Guild Owner", value: `\`${owner.tag} (${guild.ownerID})\``, inline: true},
        {name: "Guild User Count", value: `\`${guild.memberCount}\``, inline: true},
        
        {name: "Permissions", value: `\`${permissions}\` (\`${guild.id}\`)`, inline: true},
        {name: `${client.user.username} Administrators`, value: `\`${adminCount}, ${admins.join(", ")}\``, inline: true},
      )
    client.channels.cache.get(client.config.logChannel).send(guildCreateEmbed)
  };