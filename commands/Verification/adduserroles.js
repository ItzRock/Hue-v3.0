const { MessageEmbed } = require('discord.js');
const { raw } = require('express');
const noblox = require("noblox.js")
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    const settings = message.settings;
    if(settings["verification"].value !== true) return message.channel.send(`This command is only available in servers with ${client.user.username}'s verification system enabled.`)
    
    if(!args[0]) return message.channel.send(`Invalid arguments. Missing user: ${client.getArgs(filename)}`)
    const rawuser = client.findUser(message, args[0])
    const user = rawuser[1]
    if(rawuser[0] == false) return message.channel.send(`${user[1]}`);

    const rawdata = await client.database.verify.read(user.user.id)
    if(rawdata[0] == false) return message.channel.send(`${rawdata[1]}`)

    const verifiedRole = client.getRole(message.guild, message.settings.verifiedRole.value)
    const unverifiedRole = client.getRole(message.guild, message.settings.unverifiedRole.value)
    if(verifiedRole == undefined) return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid verified role.`);
    

    const data = rawdata[1]
    const id = data.RobloxID
    const updatedName = await require("noblox.js").getUsernameFromId(data.RobloxID);
    addRoles(updatedName)
    findRolesinGuild(id)
    function addRoles(username){
        user.roles.add(verifiedRole);
        try {
            if(unverifiedRole !== undefined || user.roles.get(unverifiedRole.id)) user.roles.remove(unverifiedRole);
        } catch (error) {    
            // Probably didn't have the role
        }
        try {
            if(setnick == true) {
                if(user.user.id !== message.guild.ownerID);{
                    if((user.roles.highest >= message.guild.members.cache.get(client.user.id).roles.highest) == false) {
                        user.setNickname(username)
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
                        user.roles.add(role);
                    }
                })
            }
        } catch (error) {
            console.log(`\`\`\`js\n${error}\`\`\``)
        }
    }
    message.channel.send(`Added Roles`)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "adds the roles to already verified users for server admins",
    usage: `${filename} <user>`
};
