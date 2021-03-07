const noblox = require("noblox.js")
const { MessageEmbed } = require("discord.js")
module.exports = (client) => {
    /*

    I dont think these do anything at all


    */
    client.verification = {}
    client.verification.bindRoles = async (member, robloxID) => {
        const settings = await client.getSettings(member.guild)
        const binds = settings["binds"].value
        const groupID = settings.groupID.value
        if(groupID == undefined) return;
        const rank = await noblox.getRankInGroup(groupID, robloxID);
        if(rank == 0) return;
        binds.forEach(bind => {
            if(bind.rblx == rank) member.roles.add(member.guild.roles.cache.get(bind.discord))
        })
    }
    client.verification.addRoles = async (member, robloxID) => {
        const settings = client.getSettings(member.guild)
        const rankID = noblox.getRankInGroup(settings.groupID.value)
        
    }
    client.verification.verify = async (member, message) => {
        const settings = client.getSettings(member.guild)
        const rawdata = await client.database.verify.read(member.user.id);
        const data = rawdata[1]

        const groupJoin = settings.GroupJoinRequired.value
        const verifiedRole = client.getRole(member.guild, settings.verifiedRole.value)
        const unverifiedRole = client.getRole(member.guild, settings.unverifiedRole.value)
        const groupID = settings.groupID.value
        const setnick = settings.setnick.value
        const logs = client.getChannel(member.guild, settings.logs.value);
    
        if(groupJoin == true) {
            if(groupID == undefined || client.isNum(groupID) == false) return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid group id.`)
            const groupRank = await noblox.getRankInGroup(groupID, data.RobloxID)
            if(groupRank == 0){
                const groupEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`You aren't in the group!`)
                    .setDescription(`The roblox user: \`${data.RobloxUsername}\` was not found in the group: https://www.roblox.com/groups/${groupID}.`)
                    .setAuthor(clientUsername, avatarURL)
                    .setFooter(clientUsername, avatarURL)
                    .setTimestamp()
                return message.channel.send(groupEmbed)
            }
        }
        message.member.roles.add(verifiedRole);
        findRolesinGuild(data.RobloxID)
        const updatedName = await noblox.getUsernameFromId(data.RobloxID);

    }
}