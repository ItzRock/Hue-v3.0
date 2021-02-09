const noblox = require('noblox.js')
const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    let unverifiedCount = 0
    let cannotFind = 0
    let unsure = 0
    let verified = 0
    if(!args[0]){
        checkguild(message.guild)
    } else {
        const guild = client.guilds.cache.get(args[0])
        if(guild == undefined) return message.channel.send(`Error cannot find guild.`)
        checkguild(guild)
    }
    async function checkguild(guild){
        const msg = await message.channel.send(`Checking guild: \`${guild.name}\` (this may take some time)`)
        client.logger.log(`Check Server has begun on guild: ${guild.name}`)
        await guild.members.cache.forEach(async member => {
            if(member.user.bot == true) return client.logger.log(`Not Checking: "${member.user.username}" as is bot`)
            const isVerified = await client.database.verify.count(member.user.id) == 1
            client.logger.log(`Checking user: ${member.user.username} returned: ${isVerified}`)
            if(isVerified == false){
                unverifiedCount++
                verify(member.user, msg, guild)
            }
        })
//        await msg.edit(`Checkserver Stats:\nUnverified Users: \`${unverifiedCount}\`\nCouldn't find \`${cannotFind}\` of them\nUnsure of \`${unsure}\`\n Managed to verify \`${verified}\` of them`)
    }
    async function verify(user, msg, guild){
        const ids = []
        const rover = await client.apis.rover(user.id);
        const bloxlink = await client.apis.bloxlink(user.id);
        if(rover !== false) ids.push(rover)
        if(bloxlink !== false) ids.push(bloxlink)
        if(ids.length == 2){
            if(ids[0].id.toString() == ids[1].id.toString()){
                const RO_username = await noblox.getUsernameFromId(ids[0].id)
                client.logger.log(`Linked: ${user.username} to: ${RO_username}`)
                actuallyVerify(user, msg, guild, RO_username, ids[0].id)
                verified++ 
            } else {
                const username1 = await noblox.getUsernameFromId(ids[0].id)
                const username2 = await noblox.getUsernameFromId(ids[1].id)
                unsure++
                client.logger.log(`UNSURE: User: ${user.username} maybe: ${username1} (${ids[0]}) or: ${username2} (${ids[1]})`)
            }
        } else if(ids.length == 1){
            const RO_username = await noblox.getUsernameFromId(ids[0].id)
            client.logger.log(`Linked: ${user.username} to: ${RO_username}`)
            actuallyVerify(user, msg, guild, RO_username, ids[0].id)
            verified++ 
        } else {
            client.logger.log(`Could not find a linking account for: ${user.username} `)
            cannotFind++
        }
    }
    async function actuallyVerify(user, msg, guild, username, id){
        client.database.verify.event(user.tag, username, id, "Check Server loop", `GUILD: ${guild.name} | ID: ${id}`)
        await client.database.verify.write(username, id, user.id)
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Hue Administrator",
    disablable: false,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Checks server and adds unverified user to database if they are in rover or bloxlink",
    usage: `${filename} [specified guild id]`
};
