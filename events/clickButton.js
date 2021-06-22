module.exports = async (client, button) => {
    const detailArray = button.id.split("%")
    const details = {}
    detailArray.forEach(detail => {
        const array = detail.split("=")
        details[array[0]] = array[1]
    })
    switch (details.ACTION) {
        case "DELETECASE": {
            if (button.clicker.user.id !== details.AUTHORISED) return button.defer();
            const response = await client.cases.deleteCase(button.message.guild, details.CASE)
            if (response[0] == true) button.reply.send(`Case \`${details.CASE}\` has been deleted`)
            return;
        }
        case "RENAMECASE": {
            if (button.clicker.user.id !== details.AUTHORISED) return button.defer();
            const settings = await client.getSettings(button.message.guild);
            const caseMap = client.arrayToMap(settings.modcases.value)
            const response = await client.cases.deleteCase(button.message.guild, details.CASE)
            if (response[0] == true) {
                const case_ = caseMap.get(details.CASE)
                button.message.author.id = details.AUTHORISED
                await button.reply.send(`What should I rename the reason to.`)
                const response = await client.awaitReply(button.message, "`Send Message Input`", 600000)
                if (response == false) {
                    button.reply.edit('Error. Message Timeout');
                    client.cases.addCase(button.message.guild, case_.user, case_.reason, case_.action, case_.mod, details.CASE)
                } else {
                    client.cases.addCase(button.message.guild, case_.user, response, case_.action, case_.mod, details.CASE)
                    button.message.channel.send(`Successfully edited the reason to \`${response}\``)
                }
            } else button.reply.send(`Something went wrong: \`${response[1]}\``)
            return;
        }
        default:
            break;
    }
}