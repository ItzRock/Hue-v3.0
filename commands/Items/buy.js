const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(`Invalid Arguments, Missing product. Usage: \`${client.commands.get(`${filename}`).help.usage}\``)
    const items = await client.items.readAll();
    const names = []
    items.forEach(item => {
        names.push(item.Name.toLowerCase())
    });
    const listedItem = args.join(" ").toLowerCase();
    if(names.includes(listedItem.toLowerCase()) == false) return  message.channel.send(`Invalid item, please take a look at our shop to find a valid item. ${message.settings.prefix.value}store`)
    const item = items.find(i => i.Name == listedItem);
    const info = await client.database.economy.read(message.author.id);
    const price = parseInt(item.Price);
    const wealth = parseInt(info.Wealth);
    if(item.Available == false) return message.channel.send(`This item is not for sale.`);
    if(price > wealth) return message.channel.send(`You don't have enough money to buy this! Price: \`$${price}\`, You have \`$${wealth}\``)
    client.Inventory.add(listedItem, message.author.id);
    if(item.onBuyFunction) eval(item.onBuyFunction);
    client.database.economy.setMoney(message.author.id, wealth - price);
    message.channel.send(`Successfully purchased \`${item.Name}\` for \`$${price}\`! You can now use it with \`${message.settings.prefix.value}use ${item.Name}\``)

}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["purchase"],
    permLevel: "User",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "buy an item",
    usage: `${filename} <Item>`
};
