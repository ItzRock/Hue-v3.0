module.exports = (client) => {

    const MongoClient = require('mongodb').MongoClient;
    const url = client.config.database[0]
    const dbName = client.config.database[1]
    const collection = "economies";
    client.database.economy = {
        // Wallet
        newUser = async (userID) => {
            let promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, mongoClient) {
                    const db = mongoClient.db(dbName);
                    let items = { DiscordID: userID.toString(), Wealth: "0", Bank: "0", BankCap: "0"};
                    db.collection(collection).insertOne(items, function(err, res) {
                        if (err) resolve(err);
                        resolve(true)
                    });
                });
            });
            return promise.then((value) => {
                return value
            }); 
        },

        setMoney = async (userID, amount) => {
            let promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, mongoClient) {
                    const db = mongoClient.db(dbName);
                    let myquery  = { DiscordID: userID.toString() };
                    let newvalues = { $set: {Wealth: money} };
                    db.collection(collection).updateOne(myquery, newvalues, function(err, res) {
                        if (err) resolve([false, err]);
                        resolve([true])
                    });
                });
            });
            return promise.then((value) => {
                return value
            });
        },
        addMoney = (userID, amount) => {
        
        },
        remMoney = (userID, amount) => {
        
        },
        read = async (userID) => {
            let promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, mongoClient) {
                    const db = mongoClient.db(dbName);
                    let query = { DiscordID: userID.toString() };
                    db.collection(collection).find(query).toArray(async function(err, result) {
                        if (err) throw err;
                        if(result.length > 1){
                            resolve("lmao what")
                        } else if(result.length < 1){
                            const result = await client.database.economy.newUser(userID)
                            if(result) resolve(await client.database.economy.read(userID))
                        } else resolve(result[0])
                    });
                });
            });
            return promise.then((value) => {
                return value
            }); 
        },

        // Bank
    }
}