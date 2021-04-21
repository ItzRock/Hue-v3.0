const filename = require('path').basename(__filename).split(".")[0]
exports.run = (client, message, args, level) => {
    // If no specific command is called, show all filtered commands.
    if (!args[0] || args[0] == "expanded" || args[0] == "all") {
        const avaliableCmds = [];
        const mappedCommands = [];
        const disabledCmds = message.settings["disabled-commands"].value;
        client.commands.forEach(cmd => {
            if (client.levelCache[cmd.conf.permLevel] > level) return;
            if (message.channel.type == "dm" && cmd.conf.guildOnly !== true) return;

            if (disabledCmds.includes(cmd.help.name)) return; // Disabled in guild
            if (cmd.conf.enabled == false) return; // Disabled command
            if (cmd.conf.premium === true && message.settings.premium.value !== true) return; // Not premium server
            
            avaliableCmds.push(cmd)
        });

        let output = client.defaultEmbed()
            .setColor(client.embedColour())
            .setTitle(`Commands List - ${client.user.username}`)
            .setDescription((disabledCmds.length === 0) ? `\`[Use ${message.settings.prefix.value}help [commandname] for details]\`` : `\`[Use ${message.settings.prefix.value}help [commandname] for details]\`\n\`Note: ${disabledCmds.length} command(s) are disabled in this guild.\``)
            .setThumbnail(client.user.avatarURL())
            .setTimestamp();

        const iteratedCategories = [];
        avaliableCmds.forEach(cmd => {
            const cmdCategory = cmd.help.category
            if (!iteratedCategories.includes(cmdCategory)) {
                iteratedCategories.push(cmdCategory); mappedCommands[cmdCategory] = {name: cmdCategory, fields: []}
            }; mappedCommands[cmdCategory].fields.push(`\`${cmd.help.name}\``)
        })

        for (let cmdCategory in mappedCommands) {
            let mappedArray = mappedCommands[cmdCategory]
            if (mappedArray.fields.length == 0) return;
            if (mappedArray.fields[mappedArray.fields.length]) mappedArray.fields[mappedArray.fields.length].replace(",", "");
            output.addField(`${mappedArray.name}`, mappedArray.fields.join(", "), true)
        }; message.channel.send(output);
    } else {
      // Show individual command's help.
      let command = args[0];
      if (client.commands.has(command) || client.aliases.has(command)) {
        command = client.commands.get(command) || client.commands.get(client.aliases.get(command));
        let output = client.defaultEmbed()
            .setColor(client.embedColour())
            .setTitle(command.help.name)
            .addFields(
                { name: 'Command name', value: `\`${command.help.name}\u200b\``, inline:true },
                { name: 'Description', value: (command.help.description.length !== 0) ? `\`${command.help.description}\u200b\`` : `\`We got lazy and forgot to provide a description.\``, inline:true },
                { name: 'Permission Level', value: `\`${command.conf.permLevel}\u200b\``, inline:true },
                { name: 'Usage', value: (command.help.usage.length !== 0) ? `\`${command.help.usage}\u200b\`` : "\`Figure it out(?)\`", inline:true},
                { name: 'Aliases', value: (command.conf.aliases.length !== 0) ? `\`${command.conf.aliases.join("\`, \`")}\u200b\`` : `\`None\``, inline:true},
                { name: 'Type', value: `\`${command.help.category}\u200b\``, inline:true},
                { name: 'Premium Only Command?', value: `\`${command.conf.premium}\u200b\``, inline:true},
                { name: 'Can Be Disabled?', value: `\`${command.conf.disablable}\u200b\``, inline:true},
            )
            .setTimestamp()
            .setFooter(`[optional] <required>\nCommand info for: "${command.help.name}" updated at`, client.user.avatarURL());
        message.channel.send(output);
      }
    }
  };

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["cmds", "h", "help"],
    permLevel: "User",
    disablable: false,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "helps you with getting help",
    usage: `${filename} [command]`
};
