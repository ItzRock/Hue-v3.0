module.exports = (client) => {
    const MongoClient = require('mongodb').MongoClient;
    const url = client.config.database[0]
    const dbName = client.config.database[1]
    client.database.users.read = function(DiscordID){
        const data = new Promise((resolve, reject) => {
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client){
                const database = client.db(dbName)
                const query = { discordID: DiscordID.toString() };
                database.collection("users").find(query).toArray(function(err, results) {
                    if(err) resolve(err)
                    else resolve(results)
                })
            })
        })
        return data.then((data) =>{
            return data
        })
    }
    client.database.users.getAdmins = async function(DiscordID){
        const promisedata = new Promise((resolve, reject) => {
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client){
                const database = client.db(dbName)
                database.collection("users").find().toArray(function(err, results) {
                    if(err) resolve(err)
                    else resolve(results)
                })
            })
        })
        const allowedRoles = ["Hue Administrator", "Hue Operator"]
        const data = await Promise.resolve(promisedata)
        const usersIDs = []
        data.forEach(user =>{
            if(allowedRoles.includes(user.role)) usersIDs.push(user.discordID)
        })
        return usersIDs
    }
}