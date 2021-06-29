const filename = require('path').basename(__filename).split(".")[0]
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
function isWhole(num){
    return num % 1 == 0
}
exports.run = async (client, message, args, level) => {
    try{
        const disabledCmds = message.settings["disabled-commands"].value;
        const header = (disabledCmds.length === 0) ? `\`[Use ${message.settings.prefix.value}help [command OR category OR all] for details]\`` : `\`[Use ${message.settings.prefix.value}help [command OR category] for details]\`\n\`Note: ${disabledCmds.length} command(s) are disabled in this guild.\``

        const data = await readdir("./commands/")
        const categoryDescriptions = {
            Configuration: [`Configurate ${client.user.username} for your server.`, ":gear:"],
            Economy: [`Have Fun with the ${client.user.username} Economy.`, ":moneybag:"],
            Fun: [`Entertain yourselves with these disapointing commands!`, ":ping_pong:"],
            ["Hue Admins"]: [`Bot Management (very pro)`, ":toilet:"], 
            Images: ["Images from api we found in a trashbin (aka not relyable)", ':frame_photo:'],
            Items: ["Purchase items with the money made from the economy.", ":chocolate_bar:"],
            Moderation: ["Obey the law!!!!", ":axe:"],
            System: ["Important commands", ":computer:"],
            Utililty: ["More Important commands, just cooler sounding.", ":wrench:"],
            Verification: ["All of the Hue verification commands.", ":bookmark_tabs:"]
        }
        const categories = new Map();
        for(const category of data){
            let emoji = categoryDescriptions[category] != undefined ? categoryDescriptions[category][1] : undefined
            let description = categoryDescriptions[category] != undefined? categoryDescriptions[category][0] : "This category has not been given a description by the bot developer."
            
            const raw = await readdir(`./commands/${category}`)
            const commandNames = []
            for(const command of raw){
                commandNames.push(command.split(".")[0])
            }
            const commands = []
            commandNames.forEach(command => {
                const cmd = client.commands.get(command)
                if (client.levelCache[cmd.conf.permLevel] > level) return;
                if (message.channel.type == "dm" && cmd.conf.guildOnly !== true) return;
    
                if (disabledCmds.includes(cmd.help.name)) return; // Disabled in guild
                if (cmd.conf.enabled == false) return; // Disabled command
                if (cmd.conf.premium === true && message.settings.premium.value !== true) return; // Not premium server
                
                commands.push(cmd)
            })
            categories.set(category.toLowerCase(), {category: category,  emoji: emoji, description: description, commands: commands})
        }
        if(args[0]){
            // Determine if command or category
            if(args[0] == "all"){
                const avaliableCmds = [];
                const mappedCommands = [];
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
            } 
            let query = args[0].toLowerCase();
            if(categories.has(query)){
                const category = categories.get(query)
                if(category.commands.length == 0) return message.channel.send(`This category has no commands for you.`);
                const description = []; category.commands.forEach(cmd => description.push(cmd.help.name))
                const space = 1
                
                while(isWhole(description.length / 3) == false){
                    description.push("**  **")
                    if(isWhole(description.length / 3)) break;
                }
                for(i = 0; i < space * 3; i++) { description.push("** **") }
                const embed = client.defaultEmbed()
                    .setTitle(`${category.category}`)
                    .setDescription(`${header}`)
                description.forEach(category => embed.addField(`${category}`, "** **", true))
    
                embed.addFields(
                    {name: "Support Server", value: "[Link](https://discord.gg/QwgnZ83XD3)", inline: true},
                    {name: "Invite Bot", value: "[Link](https://discord.com/oauth2/authorize?client_id=738044908656656455&scope=bot&permissions=8)", inline: true},
                    
                )
            }
            else if (client.commands.has(query) || client.aliases.has(query)) {
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
        }else {
            // Just display all the categories
            const description = []; categories.forEach(category => {
                if(category.commands.length != 0) category.emoji !== undefined ? description.push(`${category.emoji} \`${category.category}\``) : description.push(`\`${category.category}\``)
            })
            const space = 1
            
            while(isWhole(description.length / 3) == false){
                description.push("**  **")
                if(isWhole(description.length / 3)) break;
            }
            for(i = 0; i < space * 3; i++) { description.push("** **") }
            const embed = client.defaultEmbed()
                .setTitle(`${client.user.username} Help Command`)
                .setDescription(`${header}\n** **\n**All ${client.user.username} Categories**\n`)
            description.forEach(category => embed.addField(`${category}`, "** **", true))

            embed.addFields(
                {name: "Support Server", value: "[Link](https://discord.gg/QwgnZ83XD3)", inline: true},
                {name: "Invite Bot", value: "[Link](https://discord.com/oauth2/authorize?client_id=738044908656656455&scope=bot&permissions=8)", inline: true},
                
            )

            message.channel.send(embed)
        }
    }catch(error){message.channel.send(client.errorEmbed(error))}
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["asd"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Helps you with getting help from the bot",
    usage: `${filename} <command OR category OR all>`
};
