module.exports = (client) => {
    const MongoClient = require('mongodb').MongoClient;
    const url = client.config.database[0]
    const dbName = client.config.database[1]
    const collections = "global bans discords"
    client.blacklist = {
        ban: (userID, reason) => {

        },
        unban: (userID) => {

        },
        read: (userID) => {

        },
    }
}