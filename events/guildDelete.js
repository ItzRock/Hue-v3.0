const { MessageEmbed } = require("discord.js")
module.exports = async (client, guild) => {
  if (!guild.available) return; // if the server is having an outage like a loser
 
  client.logger.cmd(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);
  const owner = client.users.cache.get(guild.ownerID)
  const guildCreateEmbed = new MessageEmbed()
    .setThumbnail(guild.iconURL({format: "png", size: 2048}))
    .setTitle("`guildDelete` Event has occured.")
    .setDescription(`${client.user.username} has **left** a guild.`)
    .setColor("RED")
    .setTimestamp()
    .setAuthor(`${client.user.username}`, client.user.avatarURL({format: "png", size: 2048}))
    .setFooter(`${client.user.username}`, client.user.avatarURL({format: "png", size: 2048}))
    .addFields(
      {name: "Guild Name", value: `\`${guild.name}\` (\`${guild.id}\`)`, inline: true},
      {name: "Guild Owner", value: `\`${owner.tag} (${guild.ownerID})\``, inline: true},
      {name: "Guild User Count", value: `\`${guild.memberCount}\``, inline: true},
    )
  client.channels.cache.get(client.config.logChannel).send(guildCreateEmbed)
};