const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const activeSession = new Set();
exports.run = async (client, message, args, level) => {
    
    if(message.settings["ai-command"] == "false") return message.channel.send("This command is disabled in this guild. please run it in another server or run in the DMs with Hue.")
    if(activeSession.has(message.author.id)) return message.channel.send("You already have an active session! please type \`quit\` in the same channel in order to terminate that session.");
    
    
    const cleverbot = require("cleverbot-free");
    activeSession.add(message.author.id);
    message.channel.send("AI enabled, type `quit` at anytime to exit. Note: the input and output of this ai is logged.")
    awaitMessage() 
    const context = [`Hello, I am ${message.author.username}`, `Hello I am ${client.user.username}`]
    function awaitMessage(){
        message.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 300000}).then(collected => {
            if(collected.first().content.toLowerCase() == "quit"){
                client.logger.ai(`Session ${message.author.username} has ended`)
                activeSession.delete(message.author.id);
                return message.channel.send("Session has ended");
            }
            else {
                message.channel.startTyping()
                cleverbot(collected.first().content, context).then(response => {
                    context.push(collected.first().content)
                    context.push(response)
                    client.logger.ai(`AI Chat: ${message.author.username}: ${collected.first().content}. | AI: ${response}`)
                    if(response.split(" ").includes("@everyone") || response.split(" ").includes("@here") || response.split(" ").includes("<@&")){
                        message.channel.stopTyping()
                        return message.channel.send("`Error this message included an illegal phrase and will not be send`")
                    }
                    message.channel.send(response)
                    message.channel.stopTyping()
                });
                return awaitMessage();
            }          
        }).catch(() => {
            message.reply('No activity after 5 minutes session ended.');
            activeSession.delete(message.author.id);
            client.logger.ai(`Session ${message.author.username} has ended`)
        });
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Talk to an ai! try to not romance it, its not a human.",
    usage: `${filename}`
};