const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = (client, message, args, level) => {
    // If no specific command is called, show all filtered commands.
    if (!args[0] || args[0] == "expanded" || args[0] == "all") {
      // Filter all commands by which are available for the user's level, using the <Collection>.filter() method.
      const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level &&  cmd.conf.guildOnly !== true);
  
      // Here we have to get the command names only, and we use that array to get the longest name.
      // This make the help commands "aligned" in the output.
      const commandNames = myCommands.keyArray();
      const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
  
      let currentCategory = "";
      let commandsList = ``
      let output = new MessageEmbed()
        .setColor(client.embedColour())
        .setTitle(`Commands List - ${client.user.username}`)
        .setAuthor(client.user.username, client.user.avatarURL())
        .setDescription(`[Use ${message.settings.prefix.value}help [commandname] for details]`)
        .setThumbnail(client.user.avatarURL())
        .setTimestamp()
        .setFooter(`${client.user.username}`, client.user.avatarURL());
        
        const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 :  p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1 );
        // Get the catagories
        const catagories = []
        const catagoryNames = []
        sorted.forEach(sorted => {
            const catagory = sorted.help.category 
            if(catagoryNames.includes(catagory)) return "Already have that catagory."
            catagories.push({name: catagory, fields: []})
            catagoryNames.push(catagory)
        })
        // Add the keys to the catagories
        catagories.forEach(catagory =>{
          sorted.forEach(command =>{
            if(command.conf.enabled == false) return // disabled command
            if(command.conf.premium === true && message.settings.premium.value !== true) return; // Not premium server
            if(command.help.category != catagory.name) return; // incorrect catagory
            catagory.fields.push(`\`${command.help.name}\`, `)
          })
      })
      catagories.forEach(catagory => {
        if(catagory.fields.length == 0) return;
        output.addField(`${catagory.name}`, catagory.fields.join(""), true)
      })

      output.setDescription(`\`[Use ${message.settings.prefix.value}help [commandname] for details]\` \n${commandsList}`)
      message.channel.send(output);
    } else {
      // Show individual command's help.
      let command = args[0];
      if (client.commands.has(command)) {
        command = client.commands.get(command);
        let output = new MessageEmbed()
            .setColor(client.embedColour())
            .setTitle(command.help.name)
            .setAuthor(client.user.username, client.user.avatarURL())
            .addFields(
                { name: 'Command name', value: `\`${command.help.name}\u200b\``, inline:true },
                { name: 'Description', value: `\`${command.help.description}\u200b\``, inline:true },
                { name: 'Permission Level', value: `\`${command.conf.permLevel}\u200b\``, inline:true },
                { name: 'Usage', value: `\`${command.help.usage}\u200b\`` , inline:true},
                { name: 'Type', value: `\`${command.help.category}\u200b\`` , inline:true},
                { name: 'Premium Only Command?', value: `\`${command.conf.premium}\u200b\`` , inline:true},
                { name: 'Can Be Disabled?', value: `\`${command.conf.disablable}\u200b\`` , inline:true},
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
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "helps you with getting help",
    usage: `${filename} [command]`
};