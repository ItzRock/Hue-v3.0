const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const info = await client.database.economy.read(message.author.id)
    if(!args[0] || args[0] == "info"){
        if(info.BankCap == 0) return message.channel.send(`You currently don't have an open account, open an account with \`${message.settings.prefix.value}${filename} open\``)
        const embed = client.embedGen("Bank of Hue", `Here is your bank details.`, client.embedColour("safe"), "Economy")
        embed.addFields(
            { name: '**Wallet**', value: `\`$${info.Wealth}\``, inline: true },
            { name: '**Currency Stored**', value: `\`$${info.Bank}\``, inline: true },
            { name: '**Bank Limit**', value: `\`$${info.BankCap}\``, inline: true },
        )
        message.channel.send(embed)
    }else{
        if(args[0] == "open"){
            if(parseInt(info.BankCap) !== 0) return message.channel.send(`You already have an account open!`)
            client.database.economy.setBankCap(message.author.id, "100")
            client.database.economy.setBank(message.author.id, "0")
            return message.channel.send(`Account successfully created! run \`${message.settings.prefix.value}${filename} info\` for details`)
        }
        if(args[0] == "upgrade"){
            const level = info.BankCap / 100
            if(level > 20) client.database.economy.setBankCap(message.author.id, "20000")
            if(info.BankCap == 0) return message.channel.send(`You currently don't have an open account, open an account with \`${message.settings.prefix.value}${filename} open\``)
            if(level == 20) return message.channel.send(`You cannot buy anymore upgrades. Maximum upgrades purchased.`)
            const nextLevel = parseInt(info.BankCap) + 100;
            const embed = client.embedGen("Bank of Hue", `Would you like to upgrade your account to \`Level ${nextLevel / 100}\`? Cost: \`$${nextLevel}\` \`(yes / no)\``, "GREEN", "Bank Upgrades")
            embed.addFields(
                { name: '**Current Limit**', value: `\`$${info.BankCap}\``, inline: true },
                { name: '**New Limit**', value: `\`$${nextLevel}\``, inline: true },
            )
            const response = await client.awaitReply(message, embed)
            if(response){
                if(response == "yes" || response == "y"){
                    if(info.Wealth < nextLevel) return message.channel.send(`You do not have enough money! You have: \`$${info.Wealth}\`, Upgrade Price: \`$${nextLevel}\``)
                    client.database.economy.setBankCap(message.author.id, nextLevel)
                    const newMoney = info.Wealth - nextLevel;
                    client.database.economy.setMoney(message.author.id, newMoney)
                    return message.channel.send(`Successfully purchassed, \`Level ${nextLevel / 100}\`, Your new limit is \`$${nextLevel}\`!`)
                }else if(response == "no" || response == "n"){
                    return message.channel.send("Upgrade Cancelled!")
                } else return message.channel.send(`Invalid Response, expected \`yes\` or \`no\` got: \`${response}\``)
            }
        }else { return message.channel.send(`Invalid arguments. Usage: \`${client.commands.get(`${filename}`).help.usage}\``); }
    }
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
    description: "open and account, upgrade your account, or just look at your bank info",
    usage: `${filename} [open / upgrade / info]`
};
