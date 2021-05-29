module.exports = async (client, member) => {
    const settings = await client.getSettings(member.guild);
    if(settings.logs.value === undefined) return// no logs
    const logs = client.getChannel(member.guild, settings.logs.value);
    if(logs === undefined) return // Logs is not set up correctly

    const embed = client.defaultEmbed()
        .setTitle(`Member Leave`)
        .setColor("RED")
        .setThumbnail(member.user.avatarURL({ format: "png", dynamic: true, size: 2048}))
        .addFields(
            {name: "User:", value: `\`${member.user.tag}\``, inline: true},
        )
    const dbInfo = await client.database.verify.read(member.user.id)
    if(dbInfo[0] == false){
        embed.addField(`Database Information`, "No information was found", true)
    } else {
        embed.addField(`Database Information`, `**Roblox Username:** \`${dbInfo[1].RobloxUsername}\``, true)
    }
    logs.send(embed)
}