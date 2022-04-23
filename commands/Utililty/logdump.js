const filename = require('path').basename(__filename).split(".")[0]
const fs = require("fs");
/**
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Message} message 
 * @param {import("discord.js")} Discord 
 */
exports.run = async (client, message, args, level) => {
    //if(!args[0]) return message.channel.send(client.invalidArgs(filename))
    try{
        const logs = await fs.readdirSync("./logs")
        const log = logs[logs.length -1]
        const logContent = await fs.readFileSync(`./logs/${log}`)
        message.channel.send(`Sending Log File: \`${log}\``, {
            files: [
                {
                    name: log,
                    attachment: new Buffer.from(logContent)
                }
            ]
        })
    }catch(error){message.channel.send(client.errorEmbed(error))}
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["dump", "logs", "dumplogs"],
    permLevel: "Hue Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "",
    usage: `${filename}`
};
