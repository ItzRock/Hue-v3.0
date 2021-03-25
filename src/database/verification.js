const { MessageEmbed } = require("discord.js")
module.exports = (client) => {
    const MongoClient = require('mongodb').MongoClient;
    const url = client.config.database[0]
    const dbName = client.config.database[1]
    const noblox = require("noblox.js")
    client.database.verify = {}
    const collectionName = "verification databases"
    // Find a user in the database
    client.database.verify.read = function(discordID){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                let query = { DiscordID: discordID.toString() };
                db.collection(collectionName).find(query).toArray(async function(err, result) {
                    if (err) resolve([false, `${err.name}: ${err.message}`]);
                    if(result.length < 1){
                        resolve([false, " Error: This user was not found in the database."])
                    } else {
                        result[0].RobloxUsername = await noblox.getUsernameFromId(result[0].RobloxID)
                        resolve([true, result[0]])
                    }
                    return client.close()
                });
            });
        });
        return promise.then((value) => {
            return value
        });  
    }
    client.database.verify.readROBLOXID = function(robloxID){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                let query = { RobloxID: robloxID.toString() };
                db.collection(collectionName).find(query).toArray(async function(err, result) {
                    if (err) resolve([false, `${err.name}: ${err.message}`]);
                    if(result.length < 1){
                        resolve([false, " Error: This user was not found in the database."])
                    } else {
                        result[0].RobloxUsername = await noblox.getUsernameFromId(result[0].RobloxID)
                        resolve([true, result[0]])
                        return client.close()
                    }
                });
            });
        });
        return promise.then((value) => {
            return value
        });  
    }
    // Remove a user from the database
    client.database.verify.remove = function(discordID){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                let query = { DiscordID: discordID.toString() };
                db.collection(collectionName).deleteOne(query, function(err, obj) {
                    if (err) resolve([false, `${err.name}: ${err.message}`]);
                    resolve([true, ' Successfully Removed'])
                    return client.close()
                });
            });
        });
        return promise.then((value) => {
            return value
        });
    }
    // Update a user in the database
    client.database.verify.update = async function(robloxID){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, client) {
                const db = client.db(dbName);
                let myquery  = { RobloxID: robloxID.toString() };
                const newUsername = await noblox.getUsernameFromId(robloxID)
                let newvalues = { $set: {RobloxUsername: newUsername} };
                db.collection(collectionName).updateOne(myquery, newvalues, function(err, res) {
                    if (err) resolve([false, `${err.name}: ${err.message}`]);
                    resolve([true, 'Successfully Updated Item'])
                    return client.close()
                });
            });
        });
        return promise.then((value) => {
            return value
        });
    }
    // count query
    client.database.verify.count = function(discordID){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                let query = { DiscordID: discordID.toString() };
                db.collection(collectionName).find(query).toArray(function(err, result) {
                    if (err) resolve([false, `${err.name}: ${err.message}`]);
                    resolve(result.length)
                    return client.close()
                });
            });
        });
        return promise.then((value) => {
            return value
        });       
    }
    client.database.verify.countALL = function(){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                db.collection(collectionName).find().toArray(function(err, result) {
                    if (err) resolve([false, `${err.name}: ${err.message}`]);
                    resolve(result.length)
                    return client.close()
                });
            });
        });
        return promise.then((value) => {
            return value
        });       
    }
    // Write to database
    client.database.verify.write = function(username, robloxID, discordID){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                let items = { RobloxUsername: username.toString(), DiscordID: discordID.toString(), RobloxID: robloxID.toString()};
                db.collection(collectionName).insertOne(items, function(err, res) {
                    if (err) resolve([false, `${err.name}: ${err.message}`]);
                    resolve([true, 'Successfully Added'])
                    return client.close()
                });
            });
        });
        return promise.then((value) => {
            return value
        }); 
    }

    client.database.verify.event = async function(DiscordTag, RobloxUsername, RobloxID, type, ExtraDetails){
        client.logger.verify(`${DiscordTag} verified as: ${RobloxUsername}. Using: ${type}. Extra Details: ${ExtraDetails}`)
        const clientUser = client.user.username
        const avatar = client.user.avatarURL()
        const thumbnailRaw = await client.apis.https.get(`https://thumbnails.roblox.com/v1/users/avatar?format=Png&isCircular=false&size=720x720&userIds=${RobloxID}`)
        const thumbURL = thumbnailRaw.data[0].imageUrl
        let description = `\`${DiscordTag}\` verified as: \`${RobloxUsername}\`.\nUsing: \`${type}\`.\nExtra Details: \`${ExtraDetails}\``
        const embed = new MessageEmbed()
            .setAuthor(`${clientUser} Verification System`, avatar)
            .setFooter(`${clientUser}`, avatar)
            .setColor(client.embedColour())
            .setTimestamp()
            .setThumbnail(thumbURL)
            .setTitle(`New Verification Entry`)
            .setDescription(description);
        client.channels.fetch(client.config.logChannel).then((c) => {c.send({embed})});
    }
}