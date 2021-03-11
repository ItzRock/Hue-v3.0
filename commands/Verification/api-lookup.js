const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const noblox = require("noblox.js")
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`${client.config.emojis.exclamation} This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    if(!args[0]) return message.channel.send(`${client.config.emojis.x} No user provided. Usage: \`${client.commands.get(`${filename}`).help.usage}\``);
    const msg = await message.channel.send(`${client.config.emojis.exclamation} Request Pending.`)
    const rawuser = client.findUser(message, args[0])
    if(rawuser[0] == false) {
        await msg.delete()
        return message.channel.send(`${rawuser[1]}`)
    }
    const user = rawuser[1]
    const hue = await client.database.verify.read(user.user.id)
    const rover = await client.apis.rover(user.user.id);
    const bloxlink = await client.apis.bloxlink(user.user.id);
    const IDs = []

    let hueMessage = ``
    if(hue[0] == true){
        IDs.push(hue[1].RobloxID)
        hueMessage = `Hue Username: \`${await noblox.getUsernameFromId(hue[1].RobloxID)}\`\nID: \`${hue[1].RobloxID}\``
    }else hueMessage = `Hue: \`${hue[1]}\``

    let roverMessage = ``
    if(rover !== false){
        IDs.push(rover.id)
        roverMessage = `Rover: Username: \`${await noblox.getUsernameFromId(rover.id)}\`\nID: \`${rover.id}\``
    }else roverMessage = `Rover: \`not found\``

    let bloxlinkMessage = ``
    if(bloxlink !== false){
        IDs.push(bloxlink.id)
        bloxlinkMessage = `Bloxlink: Username: \`${await noblox.getUsernameFromId(bloxlink.id)}\`\nID: \`${bloxlink.id}\``
    }else bloxlinkMessage = `Bloxlink: \`not found\``

    const embed = client.defaultEmbed()
        .setTitle("API Lookup")
        .addField("Hue", hueMessage ,true)
        .addField("Bloxlink", bloxlinkMessage ,true)
        .addField("Rover", roverMessage ,true)
    if(IDs.length !== 0){
        const thumb = (await noblox.getPlayerThumbnail([IDs[0]], 720, "png", false))[0].imageUrl
        embed.setThumbnail(thumb)
    }
    await msg.delete()
    message.channel.send(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["api", "apilookup", "lookupapi"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Look up a user using various APIs",
    usage: `${filename} <Discord User>`
};
