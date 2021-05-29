module.exports = async (client, message) =>{
    if(message.channel.type == "dm") return;
    const settings = message.settings;
    if(settings == undefined) return;
    const logs = client.getChannel(message.guild, settings.logs.value);
    if(
        settings == undefined ||
        logs == undefined ||
        message.author.bot
    ) return;

    const content = {
        content: message.content || "None",
        attachments: message.attachments.array()
    }

    const fetchedLogs = (await message.guild.fetchAuditLogs({limit: 1, type: 'MESSAGE_DELETE'})).entries.first()
    if(fetchedLogs.target.id == message.author.id) content.log = fetchedLogs

    if(content.log.executor.bot) return;

    const embed = client.defaultEmbed()
        .setTitle("Deleted Message.")
        .setThumbnail(message.author.avatarURL({ format: "png", dynamic: true, size: 2048}))
        .addFields(
            { name: 'Message author: ', value: `${message.author}\n(${message.author.tag})`, inline: false },
            { name: 'Message Content: ', value: `${content.content.substring(0, 999)}`, inline: true},
            { name: 'Channel: ', value: `${message.channel}`, inline: true},
        );
    if(content.attachments.length) {
        content.attachments.forEach((attachment, index) => {
            embed.addField(`Attachment ${index}: `, attachment.proxyURL)
        });
        embed.setImage(content.attachments[0].proxyURL)
    }
    await logs.send(embed).catch(()=>{})
}