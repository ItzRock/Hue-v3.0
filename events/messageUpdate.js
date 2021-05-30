module.exports = async (client, oldMessage, message) =>{
    if(message.channel.type == "dm") return;
    const settings = oldMessage.settings;
    if(settings == undefined) return;
    const logs = client.getChannel(message.guild, settings.logs.value);
    if(
        settings == undefined ||
        logs == undefined ||
        message.author.bot || 
        oldMessage.pinned == false && message.pinned == true || 
        oldMessage.pinned == true && message.pinned == false
    ) return;

    const content = {
        old: oldMessage.content || "None",
        new: message.content || "None",
        attachments: oldMessage.attachments.array()
    }

    if(content.old === content.new) return

    const embed = client.defaultEmbed()
        .setTitle("Updated Message.")
        .setThumbnail(message.author.avatarURL({ format: "png", dynamic: true, size: 2048}))
        .addFields(
            { name: 'Original content: ', value: `${content.old.substring(0, 999)}`, inline: true},
            { name: 'Updated content: ', value: `${content.new.substring(0, 999)}`, inline: true},
            { name: 'Message author: ', value: `${message.author}\n(${message.author.tag})`, inline: false  },
            { name: 'Channel: ', value: `${message.channel}`, inline: true},
            { name: "Message Link", value: `[Message Link](${message.url})`, inline: true}
        );
    if(content.attachments.length) {
        content.attachments.forEach((attachment, index) => {
            embed.addField(`Attachment ${index}: `, attachment.proxyURL)
        });
        embed.setImage(content.attachments[0].proxyURL)
    }
    await logs.send(embed).catch(()=>{})
}