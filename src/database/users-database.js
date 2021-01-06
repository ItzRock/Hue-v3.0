module.exports = (client) => {
    client.database = {}
    client.database.users = {}
    const MongoClient = require('mongodb').MongoClient;
    const url = 'mongodb://localhost:27017';
    const dbName = 'Hue';
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
}