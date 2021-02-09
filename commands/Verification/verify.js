// Middle of writing this, roblox started slowly phasing out status' so anytime it refers to set your status, its actually last line of desciption
const { MessageEmbed } = require('discord.js');
const noblox = require("noblox.js")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const avatarURL = client.user.avatarURL()
    const clientUsername = client.user.username;
    const settings = message.settings;
    const guild = message.guild;
    if(settings["verification"].value !== true) return message.channel.send(`This command is only available in servers with ${client.user.username}'s verification system enabled.`)
   
    const possibleKeys = ["green", "alpha", "delta", "charlie", "bravo", "yellow", "apple", "banana"]
    const status = client.shuffle(possibleKeys).join(" ")

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
        .setFooter(clientUsername, avatarURL)
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
            findRolesinGuild(data.RobloxID)
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
            if(logs !== undefined) logs.send(embed)
        } 
    }else{ // User needs to verify thyself
        const IDS = await checkAPI(message.author.id)
        if(IDS.length == 0) return statusVerification();
        // API verification
        const username = await noblox.getUsernameFromId(IDS[0])
        const avatar = await client.apis.roblox.avatarURL(IDS[0])
        await msg.delete();
        const wouldYouLikeToVerifyAsX = new MessageEmbed()
            .setAuthor(clientUsername, avatarURL)
            .setFooter(clientUsername, avatarURL)
            .setTimestamp()
            .setThumbnail(avatar)
            .setColor(client.embedColour("safe")) 
            .setTitle(`Possible account found in api!`)
            .setDescription(`Would you like to verify as \`${username}\`. (respond with \`yes\` or \`no\`)`)
        const reply = await client.awaitReply(message, wouldYouLikeToVerifyAsX)
        const agree = ["yes", "y", "obama",]
        if(reply){
            if(agree.includes(reply)){
                if(groupJoin == true){
                    if(await isInGroup(IDS[0]) == true) return verify(IDS[0], username, avatar, "API Verification.");
                    const groupEmbed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(`You aren't in the group!`)
                        .setDescription(`The roblox user: \`${username}\` was not found in the group: https://www.roblox.com/groups/${groupID}.`)
                        .setAuthor(clientUsername, avatarURL)
                        .setFooter(clientUsername, avatarURL)
                        .setTimestamp()
                    return message.channel.send(groupEmbed)
                } else{
                    return verify(IDS[0], username, avatar, "API Verification.");
                }
            }
            else {
                return statusVerification()
            }
        }
    }
    async function checkAPI(discordID){
        const ids = []
        const rover = await client.apis.rover(discordID);
        const bloxlink = await client.apis.bloxlink(discordID);
        if(rover !== false) ids.push(rover.id);
        if(bloxlink !== false) ids.push(bloxlink.id);
        return ids
    }
    async function statusVerification(){
        const welcome = new MessageEmbed()
            .setAuthor(clientUsername, avatarURL)
            .setFooter(clientUsername, avatarURL)
            .setTimestamp()
            .setColor(client.embedColour("safe")) 
            .setThumbnail(message.guild.iconURL())
            .setTitle(`Welcome \`${message.author.username}\` to **${message.guild.name}**!`)
            .setDescription(`Welcome to ${message.guild.name}. In order to verify yourself please respond with your Roblox username`)
        try {
            await msg.delete()
        } catch (error) { /* Already Deleted */  }
        const reply = await client.awaitReply(message, welcome)
        if(reply){
            const pendingMSG = await message.channel.send(pending)
            const raw = reply;
            try {
                const test = await noblox.getIdFromUsername(raw);
            } catch (error) {
                const errorEmbed = new MessageEmbed()
                    .setAuthor(clientUsername, avatarURL)
                    .setFooter(clientUsername, avatarURL)
                    .setTimestamp()
                    .setColor("RED") 
                    .setTitle(`An Error has occurred!`)
                    .setDescription(`${error.name}: ${error.message}`)
                await pendingMSG.delete()
                return message.channel.send(errorEmbed)
            }
            const ID = await noblox.getIdFromUsername(raw);
            const Username = await noblox.getUsernameFromId(ID);
            const avatar = await client.apis.roblox.avatarURL(ID)
            await pendingMSG.delete()
            if(groupJoin == true){
                if(await isInGroup(ID) == true) return setYourStatus(ID, Username, avatar);
                const groupEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setTitle(`You aren't in the group!`)
                    .setDescription(`The roblox user: \`${Username}\` was not found in the group: https://www.roblox.com/groups/${groupID}.`)
                    .setAuthor(clientUsername, avatarURL)
                    .setFooter(clientUsername, avatarURL)
                    .setTimestamp()
                return message.channel.send(groupEmbed)
            } else{
                return setYourStatus(ID, Username, avatar);
            }
        }
    }
    async function setYourStatus(ID, Username, avatar){
        const setStatusEmbed = new MessageEmbed()
            .setAuthor(clientUsername, avatarURL)
            .setFooter(clientUsername, avatarURL)
            .setTimestamp()
            .setColor(client.embedColour("safe"))
            .setThumbnail(avatar)
            .setTitle(`Part 2: Modify your About section of your profile`)
            .setDescription(`In order to prove you own this account, please either set or set the last line of your [**description / about**](https://www.roblox.com/users/${ID}) to\n\`${status}\`\nand then reply with \`done\` once you have done so, [Example](http://cdn.itzrock.xyz/hue/example.png)`)
        const waitForResponse = await client.awaitReply(message, setStatusEmbed, 300000);
        if(waitForResponse){
            return checkDescriptionIfCorrect(ID, Username, avatar)
        }
    }
    async function checkDescriptionIfCorrect(ID, Username, avatar){
        const blurb = await noblox.getBlurb({userId: ID})
        const splitBlurb = blurb.split("\n")
        const lastLine = splitBlurb[splitBlurb.length - 1]
        if(lastLine == status){
            return verify(ID, Username, avatar, "Standard Verification")
        }else {

        const invalidStatus = new MessageEmbed()
            .setAuthor(clientUsername, avatarURL)
            .setFooter(clientUsername, avatarURL)
            .setTimestamp()
            .setColor("RED")
            .setTitle(`Error`)
            .setDescription(`The last line did not match, Expected: \`${status}\`\n Got: \`${lastLine}\`\n**If it was tagged please try again.**`)
        return message.channel.send(invalidStatus);
        }
    }
    async function verify(id, username, thumbURL, method){
        const embed = new MessageEmbed()
            .setAuthor(clientUsername, avatarURL)
            .setFooter(clientUsername, avatarURL)
            .setTimestamp()
            .setColor(client.embedColour("safe"))
            .setTitle(`Successfully Verified`)
            .setDescription(`\`${message.author.tag}\` has verified as \`${username}\``)
            .setThumbnail(thumbURL)
        if(logs !== undefined) logs.send(embed)
        message.channel.send(embed)
        client.database.verify.event(message.author.tag, username, id, method, `GUILD: ${message.guild.name} | ID: ${id}`)
        addRoles(username)
        findRolesinGuild(id)
        // Add to db here soon
        await client.database.verify.write(username, id, message.author.id)
    }

    function addRoles(username){
        message.member.roles.add(verifiedRole);
        try {
            if(unverifiedRole !== undefined || message.member.roles.get(unverifiedRole.id)) message.member.roles.remove(unverifiedRole);
        } catch (error) {    
            // Probably didn't have the role
        }
        try {
            if(setnick == true) {
                if(message.author.id !== message.guild.ownerID);{
                    if((message.member.roles.highest >= message.guild.members.cache.get(client.user.id).roles.highest) == false) {
                        message.member.setNickname(username)
                    }
                }
            }
        } catch (error) {}   
    }
    async function findRolesinGuild(robloxID){
        try {
            if(message.settings.findRoles.value == true){
                const groupID = message.settings.groupID.value
                if(groupID == undefined) return;
                const rank = await noblox.getRankNameInGroup(groupID, robloxID);
                if(rank == "Guest") return;
                message.guild.roles.cache.forEach(role => {
                    if(role.name.toLowerCase() == rank.toLowerCase()){
                        message.member.roles.add(role);
                    }
                })
            }
        } catch (error) {
            console.log(`\`\`\`js\n${error}\`\`\``)
        }
    }
    async function isInGroup(id){
        if(groupID == undefined || client.isNum(groupID) == false) {msg.delete(); return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid group id.`)}
        const groupRank = await noblox.getRankInGroup(groupID, id)
        return groupRank !== 0
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
