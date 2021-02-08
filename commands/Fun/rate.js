const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(`Invalid arguments. I can't rate nothing!`)
    const rating = client.randomNumber(0,10)
    let thing = `${args.join(" ")}`
    if(!thing.includes("<@&")){if(thing.includes("<@")) thing = message.guild.members.cache.get(args.join(" ").replace(/\D/g,'')).user.username}
    const embed = new MessageEmbed()
    .setColor(client.embedColour())
    .setDescription(`I give \`${thing}\` a \`${rating}/10\``)
    message.channel.send(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "rate a thing",
    usage: `${filename} <thing>`
};