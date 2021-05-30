module.exports = (client) => {
    function generateID(){
        return "#" + Math.floor(Math.random()*16777215).toString(16)
    }
    client.cases = {
        addCase: async (guild, id, reason = "Unlogged case reason", action = "Unknown", caseID = generateID()) => {
            client.HueMap.add(guild.id, "modcases", {name: caseID, value: { name: caseID, reason: reason, action: action, user: id }}) 
        },
        generateID: generateID,
    }
    client.modFunc = {
        mute: async function(message, member, mutedRole, reason = "Reason not provided."){
            client.cases.addCase(member.guild, member.user.id, reason, "MUTE")
            member.roles.cache.forEach(async role => {
                if(role.name == "@everyone") return
                await member.roles.remove(role).catch()
            })

            if (member.voice.channel) {
                await member.voice.kick(reason).catch(error => message.channel.send(`An Error has occurred: \`${error.message}\``))
            }; await member.roles.add(mutedRole).catch(error => message.channel.send(`An Error has occurred: \`${error.message}\``))
        },
        unmute: async function(message, member, mutedRole, reason = "Automatic unmute (Bot/Integration)"){
            await member.roles.remove(mutedRole).catch(error => message.channel.send(`An Error has occurred: \`${error.message}\``))    
            
            const settings = await client.getSettings(member.guild);
            const muted = settings.mutedUsers.value
            muted.forEach(record => {
                if(record.id.toString() === member.user.id.toString()){
                    console.log(`Unmuting ${member.user.tag}. Record found.`)
                    record.rolesIDS.forEach(async role => {
                        await member.roles.add(role).catch( error => message.channel.send(`Failed to add role \`${message.guild.roles.cache.get(role).name}\`: ${error.message}`) )
                    })
                    client.HueMap.removeObject(message.guild.id, "mutedUsers", record, "id")
                }
            })
        },
        ban: async function(message, member, reason = "Reason not provided."){
            client.cases.addCase(member.guild, member.user.id, reason, "BAN")
            return await member.ban({reason : reason})
        },
        kick: async function(message, member, reason = "Reason not provided."){
            client.cases.addCase(member.guild, member.user.id, reason, "KICK")
            return await member.kick({reason : reason})
        }
    }
}
