const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
const noblox = require("noblox.js")
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`${client.config.emojis.exclamation} This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    const verifiedRole = client.getRole(message.guild, message.settings.verifiedRole.value)
    if(verifiedRole == undefined) return message.channel.send(`${client.config.emojis.x} This guild's configuration hasn't been properly set up. please set a valid verified role.`);
    
    if(!args[0]){
        update(message.member);
    } else {
        if(level < 2) return message.channel.send(`${client.config.emojis.x} Updating users can only be done as a guild administrator.`)
        const rawuser = client.findUser(message, args[0])
        if(rawuser[0] == false) return message.channel.send(`${rawuser[1]}`)
        
        const user = rawuser[1]
        update(user);
    }
    async function update(member){
        if(member.user.id == member.guild.ownerID) return message.channel.send(`${client.config.emojis.x} Cannot update the server owner`)
        const DBData = await client.database.verify.read(member.user.id)
        if(DBData[0] == false) return message.channel.send(`${client.config.emojis.exclamation}${DBData[1]}`)
        const dbInfo = DBData[1];
        member.roles.cache.forEach(async role => {
            if(role.name !== "@everyone"){
                try{ await member.roles.remove(role); } catch(err) {}
            }
        })
        member.roles.add(verifiedRole)
        if(settings.setnick.value == true) setNick(member, dbInfo.RobloxUsername);
        if(settings.findRoles.value == true) addRoles(member, dbInfo.RobloxID)
        bindedRoles(member, dbInfo.RobloxID)
        message.channel.send(`${client.config.emojis.check} Successfully Updated \`\`${member.displayName}\`\``)
    }
    async function setNick(member, nick){
        try {
            member.setNickname(nick)
        } catch (error) {
            
        }
    }
    async function addRoles(member, robloxID){
        try {
            if(message.settings.findRoles.value == true){
                const groupID = message.settings.groupID.value
                if(groupID == undefined) return;
                const rank = await noblox.getRankNameInGroup(groupID, robloxID);
                if(rank == "Guest") return;
                message.guild.roles.cache.forEach(role => {
                    if(role.name.toLowerCase() == rank.toLowerCase()){
                        member.roles.add(role);
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    async function bindedRoles(member, robloxID){
        const binds = settings["binds"].value
        const groupID = settings.groupID.value
        if(groupID == undefined) return;
        const rank = await noblox.getRankInGroup(groupID, robloxID);
        if(rank == 0) return;
        binds.forEach(bind => {
            if(bind.rblx == rank) member.roles.add(member.guild.roles.cache.get(bind.discord))
        })
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "",
    usage: `${filename} [User]`
};
