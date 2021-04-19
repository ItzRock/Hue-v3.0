const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const { promisify } = require("util");
const readFile = promisify(require("fs").readFile); 
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(client.invalidArgs(filename))
    try{
        const cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        if (!cmd) return message.channel.send(`${message.x} Invalid command.`);
        let directory = `${cmd.help.category}/${cmd.help.name}.js`
        const data = (await readFile(`./commands/${directory}`)).toString()
        const clean = await client.clean(client, data);
        message.channel.send({files: [{
            name: `${cmd.help.name}.js`,
            attachment: new Buffer.from(`${clean}`)
        }]});
    }catch(error){message.channel.send(client.errorEmbed(error))}
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User",
    level: 0,
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Get the source of a cmd.",
    usage: `${filename} <cmd>`
};
