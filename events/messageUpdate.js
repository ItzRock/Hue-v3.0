const { MessageEmbed } = require('discord.js');


module.exports = async (client, oldMessage, newMessage) => {
    if(oldMessage.channel.type === "dm") return
    if (newMessage.author.bot || oldMessage.author.bot) return
    oldMessage.channel.messages.fetch({ limit: 1 }).then(messages => {
        const settings = oldMessage.settings;
        if(settings.logs.value === undefined) return// no logs
        const logs = client.getChannel(oldMessage.guild, oldMessage.settings.logs.value);
        if(logs === undefined) return // Logs is not set up correctly

        const attachmentArray = oldMessage.attachments.array()
        var oldMessageContent = `*None*`
        var newMessageContent = `*None*`

        if (oldMessage.content) {
            oldMessageContent = oldMessage.content
        } if (newMessage.content) {
            newMessageContent = newMessage.content
        }

        if (newMessageContent === oldMessageContent && newMessageContent !== `*None*`) {
            return
        }
        let embed = new MessageEmbed()
            .setColor(client.embedColour())
            .setTimestamp()
            .setFooter(client.user.username, client.user.avatarURL())
            .setTitle(`Message updated!`)
            .setAuthor(`${client.user.username}`, client.user.avatarURL())
            .addFields(
                { name: 'Original content: ', value: `${oldMessageContent}`, inline: true},
                { name: 'Updated content: ', value: `[${newMessageContent}](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`, inline: true},
                { name: 'Message author: ', value: `${newMessage.author}`,},
                { name: 'Channel: ', value: `${newMessage.channel}`,}
            )
        
        if (attachmentArray.length) {
            attachmentArray.forEach((attachment, attachmentNum) => {
                embed.addField(`Attachment ${attachmentNum}: `, attachment.proxyURL)
            });
            embed.setImage(attachmentArray[0].proxyURL)
        }
        logs.send(embed)
    })
}