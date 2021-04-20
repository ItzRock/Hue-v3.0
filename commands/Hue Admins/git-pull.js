const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    //if(!args[0]) return message.channel.send(client.invalidArgs(filename))
    try{
        const { exec } = require("child_process");

        exec("git pull", (error, stdout, stderr) => {
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
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["pull"],
    permLevel: "Hue Administrator",
    level: 10,
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "update hue",
    usage: `${filename}`
};
