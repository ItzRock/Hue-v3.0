module.exports = (client) => {
    client.modFunc = {
        mute: async function(message, member, mutedRole){
            member.roles.cache.forEach(async role => {
                if(role.name == "@everyone") return
                await member.roles.remove(role).catch()
            })
            await member.roles.add(mutedRole).catch(error => message.channel.send(`An Error has occurred: \`${error.message}\``))
        },
        unmute: async function(message, member, mutedRole){
            await member.roles.remove(mutedRole).catch(error => message.channel.send(`An Error has occurred: \`${error.message}\``))    
            const muted = message.settings.mutedUsers.value
            muted.forEach(async record => {
                if(record.id == member.user.id){
                    record.roles.forEach(async role => {
                        await member.roles.add(role).catch( error => message.channel.send(`Failed to add role: ${error.message}`) )
                    })
                    const data = await client.HueMap.removeObject(message.guild.id, "mutedUsers", record)
                    client.logger.log(JSON.stringify(data))
                    
                }
            })
        },
        ban: async function(message, member){
            
        }
    }
}