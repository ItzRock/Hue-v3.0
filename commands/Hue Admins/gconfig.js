const { MessageEmbed } = require('discord.js');
const { inspect } = require("util");
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    function splitString (string, size) {
        var re = new RegExp('.{1,' + size + '}', 'g');
        return string.match(re);
    }
    if(!args[0]) return message.channel.send(`Invalid Arguments.`)
    const defaults = client.settings.get("default");
    switch(args[0]){
        case "view": {
            
            Object.values(defaults).foreach(key => {
                if(key.name == args[1]){
                    message.channel.send(`key: \`\`\`json\n${key}\`\`\``)
                }
            })
            return message.channel.send(`Unknown Item`)
            
        }
        default: return message.channel.send(`Unknown case`)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['gc'],
    permLevel: "Hue Administrator",
    disablable: false,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "does stuff important so no touchy",
    usage: `${filename} <edit / view / delete> <config item> <value of item> <to replace with>`
};
