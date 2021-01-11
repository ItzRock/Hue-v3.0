/*
    I want to say this is the most confusing part of the bot so i ill document it.
*/
const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
    const settings = Object.values(message.settings) // Grabs current server settings and puts it into an array
    if(!args[0]){ // Show All Settings.
        const embed = new MessageEmbed()
            .setColor(client.embedColour())
            .setTitle(`Current settings for: ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL())
            .setDescription(`If a key has its own command to set, its recommended to use that as this command may be confusing`)
            .setFooter('Statistics updated at', client.user.avatarURL())
            .setAuthor(client.user.username, client.user.avatarURL())
            .setTimestamp()
        // Get the catagories
        const catagories = []
        const catagoryNames = []
        settings.forEach(setting => {
            const catagory = setting.catagory 
            if(catagory == "" || catagory == undefined) return;
            if(setting.editable == false) return "Not editable."
            if(catagoryNames.includes(catagory)) return "Already have that catagory."
            catagories.push({name: catagory, fields: []})
            catagoryNames.push(catagory)
        })
        // Add the keys to the catagories
        catagories.forEach(catagory =>{
            settings.forEach(key =>{
                if(key.disablable == false) return
                if(key.catagory != catagory.name) return
                if(key.value == undefined) key.value = `Value not set.`
                catagory.fields.push(`**${key.name}:**\n\`${key.value}\`\n`)
            })
        })

        // Add the fields
        catagories.forEach(catagory => {
            embed.addField(`${catagory.name}`, catagory.fields.join("\n"), true)
        })

        message.channel.send(embed)
    }
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
    description: "",
    usage: `${filename} [key] [value]`
};