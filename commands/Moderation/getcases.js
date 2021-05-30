const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(client.invalidArgs(filename))
    try{
        const toSearch = args.join(" ")
        const searchResults = client.findUser(message, toSearch)
        if(searchResults[0] == false) return message.channel.send(`${searchResults[1]}`)
        const member = searchResults[1]
        let casesForText = `${member.user.tag} (${member.user.id})`
        const caseMap = client.arrayToMap(message.settings.modcases.value)
        const userCases = []

        caseMap.forEach(case_ => {
            if(case_.user == member.user.id) userCases.push(case_)
        })

        let description = `\`\`\`\nNo cases were found on this user\`\`\``
        const embed = client.defaultEmbed()
            .setTitle(`Moderation Cases for \`${casesForText}\``)
            .setDescription(description)
        if(userCases.length == 0) return message.channel.send(embed);

        const cases = userCases; description = `There Are: \`${cases.length}\` Cases on this user.\`\`\``;
        cases.forEach((case_) => {description = description + `\nCase: ${case_.name} | Action: ${case_.action}.\nReason: ${case_.reason}\n`}); description = description + "\n```"
        embed.setDescription(description.substr(0, 999))
        message.channel.send(embed);
    }catch(error){message.channel.send(client.errorEmbed(error))}
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["cases", "case", "modcases"],
    permLevel: "Moderator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "view the moderation cases on users",
    usage: `${filename} <user>`
};
