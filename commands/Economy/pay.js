const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0] || !args[1]) return message.channel.send(`Invalid Arguments. Usage: \`${client.commands.get(`${filename}`).help.usage}\``)
    const user = client.findUser(message, args[0])
    if(user[0] == false) return message.channel.send(user[1])
    const info = await client.database.economy.read(message.author.id);
    if(info.Wealth < parseInt(args[1])) return message.channel.send(`Cannot pay somebody more then you have`)
    if(parseInt(args[1]) < 0) return message.channel.send(`Cannot pay less than zero`)
    if(parseInt(args[1]).toString() == "NaN") return message.channel.send(`That is not a number`)
    client.database.economy.addMoney(user[1].user.id, args[1])
    client.database.economy.remMoney(message.author.id, args[1])
    message.channel.send(`Paid \`${user[1].user.tag}\` \`$${parseInt(args[1])}\``)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "pay somebody money",
    usage: `${filename} <user> <amount>`
};
