module.exports = async (client, member) => {
    const settings = client.getSettings(member.guild);
    console.log(settings.welcoming);
    if(settings.welcoming.value == true){
        const welcomingChannel = client.getChannel(member.guild, settings["welcoming-channel"].value);
        console.log(welcomingChannel)
        if(welcomingChannel !== undefined){
            const welcomeMessage = customText(settings["welcoming-text"].value)
            welcomingChannel.send(welcomeMessage)
        }
    }
    // Auto verification may re add this later

    /*
    if(settings.verification.value == true){
        const verifiedRole = client.getRole(member.guild, settings.verifiedRole.value)
        const unverifiedRole = client.getRole(member.guild, settings.unverifiedRole.value)
        if(verifiedRole !== undefined){
            const data = await client.database.verify.count(member.user.id);
            if(data !== 0){
                member.roles.add(verifiedRole)
            } else {
                member.roles.add(unverifiedRole)
            }
        }
    }
    */
    function customText(text){
        text = text.toString()
        return text.replace("{{user}}", `${member.user}`).replace(`{{guild}}`, member.guild.name)
    }
};