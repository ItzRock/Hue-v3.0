const { MessageEmbed } = require('discord.js');

module.exports = async (client, message) => {
    if(message.author.bot == true) return;
    if(message.channel.type === "dm") return
    const auditLogs = await message.guild.fetchAuditLogs({type: 72});
    let entry = auditLogs.entries.first();
    if(entry !== undefined) if(entry.executor.id == client.user.id) return;
    if(entry.executor === undefined) entry.executor == "not found"

    const settings = message.settings;
    if(settings.logs.value === undefined) return// no logs
    else var logs = message.guild.channels.cache.get(`${settings.logs.value.replace("<#", "").replace(">", "")}`) // 
    if(logs === undefined) logs = message.guild.channels.cache.get(channel => channel.name === settings.logs.value);
    if(logs === undefined) return // Logs is not set up correctly
    
    const attachmentArray = message.attachments.array()

    var messageContent = `*None*`
    if (message.content) {
        messageContent = message.content
    }

    let embed = new MessageEmbed()
        .setColor(client.embedColour())
        .setTimestamp()
        .setFooter(client.user.username, client.user.displayAvatarURL)
        .setTitle(`Message deleted!`)
        .addFields(
            { name: 'Message author: ', value: `${message.author}`, inline: true  },
            { name: 'Action Executor: ', value: `${entry.executor}`, inline: true  },
            { name: 'Deleted content: ', value: `${messageContent}` },
            { name: 'Channel: ', value: `${message.channel}`  },
        )
    if (attachmentArray.length) {
        attachmentArray.forEach((attachment, attachmentNum) => {
            embed.addField(`Attachment ${attachmentNum}: `, attachment.proxyURL)
        });
        embed.setImage(attachmentArray[0].proxyURL)
    }
    logs.send(embed)
}