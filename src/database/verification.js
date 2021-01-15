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
                db.collection(collectionName).find(query).toArray(function(err, result) {
                    if (err) throw err;
                    if(result.length > 1){
                        resolve([false, 'Error: Multible Instances Found.'])
                    } else if(result.length < 1){
                        resolve([false, "Error: No User Found."])
                    } else resolve([true, result[0]])
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
                    if (err) throw err;
                    resolve([true, 'Successfully Removed'])
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
                    if (err) throw err;
                    resolve([true, 'Successfully Updated Item'])
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
                    if (err) throw err;
                    resolve(result.length)
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
                    if (err) throw err;
                    resolve([true, 'Successfully Added'])
                });
            });
        });
        return promise.then((value) => {
            return value
        }); 
    }
}