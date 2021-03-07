const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const info = await client.database.economy.read(message.author.id)
    if(info.BankCap == 0) return message.channel.send(`${client.config.emojis.exclamation} You currently don't have an open account, open an account with \`${message.settings.prefix.value}bank open\``)
    if(!args[0]) return message.channel.send(client.config.emojis.exclamation+" Please specify an amount!");
    if(/^\d+$/.test(args[0]) == false) return message.channel.send(client.config.emojis.exclamation + " Please specify a number.")
    if(info.Bank - args[0] < 0) return message.channel.send(client.config.emojis.x + " Can't withdraw more then you have!");
    if(args[0] <= 0) return message.channel.send(client.config.emojis.x +" Can't withdraw less then zero.") 

    client.database.economy.setMoney(message.author.id, (parseInt(info.Wealth) + parseInt(args[0])))
    client.database.economy.setBank(message.author.id, (parseInt(info.Bank) - parseInt(args[0])))

    const newInfo = await client.database.economy.read(message.author.id)
    const newSpace = (newInfo.BankCap - newInfo.Bank)
    return message.channel.send(`${client.config.emojis.check} Withdrew \`$${args[0]}\`, You now have \`$${(parseInt(info.Wealth) + parseInt(args[0]))}\`, and \`$${newInfo.Bank}\` left in your bank.`)

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
    description: "Take money out of your bank account",
    usage: `${filename} <amount>`
};
