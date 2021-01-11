const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
    const settings = Object.values(message.settings)
    const defaults = client.settings.get("default");
    if(!args[0]){ // Show All Settings.
        const embed = new MessageEmbed()
            .setColor(client.embedColour())
            .setTitle(`Current settings for: ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL())
            .setFooter('Statistics updated at', client.user.avatarURL())
            .setAuthor(client.user.username, client.user.avatarURL())
            .setTimestamp()
        // Get the catagories
        const catagories = []
        settings.forEach(setting => {
            const catagory = setting.catagory
            if(catagory == "" || catagory == undefined) return;
            if(setting.editable == false) return "Not editable."
            if(catagories.includes(catagory)) return "Already have that catagory."
            catagories.push({name: catagory, fields: []})
        })
        // Add the keys to the catagories
        catagories.forEach(catagory =>{
            settings.forEach(key =>{
                if(key.disablable == false) return
                catagory.fields.push(`\`${key.name}:\`\n${key.value}\n`)
            })
        })
        console.log(catagories);
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
    disablable: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "",
    usage: `${filename} [optional] <required>`
};