const filename = require('path').basename(__filename).split(".")[0]
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
exports.run = async (client, message, args, level) => {
    try{
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
            if(categoryDescriptions[category]){
                categories.set(category, {category: category, emoji: categoryDescriptions[category][1], description: categoryDescriptions[category][0]})
            }else categories.set(category, {category: category, emoji: undefined, description: "This category has not been given a description by the bot developer."})
        }
        if(args[0]){
            // Determine if command or category
        }else {
            // Just display all the categories
            const description = []; categories.forEach(category => category.emoji !== undefined ? description.push(`${category.emoji } ${category.category}`) : description.push(`${category.category}`))
            const embed = client.defaultEmbed()
                .setTitle(`${client.user.username} Help Command`)
                .setDescription(`${description.join("\n")}`)
            message.channel.send(embed)
        }
    }catch(error){message.channel.send(client.errorEmbed(error))}
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["nh"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Helps you with getting help from the bot",
    usage: `${filename} <command or category>`
};
