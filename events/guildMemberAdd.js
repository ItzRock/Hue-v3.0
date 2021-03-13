const { MessageEmbed } = require("discord.js");

module.exports = async (client, member) => {
    const settings = await client.getSettings(member.guild);
    if(settings.autorole.value !== false) {
        const role = await client.getRole(member.guild, settings.autorole.value);
        if(role !== undefined) member.roles.add(role)
    }
    if(settings.welcoming.value == true){
        const welcomingChannel = client.getChannel(member.guild, settings["welcoming-channel"].value);
        if(welcomingChannel !== undefined){
            const welcomeMessage = customText(settings["welcoming-text"].value)
            if(welcomeMessage == "--embed"){
                let desciption
                if(settings.GroupJoinRequired.value == true) desciption = `
                In order to gain access to the rest of the channels please follow these steps.\n
                **Step 1:** Read the rules,
                **Step 2:** Join our group linked [here,](https://www.roblox.com/groups/${settings.groupID.value})
                **Step 3:** Run \`${settings.prefix.value}verify\`.
                **Step 4:** boom you're in
                `
                else desciption = `
                In order to gain access to the rest of the channels please follow these steps.\n
                **Step 1:** Read the rules,
                **Step 2:** \`Run ${settings.prefix.value}verify\`.
                **Step 3:** boom you're in
                `
                const embed = new MessageEmbed()
                    .setAuthor(client.user.username, client.user.avatarURL())
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setTimestamp()
                    .setColor(client.embedColour())
                    .setThumbnail(member.guild.iconURL())
                    .setTitle(`Welcome \`${member.user.username}\` to **${member.guild.name}!**`)
                    .setDescription(desciption)
                setTimeout(function(){welcomingChannel.send(embed)}, 1000)
            }
            else setTimeout(function(){welcomingChannel.send(welcomeMessage)}, 1000)
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