module.exports = (client) => {
    const MongoClient = require('mongodb').MongoClient;
    const url = client.config.database[0]
    const dbName = client.config.database[1]
    client.database.economy = {}
    // Wallet

    client.database.economy.setMoney = (userID, amount) => {
        
    }
    client.database.economy.addMoney = (userID, amount) => {
        
    }
    client.database.economy.remMoney = (userID, amount) => {
        
    }
    client.database.economy.readMoney = (userID) => {
        
    }

    // Bank
}