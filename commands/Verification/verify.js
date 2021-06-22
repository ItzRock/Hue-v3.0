// Middle of writing this, roblox started slowly phasing out status' so anytime it refers to set your status, its actually last line of desciption
const { MessageEmbed } = require('discord.js');
const noblox = require("noblox.js")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    try {
        const avatarURL = client.user.avatarURL()
        const clientUsername = client.user.username;
        const settings = message.settings;
        if(settings["verification"].value !== true) return message.channel.send(`${client.config.emojis.exclamation} This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    
        const possibleKeys = ["alpha", "delta", "bravo", "yellow", "apple", "banana", "verify", "hue"]
        const status = client.shuffle(possibleKeys).join(" ")

        const verifiedRole = client.getRole(message.guild, message.settings.verifiedRole.value)
        const unverifiedRole = client.getRole(message.guild, message.settings.unverifiedRole.value)
        if(verifiedRole == undefined) return message.channel.send(`${client.config.emojis.x} This guild's configuration hasn't been properly set up. please set a valid verified role.`);
        
        const groupID = settings.groupID.value
        const setnick = settings.setnick.value
        const groupJoin = settings.GroupJoinRequired.value
        
        const logs = client.getChannel(message.guild, message.settings.logs.value);

        const alreadyInDB = await client.database.verify.count(message.author.id) >= 1
        let extraDetails = ``
        const pending = new MessageEmbed()
            .setAuthor(clientUsername, avatarURL)
            .setFooter(clientUsername, avatarURL)
            .setTimestamp()
            .setColor("YELLOW")
            .setTitle(`${client.config.emojis.exclamation} Pending`)
            .setDescription(`Your request is pending.`)
        const msg = await message.channel.send(pending)


        if(alreadyInDB === true){ // If user is already in the database and just needs roles
            if(client.hasRole(message.member, message.settings.verifiedRole.value) == true){ // Has roles. doesn't need to run this again
                const rawdata = await client.database.verify.read(message.author.id);
                const data = rawdata[1]
                const thumb = (await noblox.getPlayerThumbnail([data.RobloxID], 720, "png", false))[0].imageUrl
                const embed = client.defaultEmbed()
                    .setColor("RED")
                    .setThumbnail(thumb)
                    .setTitle(`${client.config.emojis.x} Already Verified as \`${data.RobloxUsername}\``)
                    .setDescription(`If you want to verify as another account run \`;unlink\`.\nOr if you want to fix your roles / nick run \`;update\`.`)
                await msg.edit({embed})
            } else return verifiedNeedRoles() 
        }else{ // User needs to verify thyself
            try{
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
                    .setTitle(`${client.config.emojis.exclamation} Possible account found in api!`)
                    .setDescription(`Would you like to verify as \`${username}\`. (respond with \`yes\` or \`no\`)`)
                const reply = await client.awaitReply(message, wouldYouLikeToVerifyAsX)
                const agree = ["yes", "y", "obama",]
                if(reply){
                    if(agree.includes(reply.toLowerCase())){
                        if(groupJoin == true){
                            if(await isInGroup(IDS[0]) == true) return verify(IDS[0], username, avatar, "API Verification");
                            const groupEmbed = new MessageEmbed()
                                .setColor("RED")
                                .setTitle(`${client.config.emojis.x} You aren't in the group!`)
                                .setDescription(`The roblox user: \`${username}\` was not found in the group: https://www.roblox.com/groups/${groupID}.`)
                                .setAuthor(clientUsername, avatarURL)
                                .setFooter(clientUsername, avatarURL)
                                .setTimestamp()
                            return message.channel.send(groupEmbed)
                        } else{
                            extraDetails = `${extraDetails}\nVerified By API`
                            return verify(IDS[0], username, avatar, "API Verification");
                        }
                    }
                    else {
                        return statusVerification()
                    }
                }
            }catch(err){
                return statusVerification();
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
                .setTitle(`${client.config.emojis.check} Welcome \`${message.author.username}\` to **${message.guild.name}**!`)
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
                        .setTitle(`${client.config.emojis.x} An Error has occurred!`)
                        .setDescription(`${error.name}: ${error.message}`)
                    await pendingMSG.delete()
                    return message.channel.send(errorEmbed)
                }
                const ID = await noblox.getIdFromUsername(raw);
                const Username = await noblox.getUsernameFromId(ID);
                const avatar = await client.apis.roblox.avatarURL(ID)
                if(!client.activeVerifications.has(ID.toString())){
                    client.activeVerifications.set(ID.toString(), {robloxID: ID.toString(), user: message.author})
                }
                await pendingMSG.delete()
                if(groupJoin == true){
                    if(await isInGroup(ID) == true) return setYourStatus(ID, Username, avatar) //chooseMethod(ID, Username, avatar);
                    const groupEmbed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(`${client.config.emojis.x} You aren't in the group!`)
                        .setDescription(`The roblox user: \`${Username}\` was not found in the group: https://www.roblox.com/groups/${groupID}.`)
                        .setAuthor(clientUsername, avatarURL)
                        .setFooter(clientUsername, avatarURL)
                        .setTimestamp()
                    return message.channel.send(groupEmbed)
                } else{
                    return setYourStatus(ID, Username, avatar) //chooseMethod(ID, Username, avatar);
                }
            }
        }

        async function chooseMethod(ID, Username, avatar){
            const embed = client.defaultEmbed()
                .setTitle(`Step 2. Pick a method of verification.`)
                .setDescription(`**Please pick a method of verification.**\nReact with 🎮 for game verification.\nReact with 📄 for description verification.`)
            
            const msg = await message.channel.send(embed)
            msg.react("🎮"); msg.react("📄");
            const filter = (reaction, user) => {
                return ['🎮', '📄'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            msg.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"]}).then(async collected => {
                const reaction = collected.first();

                if (reaction.emoji.name === '🎮') {
                    gameVerification(ID, Username, avatar)
                    return await msg.delete()
                } else {
                    setYourStatus(ID, Username, avatar)
                    return await msg.delete()
                }
            }).catch(collected => {
            message.reply('Timeout error: to continue verification and try again.');
            });
        }

        async function gameVerification(ID, Username, avatar){
            const joinGame = client.defaultEmbed()
                .setTitle("Step 3: Game Verification")
                .setDescription(`In order to verify [please join this game here](https://www.roblox.com/games/6555983329/Hue-Verification) and follow the provided steps. Once finished you should be automatically verified.`);
            message.channel.send(joinGame)
            const interval = setInterval(check, 250)
            function check(){
                if(client.clearToVerify.has(message.author.id)){
                    const data = client.clearToVerify.get(message.author.id)
                    if(ID.toString() == data.robloxID){
                        clearInterval(interval)
                        client.clearToVerify.delete(message.author.id)
                        return verify(ID, Username, avatar, "Game Verification")
                    } else {
                        client.clearToVerify.delete(message.author.id)
                        return message.channel.send(`Error: the Roblox ID sent back did not match the one fetched locally. Please run \`${message.settings.prefix.value}verify\` again`)
                    }
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
                .setTitle(`Step 3: Modify your About section of your profile`)
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
            if(client.activeVerifications.has(ID.toString())){
                client.activeVerifications.delete(ID.toString())
            }
            const invalidStatus = new MessageEmbed()
                .setAuthor(clientUsername, avatarURL)
                .setFooter(clientUsername, avatarURL)
                .setTimestamp()
                .setColor("RED")
                .setTitle(`${client.config.emojis.x} Error`)
                .setDescription(`The last line did not match, Expected: \`${status}\`\n Got: \`${lastLine}\`\n**If it was tagged please try again.**`)
            return message.channel.send(invalidStatus);
            }
        }
        async function verify(id, username, thumbURL, method){
            if(client.activeVerifications.has(id.toString())){
                client.activeVerifications.delete(id.toString())
            }
            if(extraDetails == ``) extraDetails = `\`None\``
            else extraDetails = `\n\`\`\`\n${extraDetails}\n\`\`\``
            const embed = new MessageEmbed()
                .setAuthor(clientUsername, avatarURL)
                .setFooter(clientUsername, avatarURL)
                .setTimestamp()
                .setColor(client.embedColour("safe"))
                .setTitle(`${client.config.emojis.check} Successfully Verified`)
                .setDescription(`\`${message.author.tag}\` has verified as \`${username}\`\nExtra Details: ${extraDetails}`)
                .setThumbnail(thumbURL)
            client.database.verify.event(message.author.tag, username, id, method, extraDetails, message.guild.name)
            addRoles(username)
            findRolesinGuild(id)
            client.verification.bindRoles(message.member, id)
            // Add to db here soon
            await client.database.verify.write(username, id, message.author.id)

            if(logs !== undefined) logs.send(embed)
            message.channel.send(embed)
        }

        async function addRoles(username){
            try {
                await message.member.roles.add(verifiedRole);
            } catch (error) {
                `${extraDetails}\nCRITICAL ERROR. Failed to add verified Roles for user. (${error.name} : ${error.message})`
            }
            try {
                if(unverifiedRole !== undefined || message.member.roles.get(unverifiedRole.id)) await message.member.roles.remove(unverifiedRole);
            } catch (error) {    
                // Probably didn't have the role
            }
            try {
                if(setnick == true) {
                    if(message.author.id !== message.guild.ownerID);{
                        await message.member.setNickname(username)
                    }
                }
            } catch (error) {
                `${extraDetails}\nFailed to set nickname. (${error.name} : ${error.message})`
            }   
        }
        async function findRolesinGuild(robloxID){
            try {
                if(message.settings.findRoles.value == true){
                    extraDetails = `${extraDetails}\nFind Roles Enabled. Adding Roles.`
                    const groupID = message.settings.groupID.value
                    if(groupID == undefined) return;
                    const rank = await noblox.getRankNameInGroup(groupID, robloxID);
                    if(rank == "Guest") return;
                    message.guild.roles.cache.forEach(role => {
                        if(role.name.toLowerCase() == rank.toLowerCase()){
                            extraDetails = `${extraDetails}\nAdded ${role.name} because it matched their group rank.`
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

        async function verifiedNeedRoles(){ // Needs roles
            const rawdata = await client.database.verify.read(message.author.id);
            const data = rawdata[1]
            if(groupJoin == true) {
                if(groupID == undefined || client.isNum(groupID) == false) {msg.delete(); return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid group id.`)}
                const groupRank = await noblox.getRankInGroup(groupID, data.RobloxID)
                if(groupRank == 0){
                    const groupEmbed = new MessageEmbed()
                        .setColor("RED")
                        .setTitle(`${client.config.emojis.x} You aren't in the group!`)
                        .setDescription(`The roblox user: \`${data.RobloxUsername}\` was not found in the group: https://www.roblox.com/groups/${groupID}.`)
                        .setAuthor(clientUsername, avatarURL)
                        .setFooter(clientUsername, avatarURL)
                        .setTimestamp()
                    return msg.edit(groupEmbed)
                }
            }
            extraDetails = `${extraDetails}\nRecord Found in Hue DB` 
            message.member.roles.add(verifiedRole);
            findRolesinGuild(data.RobloxID)
            client.verification.bindRoles(message.member, data.RobloxID)
            const updatedName = data.RobloxUsername
            addRoles(updatedName)
            const thumbnailRaw = await client.apis.https.get(`https://thumbnails.roblox.com/v1/users/avatar?format=Png&isCircular=false&size=720x720&userIds=${data.RobloxID}`)
            const thumbURL = thumbnailRaw.data[0].imageUrl
            if(extraDetails == ``) extraDetails = `\`None\``
            else extraDetails = `\n\`\`\`\n${extraDetails}\n\`\`\``
            const embed = new MessageEmbed()
                .setAuthor(clientUsername, avatarURL)
                .setFooter(clientUsername, avatarURL)
                .setTimestamp()
                .setColor(client.embedColour("safe"))
                .setTitle(`${client.config.emojis.check} Successfully Verified`)
                .setDescription(`\`${message.author.tag}\` has verified as \`${updatedName}\`\nExtra Details: ${extraDetails}`)
                .setThumbnail(thumbURL);

            msg.edit(embed)
            if(logs !== undefined) logs.send(embed)
        }
    } catch (error) {
        message.channel.send(client.errorEmbed(error))
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
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Verify",
    usage: `${filename}`
};
