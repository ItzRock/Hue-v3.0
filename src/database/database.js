module.exports = (client) => {
    const MongoClient = require('mongodb').MongoClient;
    const url = client.config.database[0]
    const dbName = client.config.database[1]
    client.database.read = function(collection){
        const data = new Promise((resolve, reject) => {
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client){
                const database = client.db(dbName)
                const query = {}
                database.collection(collection).find(query).toArray(function(err, results) {
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