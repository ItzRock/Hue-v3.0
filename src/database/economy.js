module.exports = (client) => {

    const MongoClient = require('mongodb').MongoClient;
    const url = client.config.database[0]
    const dbName = client.config.database[1]
    const collection = "economies";
    client.database.economy = {
        // Wallet
        newUser: async (userID) => {
            const promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, mongoClient) {
                    const db = mongoClient.db(dbName);
                    let items = { DiscordID: userID.toString(), Wealth: "0", Bank: "0", BankCap: "0"};
                    db.collection(collection).insertOne(items, function(err, res) {
                        if (err) resolve(err);
                        resolve(true)
                        return mongoClient.close()
                    });
                });
            });
            return promise.then((value) => {
                return value
            }); 
        },
        
        setMoney: async (userID, amount) => {
            await client.database.economy.read(userID)
            const promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, mongoClient) {
                    const db = mongoClient.db(dbName);
                    let myquery  = { DiscordID: userID.toString() };
                    let newvalues = { $set: {Wealth: parseInt(amount)} };
                    db.collection(collection).updateOne(myquery, newvalues, function(err, res) {
                        if (err) resolve([false, err]);
                        resolve([true])
                        return mongoClient.close()
                    });
                });
            });
            return promise.then((value) => {
                return value
            });
        },
        addMoney: async (userID, amount) => {
            const data = await client.database.economy.read(userID)
            const total = Math.floor(parseInt(data.Wealth) + parseInt(amount))
            const promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, mongoClient) {
                    const db = mongoClient.db(dbName);
                    let myquery  = { DiscordID: userID.toString() };
                    let newvalues = { $set: {Wealth: total} };
                    db.collection(collection).updateOne(myquery, newvalues, function(err, res) {
                        if (err) resolve([false, err]);
                        resolve([true])
                        return mongoClient.close()
                    });
                });
            });
            return promise.then((value) => {
                return value
            });            
        },
        remMoney: async (userID, amount) => {
            const data = await client.database.economy.read(userID)
            const total = parseInt(data.Wealth) - parseInt(amount)      
            const promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, mongoClient) {
                    const db = mongoClient.db(dbName);
                    let myquery  = { DiscordID: userID.toString() };
                    let newvalues = { $set: {Wealth: total} };
                    db.collection(collection).updateOne(myquery, newvalues, function(err, res) {
                        if (err) resolve([false, err]);
                        resolve([true])
                        return mongoClient.close()
                    });
                });
            });
            return promise.then((value) => {
                return value
            });  
        },
        read: async (userID) => {
            const promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, mongoClient) {
                    const db = mongoClient.db(dbName);
                    let query = { DiscordID: userID.toString() };
                    db.collection(collection).find(query).toArray(async function(err, result) {
                        if (err) throw err;
                        if(result.length < 1){
                            const result = await client.database.economy.newUser(userID)
                            if(result) return resolve(await client.database.economy.read(userID))
                        } else resolve(result[0])
                        return mongoClient.close()
                    });
                });
            });
            return promise.then((value) => {
                return value
            }); 
        },

        // Bank

        setBank: async (userID, money) =>{
            let promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, mongoClient) {
                    const db = mongoClient.db(dbName);
                    let myquery  = { DiscordID: userID.toString() };
                    let newvalues = { $set: {Bank: money} };
                    db.collection("economies").updateOne(myquery, newvalues, function(err, res) {
                        if (err) resolve([false, err]);
                        else resolve([true])
                        return mongoClient.close()
                    });
                });
            });
            return promise.then((value) => {
                return value
            });
        },
        addBank: async (userID, amount) =>{
            const data = await client.database.economy.read(userID)
            const total = parseInt(data.Bank) + parseInt(amount)
            if(total > data.BankCap ) return [false, "Larger than Bank Cap"]
            return await setBank(userID, total);
        },
        remBank: async (userID, amount) =>{
            const data = await client.database.economy.read(userID)
            const total = parseInt(data.Bank) - parseInt(amount)
            if(total < 0 ) return [false, "Less Than Zero"]
            return await setBank(userID, total);
        },
        setBankCap: async (userID, money) =>{
            let promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, mongoClient) {
                    const db = mongoClient.db(dbName);
                    let myquery  = { DiscordID: userID.toString() };
                    let newvalues = { $set: {BankCap: money} };
                    db.collection("economies").updateOne(myquery, newvalues, function(err, res) {
                        if (err) resolve([false, err]);
                        else resolve([true])
                        return mongoClient.close()
                    });
                });
            });
            return promise.then((value) => {
                return value
            });
        },
    
    }
}