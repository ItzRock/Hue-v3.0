const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const msg = await message.channel.send(`Preparing API check of all users.`)
    let progress = 0
    const userAmount = client.users.cache.size
    const users = client.users.cache
    await msg.edit(`Checking Users: ${percent(progress, userAmount)}%`)
    const forAPI = []
    users.forEach(user => {
        setTimeout(async () =>{
            progress++
            const toEdit = `Checking Users: ${percent(progress, userAmount)}% (${progress} / ${userAmount})`
            if(msg.content !== toEdit && percent(progress, userAmount) % 25 == 0) await msg.edit(toEdit)
            const isVerified = await client.database.verify.count(user.id) == 1
            if(isVerified !== true) forAPI.push(user);
        }, client.randomNumber(0,1000))
    })
    function percent(min, max){
        return Math.floor((parseInt(min) / parseInt(max)) * 100)
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
