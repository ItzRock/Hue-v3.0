module.exports = (client) => {
    const MongoClient = require('mongodb').MongoClient;
    const url = client.config.database[0]
    const dbName = client.config.database[1]
    const collections = "command blacklists"
    client.database.cmdBlacklist = {
        isBanned: async (userID, commandName) => {
            let promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, mongoclient) {
                    const db = mongoclient.db(dbName);
                    let query = { DiscordID: userID.toString() };
                    db.collection(collections).find(query).toArray(function(err, result) {
                        if(result.length == 0) return resolve(false)
                        if(commandName == undefined) return resolve(result[0])
                        if(result[0].All_Commands === true) return resolve(true);
                        if(result[0].Commands.includes(commandName.toLowerCase())) return resolve(true);
                        else return resolve(false)

                    });
                });
            });
            const value = await promise;
            return value;
        },
    }
}