const { time } = require('console');
const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const timeout = new Set()
exports.run = async (client, message, args, level) => {
    if(timeout.has(message.author.id)) return message.channel.send(client.config.emojis.x+" Cannot commit another crime again! you have not waited your full five minute cooldown.")
    const action = Math.round(client.randomNumber(1,3))
    const crimes = ["robbed a gas station", "stole mr krab's wallet", "commited 7 war crimes in yemen", "robbed an ATM", "printed money", "started a black market in school"]
    const crimesFailed = ["rob a gas station", "steal mr krab's wallet", "commit 7 war crimes in yemen", "rob an ATM", "print money", "start a black market in school"]
    const value = Math.round(client.randomNumber(0, crimes.length -1))
    const crime = crimes[value]
    const failed = crimesFailed[value]
    if(action == 1 || action == 3){ // successful
        const earned = Math.round(client.randomNumber(50, 75))
        await client.database.economy.addMoney(message.author.id, earned)
        message.channel.send(`${client.config.emojis.check} You ${crime} and earned $${earned}`);
    } else { // fail
        const earned = Math.round(client.randomNumber(20, 35))
        await client.database.economy.remMoney(message.author.id, earned)
        message.channel.send(`${client.config.emojis.x} You tried to ${failed} but got caught and were fined $${earned.toString().replace("-", "")}`);
    }
    timeout.add(message.author.id);
    setTimeout(() => {
        timeout.delete(message.author.id);
    }, 300000);
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
    description: "criminal!",
    usage: `${filename}`
};
