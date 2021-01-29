const { MessageEmbed } = require('discord.js');
module.exports = (client) => {
    const MongoClient = require('mongodb').MongoClient;
    const url = client.config.database[0]
    const dbName = client.config.database[1]
    const collections = "global bans discords"
    client.blacklist = {
        ban: async (userID, reason, message) => {
            client.blacklist.event(userID, reason, message)
            let promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, mongoclient) {
                    const db = mongoclient.db(dbName);
                    let items = { DiscordID: userID.toString(), Reason: reason };
                    db.collection(collections).insertOne(items, function(err, res) {
                        if (err) resolve([false, `${err.name}: ${err.message}`]);
                        client.guilds.cache.forEach(guild => {
                            client.logger.log(`Banned ${userID} from ${guild.name}`)
                            guild.members.ban(userID, {reason: reason}).catch(console.error);
                        });
                        resolve([true, 'Successfully Added'])
                    });
                });
            });
            const value = await promise;
            return value; 
        },
        unban: async (userID) => {
            let promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, mongoclient) {
                    const db = mongoclient.db(dbName);
                    let query = { DiscordID: userID.toString() };
                    db.collection(collections).deleteOne(query, function(err, obj) {
                        if (err) resolve([false, `${err.name}: ${err.message}`]);
                        resolve([true, 'Successfully Removed'])
                    });
                });
            });
            const value = await promise;
            return value;
        },
        read: async (userID) => {
            let promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, mongoclient) {
                    const db = mongoclient.db(dbName);
                    let query = { DiscordID: userID.toString() };
                    db.collection(collections).find(query).toArray(function(err, result) {
                        if (err) resolve([false, `${err.name}: ${err.message}`]);
                        if(result.length == 0) return resolve([false, "Not found."])
                        resolve([true, result[0]])
                    });
                });
            });
            const value = await promise;
            return value;
        },
        event: async (userID, reason, message) => {
            const devLogging = await client.channels.fetch(client.config.logChannel);
            const target = await client.users.cache.get(userID);
            if(target === undefined){
                const banEmbed = new MessageEmbed()
                    .setAuthor(client.user.username, client.user.avatarURL())
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setColor(client.embedColour())
                    .setTimestamp()
                    .setTitle(`Globally Banned User ID: \`${userID}\` from all servers.`)
                    .setDescription(`\`${userID}\` has been banned from all servers, no information was able to be grabbed from the user.\nReason: ${reason}`)
                message.channel.send(banEmbed)
                return devLogging.send(banEmbed)
            }else {
                const banEmbed = new MessageEmbed()
                    .setAuthor(client.user.username, client.user.avatarURL())
                    .setFooter(client.user.username, client.user.avatarURL())
                    .setColor(client.embedColour())
                    .setTimestamp()
                    .setTitle(`Globally Banned User: \`${target.username}\` from all servers.`)
                    .setThumbnail(target.avatarURL())
                    .setDescription(`User Information`)
                    .addFields(
                        {name: "User Tag", value: target.tag, inline: true},
                        {name: "Global Ban Reason", value: reason, inline: true},
                        {name: "User ID", value: target.id, inline: true},
                    )
                message.channel.send(banEmbed)
                return devLogging.send(banEmbed)

            }
        }
    }
}