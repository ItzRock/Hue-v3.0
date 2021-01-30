const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]){
        const money = await client.database.economy.read(message.author.id);
        message.channel.send(`You currently have: \`$${money.Wealth}\` in your wallet.`);
        }else {
            const user = client.findUser(message, args[0])
            if(user[0] !== false){
                const money = await client.database.economy.read(user[1].user.id)
                message.channel.send(`\`${user[1].user.username}\` currently has: \`$${money.Wealth}\` in their wallet.`)
            }else return message.channel.send(user[1])
        }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["bal", "money", "wallet", "wealth"],
    permLevel: "User",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "View a balance",
    usage: `${filename} [user]`
};
