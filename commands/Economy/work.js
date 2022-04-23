const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const timeout = new Set();
exports.run = async (client, message, args, level) => {
    if(timeout.has(message.author.id)) {
        return message.channel.send(client.config.emojis.x +" Cannot work again! you have not waited your full five minute cooldown.");
    } else {
        const jobs = ["Mechanic", "Programmer", "Cashier", "Butcher", "Uber", "Chicken nugget scientist", "Retail worker", "Fast food employee"]
        const value = Math.round(client.randomNumber(0, jobs.length -1))
        const job = jobs[value]
        const earned = Math.round(client.randomNumber(10, 50))
        client.database.economy.addMoney(message.author.id, earned);
        message.channel.send(`${client.config.emojis.check} You worked as a ${job} and earned $${earned}`);
        timeout.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          timeout.delete(message.author.id);
        }, 300000);
    }

}

exports.conf = {
    enabled: false,
    guildOnly: true,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Work for money",
    usage: `${filename}`
};
