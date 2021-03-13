const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send("Specify the item you want to use.");
    const use = args.join(" ").toLowerCase();
    const itemObjects = await client.items.readAll();
    const items = []
    itemObjects.forEach(item =>{
        items.push(item.Name)
    })
    if(items.includes(use.toLowerCase()) == false) return message.channel.send("That item doesn't exist!")
    const inventory = await client.Inventory.fetch(message.author.id)
    let itemAmount = 0
    inventory.forEach(item => {
        if(item.ItemName == use) itemAmount++;
    })
    if(itemAmount == 0) return message.channel.send("You don't own that item!")
    const item = itemObjects.find(item => item.Name == use)
    if(item.DeleteOnUse == true){client.Inventory.remove(use, message.author.id);}
    if(item.onUseFunction == undefined) return message.channel.send(`You tried using ${item.Name} but vanished as it had no use.`)
    eval(item.onUseFunction);
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
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "use an item from your inventory",
    usage: `${filename} <item>`
};
