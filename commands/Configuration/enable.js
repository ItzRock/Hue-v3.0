const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(`Invalid Arguments. Usage: \`${client.commands.get(filename).help.usage}\``);
    if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
    function formatize(value){
        const valueArray = message.settings["disabled-commands"].value
        return {name: "disabled-commands", value: valueArray.filter(element => element !== value), editable: true, aliases:["disable"]}
    }
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if(!cmd) return message.channel.send(`Could not find specified command`)
    if(cmd.conf.disablable == false) return message.channel.send("You are unable to modify this command")
    if(!message.settings["disabled-commands"].value.includes(cmd.help.name)) return message.channel.send("This command is not disabled")
    client.settings.set(message.guild.id, formatize(cmd.help.name), "disabled-commands")
    return message.channel.send(`Successfully enabled \`${cmd.help.name}\``)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator",
    disablable: false,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Enables a specified command",
    usage: `${filename} <command>`
};