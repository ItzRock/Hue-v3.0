const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(`Invalid arguments. Give me a question!`)
    const responses = ["No", "Do not ask me that again please.", "Yes", "Maybe", "I dunno", "Absolutely", "Absolutely ||not||"]
    message.channel.send(`🎱 ${responses.random()}`)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Ask a question and it returns an answer!",
    usage: `${filename} <question>`
};