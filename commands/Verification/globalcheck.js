const { MessageEmbed } = require('discord.js');
const { fsync } = require('fs');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = (client, message, args, level) => {
    return message.channel.send(`broken since i hate myself`)
    let progress = 0
    let unverified = 0
    let added = 0
    let unsure = 0
    let cantFind = 0

    const userAmount = client.users.cache.size

    const users = client.users.cache
    message.channel.send(`Checking a total of \`${userAmount}\` users.`)
    const forAPI = []
    users.forEach(user => {
        handleRequest(user)
    })
    function percent(min, max){
        return Math.floor((parseInt(min) / parseInt(max)) * 100)
    }
    async function handleRequest(user){
        progress++
        if(user.bot == true) return
        const isVerified = client.database.verify.count(user.id) !== 0
        if(isVerified === false){
            forAPI.push(user);
            unverified++
        }
        client.logger.log(`GC LOOP: Checking Users: ${percent(progress, userAmount)}% (${progress} / ${userAmount}): ${user.tag}`)
        if(progress >= userAmount) return message.channel.send(`Global Check Loop Complete!: ${percent(progress, userAmount)}% (${progress} / ${userAmount})\nUsers Added: \`${added}\`\nUnsure of: \`${unsure}\` users\nCouldn't Find: \`${cantFind}\` users\nTotal of \`${unverified}\` were not verified before this loop.`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["gc"],
    permLevel: "Hue Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Do not run this without permission.",
    usage: `${filename}`
};
