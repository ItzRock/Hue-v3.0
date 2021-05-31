module.exports = async (client, button) => {
    const detailArray = button.id.split("%")
    const details = {}
    detailArray.forEach(detail => {
        const array = detail.split("=")
        details[array[0]] = array[1]
    })
    switch (details.ACTION) {
        case "DELETECASE": {
            if(button.clicker.user.id !== details.AUTHORISED) return button.defer();
            const response = await client.cases.deleteCase(button.message.guild, details.CASE)
            if(response[0] == true) button.reply.send(`Case \`${details.CASE}\` has been deleted`)
            return;
        }
        default:
            break;
    }
}