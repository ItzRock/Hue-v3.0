module.exports = (client) => {
    const MongoClient = require('mongodb').MongoClient;
    const url = 'mongodb://localhost:27017';
    const dbName = 'Hue';
    client.items = {}

    client.items.readAll = function(){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                db.collection("items").find().toArray(function(err, result) {
                    if (err) throw err;
                    return resolve(result)
                });
            });
        });
        return promise.then((value) => {
            return value
        });  
    }

    client.items.remove = function(discordID){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                let query = { DiscordID: discordID.toString() };
                db.collection("items").deleteOne(query, function(err, obj) {
                    if (err) throw err;
                    return resolve('Successfully Removed')
                });
            });
        });
        return promise.then((value) => {
            return value
        });
    }
    /*
        User Inventory
    */
    client.Inventory = {}

    // Add an item

    client.Inventory.add = async function(item, discordID){
        const rawItems = await client.items.readAll()
        const items = []
        rawItems.forEach(i => {
            items.push(i.Name)
        });
        if(items.includes(item) == false) return false;
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                let items = { DiscordID: discordID.toString(), ItemName: item.toString()};
                db.collection("inventories").insertOne(items, function(err, res) {
                    if (err) console.log(err);;
                    return resolve(true)
                });
            });
        });
        return promise.then((value) => {
            return value
        }); 
    } 
    client.Inventory.fetch = async function(discordID){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                let query = { DiscordID: discordID.toString() };
                db.collection("inventories").find(query).toArray(function(err, result) {
                    if (err) throw err;
                    return resolve(result)
                });
            });
        });
        return promise.then((value) => {
            return value
        });  
    }
    client.Inventory.remove = async function(item, discordID){
        let promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                const db = client.db(dbName);
                let query = { DiscordID: discordID.toString(), ItemName: item.toString() };
                db.collection("inventories").findOneAndDelete(query, function(err, obj) {
                    if (err) resolve(err);
                    return resolve(true)
                });
            });
        });
        return promise.then((value) => {
            return value
        });  
    }
}