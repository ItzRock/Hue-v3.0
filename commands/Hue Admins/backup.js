const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(client.invalidArgs(filename))
    try{
        const database = args.join(" ")
        const { exec } = require("child_process");

        exec("mongodump database", (error, stdout, stderr) => {
            if (error) {
                message.channel.send(`${message["x"]} ${error}`)
                return;
            }
            if (stderr) {
                message.channel.send(`${message["check"]} Success \`\`\`shell\n${stderr}\`\`\``)
                return;
            }
            message.channel.send(`${message["!"]} ${stdout}`)
        });
    }catch(error){message.channel.send(client.errorEmbed(error))}


    return
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
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "backup the database",
    usage: `${filename} <Database>`
};
