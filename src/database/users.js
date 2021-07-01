module.exports = (client) => {
    const MongoClient = require('mongodb').MongoClient;
    const url = client.config.database[0]
    const dbName = client.config.database[1]
    const collections = "users"
    const argon2 = require('argon2')
    client.usersDB = {
        register: async (username, password, id) => {
            const cryptedPass = await argon2.hash(password);
            const promise = new Promise((resolve, reject) => {
                MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, client) {
                    const db = client.db(dbName);
                    let items = { 
                        username: username,
                        email: username,
                        encryptedPassword: cryptedPass,
                        role: "Verification", // Revert to Panel Administrator if everything breaks
                        discordID: id
                    };
                    db.collection(collections).insertOne(items, function(err, res) {
                        if(err) reject(err)
                        resolve([true, 'Successfully Added'])
                        return client.close()
                    });
                });
            });
            return promise.then((value) => {
                return value
            }); 
        }
    }
}