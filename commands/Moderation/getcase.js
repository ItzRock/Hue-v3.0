const filename = require('path').basename(__filename).split(".")[0]
const { MessageButton } = require("discord-buttons")
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(client.invalidArgs(filename))
    try{
        const caseMap = client.arrayToMap(message.settings.modcases.value)
        if(args[0].split("")[0] !== "#") args[0] = "#" + args[0]
        if(!caseMap.has(args[0])) return message.channel.send(`${message.x} Unable to find case \`${args[0]}\``)
        const _case = caseMap.get(args[0])
        
        const embed = client.defaultEmbed()
            .setTitle(`Case \`${args[0]}\``)
            .setDescription(`\`\`\`\nUser: ${_case.user}\nAction: ${_case.action}.\nReason: ${_case.reason}\nModerator: ${_case.mod}\n\`\`\``)
        const renameButton = new MessageButton().setStyle("blurple").setLabel("Edit Case").setID(`ACTION=RENAMECASE%CASE=${_case.name}%AUTHORISED=${message.author.id}`)
        const deleteButton = new MessageButton().setStyle("red").setLabel("Delete Case").setID(`ACTION=DELETECASE%CASE=${_case.name}%AUTHORISED=${message.author.id}`)

        message.channel.send({
            embed: embed,
            buttons: [renameButton, deleteButton]
        })

    }catch(error){message.channel.send(client.errorEmbed(error))}
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["case"],
    permLevel: "Moderator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "fetch a case by its ID",
    usage: `${filename} <caseID>`
};
