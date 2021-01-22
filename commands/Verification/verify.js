const { MessageEmbed } = require('discord.js');
const noblox = require("noblox.js")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const avatarURL = client.user.avatarURL()
    const clientUsername = client.user.username;
    const settings = message.settings;
    const guild = message.guild;
    if(settings["verification"].value !== true) return message.channel.send(`This command is only available in servers with ${client.user.username}'s verification system enabled.`)
   
    const possibleKeys = ["green", "orange", "alpha", "delta", "charlie", "bravo", "puppy", "yellow", "apple", "banana"]
    const status = client.shuffle(possibleKeys)

    const verifiedRole = client.getRole(message.guild, message.settings.verifiedRole.value)
    const unverifiedRole = client.getRole(message.guild, message.settings.unverifiedRole.value)
    if(verifiedRole == undefined) return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid verified role.`);
    
    const groupID = settings.groupID.value
    const setnick = settings.setnick.value
    const groupJoin = settings.GroupJoinRequired.value
    
    const logs = client.getChannel(message.guild, message.settings.logs.value);

    const alreadyInDB = await client.database.verify.count(message.author.id) >= 1

    const pending = new MessageEmbed()
        .setAuthor(clientUsername, avatarURL)
        .setFooter(`If this takes longer than 30 seconds contact a ${clientUsername} Admin`, avatarURL)
        .setTimestamp()
        .setColor("YELLOW")
        .setTitle(`Pending`)
        .setDescription(`Your request is pending.`)
    const msg = await message.channel.send(pending)


    if(alreadyInDB === true){ // If user is already in the database and just needs roles
        if(client.hasRole(message.member, message.settings.verifiedRole.value) == true){ // Has roles. doesn't need to run this again
            const embed = new MessageEmbed()
                .setAuthor(clientUsername, avatarURL)
                .setFooter(clientUsername, avatarURL)
                .setTimestamp()
                .setColor("RED")
                .setTitle(`Already Verified`)
                .setDescription(`You already are in our database and have the verified roles!`)
            await msg.edit({embed})
        } else { // Needs roles
            const rawdata = await client.database.verify.read(message.author.id);
            const data = rawdata[1]
            if(groupJoin == true) {
                if(groupID == undefined || client.isNum(groupID) == false) {msg.delete(); return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid group id.`)}
                const groupRank = await noblox.getRankInGroup(groupID, data.RobloxID)
                if(groupRank == 0){
                    const groupEmbed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(`You aren't in the group!`)
                        .setDescription(`The roblox user: \`${data.RobloxUsername}\` was not found in the group: https://www.roblox.com/groups/${groupID}.`)
                        .setAuthor(clientUsername, avatarURL)
                        .setFooter(clientUsername, avatarURL)
                        .setTimestamp()
                    return msg.edit(groupEmbed)
                }
            }
            message.member.roles.add(verifiedRole);
            const updatedName = await noblox.getUsernameFromId(data.RobloxID);
            try {
                if(unverifiedRole !== undefined || message.member.roles.get(unverifiedRole.id)) message.member.roles.remove(unverifiedRole);
            } catch (error) {    
                // Probably didn't have the role
            }
            try {
                if(setnick == true) {
                    if(message.author.id !== message.guild.ownerID);{
                        if((message.member.roles.highest >= message.guild.members.cache.get(client.user.id).roles.highest) == false) {
                            message.member.setNickname(updatedName)
                        }
                    }
                }
            } catch (error) {}
            const thumbnailRaw = await client.apis.https.get(`https://thumbnails.roblox.com/v1/users/avatar?format=Png&isCircular=false&size=720x720&userIds=${data.RobloxID}`)
            const thumbURL = thumbnailRaw.data[0].imageUrl
            const embed = new MessageEmbed()
                .setAuthor(clientUsername, avatarURL)
                .setFooter(clientUsername, avatarURL)
                .setTimestamp()
                .setColor(client.embedColour("safe"))
                .setTitle(`Successfully Verified`)
                .setDescription(`\`${message.author.tag}\` has verified as \`${updatedName}\``)
                .setThumbnail(thumbURL)
            msg.edit(embed)
            logs.send(embed)
        }
    }else{ // User needs to verify themself
        const welcome = new MessageEmbed()
            .setAuthor(clientUsername, avatarURL)
            .setFooter(clientUsername, avatarURL)
            .setTimestamp()
            .setColor(client.embedColour("safe")) 
            .setTitle(`Welcome! ${message.author.username} to **${message.guild.name}**!`)
            .setDescription(`Welcome to ${message.guild.name}. In order to verify yourself`)

        const IDS = await checkAPI(message.author.id)
        message.channel.send(IDS)
        if(IDS.length == 0) return statusVerification();
        // API verification

        
    }
    async function checkAPI(discordID){
        const ids = []
        const rover = await client.apis.rover(discordID);
        const bloxlink = await client.apis.bloxlink(discordID);
        if(rover !== undefined) ids.push(rover.id);
        if(bloxlink !== undefined) ids.push(bloxlink.id);
        return ids
    }
    async function statusVerification(){
        
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["getroles"],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "Verify",
    usage: `${filename}`
};
