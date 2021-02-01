module.exports = async (client, member) => {
    const settings = client.getSettings(member.guild);
    console.log(settings.welcoming);
    if(settings.welcoming.value == true){
        const welcomingChannel = client.getChannel(member.guild, settings["welcoming-channel"].value);
        if(welcomingChannel !== undefined){
            const welcomeMessage = customText(settings["welcoming-text"].value)
            welcomingChannel.send(welcomeMessage)
        }
    }
    if(settings.unverifiedRole.value !== undefined || settings.unverifiedRole.value !== false){
        const role = await client.getRole(member.guild, settings.unverifiedRole.value);
        if(role !== undefined) member.roles.add(role)
    }
    function customText(text){
        text = text.toString()
        return text.replace("{{user}}", `${member.user}`).replace(`{{guild}}`, member.guild.name)
    }
};