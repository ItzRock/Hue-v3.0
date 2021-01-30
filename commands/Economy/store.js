const { MessageEmbed } = require('discord.js');
const { titleCase } = require("title-case");
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const items = await client.items.readAll()
    const lines = ["Some people call this junk. Me? I call it treasure.", "Take a look.", "Remember… I’ll give you the best deals or die trying", "Here's what I can spare.", "See for yourself", "Everything I've got on display, really.", "Just what you see here.", "Trinkets, odds and ends, that sort of thing.", "Oh, a bit of this and a bit of that."]
    const line = lines[Math.round(client.randomNumber(0, lines.length -1))]
    const embed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setFooter(client.user.username, client.user.avatarURL())
        .setColor(client.embedColour("safe"))
        .setTimestamp()
        .setThumbnail(client.user.avatarURL())
        .setTitle(`${client.user.username} Store`)
        .setDescription(line)
    items.forEach(item =>{
        if(item.Available == false) return
        const newname = titleCase(item.Name)
        embed.addFields(
            { name: `**${newname}**`, value: `Description:\n\`${item.Description}\`\nPrice:\`$${item.Price}\``, inline: true },
        )
    });
    if(!args[0]){
    return message.channel.send(embed)
    }else if(args[0] == "add"){
        if(level !== 5) return message.channel.send("Missing Permissions.");

    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["shop"],
    permLevel: "User",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "good ol' hue store",
    usage: `${filename}`
};
