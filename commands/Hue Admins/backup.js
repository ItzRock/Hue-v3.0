const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return;
    const data = await client.database.read(args.join(" "))
    let readable = ""
    data.forEach(value => {
        readable = `${readable}\n${JSON.stringify(value)},\n`
    })
    readable = `[${readable}]`
    message.channel.send(`Successfully backedup \`${args.join(" ")}\``)
    fs.writeFile(`./data/BACKUP-${args.join(" ")}.json`, readable, function(err){
        if(err){console.log("oh god something broke: " + err);}
    })
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Hue Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "backup the database",
    usage: `${filename} <collection>`
};
