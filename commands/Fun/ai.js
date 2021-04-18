const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const activeSession = new Set();
exports.run = async (client, message, args, level) => {
    
    if(message.settings["ai-command"] == "false") return message.channel.send("This command is disabled in this guild. please run it in another server or run in the DMs with Hue.")
    if(activeSession.has(message.author.id)) return message.channel.send("You already have an active session! please type \`quit\` in the same channel in order to terminate that session.");
    
    
    const cleverbot = require("cleverbot-free");
    activeSession.add(message.author.id);
    message.channel.send("AI enabled, type `quit` at anytime to exit. (warning this AI may be offensive as it uses a public API)")
    awaitMessage() 
    const context = []
    const quit = ["quit", "quitchat", "quit chat", ";quit",]
    let isStillActive = true
    function awaitMessage(){
        message.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 300000}).then(collected => {
            if(quit.includes(collected.first().content.toLowerCase())){
                client.logger.ai(`Session ${message.author.username} has ended`)
                activeSession.delete(message.author.id);
                isStillActive = false;
                return message.channel.send("Session has ended");
            }
            else {
                if(isStillActive == false) return
                message.channel.startTyping()
                try{cleverbot(collected.first().content, context).then(response => {
                    if(isStillActive == false) {
                        return message.channel.stopTyping()
                    }
                    context.push(collected.first().content)
                    context.push(response)
                    if(response.split(" ").includes("@everyone") || response.split(" ").includes("@here") || response.split(" ").includes("<@&")){
                        message.channel.stopTyping()
                        return message.channel.send("`Error this message included an illegal phrase and will not be sent`")
                    }
                    message.channel.send(response)
                    message.channel.stopTyping()
                });
                return awaitMessage();}
                catch( err ) {
                    const embed = client.errorEmbed(err)
                        .setTitle(`AI timeout`)
                        .setDescription(`The AI has timed out. It will continue to run but your message \`${collected.first().content}\` failed to get through.`)
                    message.channel.send(embed)
                    message.channel.stopTyping()
                }
            }          
        }).catch(() => {
            message.reply('No activity after 5 minutes session ended.');
            activeSession.delete(message.author.id);
            client.logger.ai(`Session ${message.author.username} has ended`)
        });
    }
}

exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Talk to an ai! try to not romance it, its not a human.",
    usage: `${filename}`
};