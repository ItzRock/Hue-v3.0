const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const embed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .setColor(client.embedColour())
        .setTimestamp()
        .setThumbnail(client.user.avatarURL())
        .setTitle(`Your Hue Inventory`)
    const data = await client.Inventory.fetch(message.author.id)
    if(data.length == 0){
        embed.addFields(
            { name: `**Looks like you have none**`, value: `Go find some items to buy with ${message.settings.prefix.value}buy`, inline: true },
        )
        return message.channel.send(embed)
    }
    const items = await client.items.readAll()
    data.forEach(rawitem => {
        const item = items.find(i => i.Name == rawitem.ItemName)
        embed.addFields(
            { name: `**${item.Name}**`, value: `${item.Description}`, inline: true },
        )
    });
    return message.channel.send(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["inv", "items"],
    permLevel: "User",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "View your purchased items through the store command",
    usage: `${filename}`
};
