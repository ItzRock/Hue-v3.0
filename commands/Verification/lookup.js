const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const noblox = require("noblox.js")
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    
    const avatarURL = client.user.avatarURL()
    const clientUsername = client.user.username
    
    if(!args[0]) return message.channel.send(`Invalid Arguments. Missing user: usage \`${client.getArgs(filename)}\``)
    const user = client.findUser(message, args[0])
    if(user[0] == false) return message.channel.send(`${user[1]}`)
    const hue = await client.database.verify.read(user[1].user.id)
    const rover = await client.apis.rover(user[1].user.id);
    const bloxlink = await client.apis.bloxlink(user[1].user.id);

    let hueMessage = ``
    if(hue[0] == true){
        hueMessage = `Hue: Username: \`${await noblox.getUsernameFromId(hue[1].RobloxID)}\`, ID: \`${hue[1].RobloxID}\``
    }else hueMessage = `Hue: \`${hue[1]}\``

    let roverMessage = ``
    if(rover !== false){
        roverMessage = `Rover: Username: \`${await noblox.getUsernameFromId(rover.id)}\`, ID: \`${rover.id}\``
    }else roverMessage = `Rover: \`not found\``

    let bloxlinkMessage = ``
    if(bloxlink !== false){
        bloxlinkMessage = `Bloxlink: Username: \`${await noblox.getUsernameFromId(bloxlink.id)}\`, ID: \`${bloxlink.id}\``
    }else bloxlinkMessage = `Bloxlink: \`not found\``

    const msgArray = [hueMessage, roverMessage, bloxlinkMessage]
    const desc = msgArray.join("\n")

    const embed = new MessageEmbed()
        .setAuthor(clientUsername, avatarURL)
        .setFooter(clientUsername, avatarURL)
        .setTimestamp()
        .setColor(client.embedColour())
        .setTitle("API Lookup")
        .setDescription(desc)

    message.channel.send(embed)
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
    description: "Find a unverified user's account. (not always works)",
    usage: `${filename} <user>`
};
