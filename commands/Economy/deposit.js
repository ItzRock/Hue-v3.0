const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const info = await client.database.economy.read(message.author.id)
    if(info.BankCap == 0) return message.channel.send(`You currently don't have an open account, open an account with \`${message.settings.prefix.value}bank open\``)
    if(info.BankCap === info.Bank) return message.channel.send("Your account is full! Please upgrade in order to deposit more.")
    if(!args[0]) return message.channel.send("Please specify an amount!");
    if(/^\d+$/.test(args[0]) == false) return message.channel.send("Please specify a number.")
    if(info.Wealth - args[0] < 0) return message.channel.send("Can't deposit more then you have!");
    const space = (info.BankCap - info.Bank)
    if(space - args[0] < 0) return message.channel.send(`There isnt enough space in your account! Space left: \`$${space}\``)
    if(args[0] <= 0) return message.channel.send("Can't deposit less then zero.") 
    client.database.economy.setMoney(message.author.id, (parseInt(info.Wealth) - parseInt(args[0])))
    client.database.economy.setBank(message.author.id, (parseInt(info.Bank) + parseInt(args[0])))
    const newInfo = await client.database.economy.read(message.author.id)
    const newSpace = (newInfo.BankCap - newInfo.Bank)
    return message.channel.send(`Deposited \`$${args[0]}\`, You now have \`$${(parseInt(info.Wealth) - parseInt(args[0]))}\` in your wallet, and \`$${newInfo.Bank}\` in your bank.`)
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
    description: "Deposit money into your bank account",
    usage: `${filename} <amount>`
};
