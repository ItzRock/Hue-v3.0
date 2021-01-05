/* 
    Written with love by It'z Rock
    ItzRock#0002 (299682971374452739)
    @ItzRock_ (twitter)
*/

const Discord = require('discord.js'); // Discord JS will be the api we use
const client = new Discord.Client(); // Init a client.

client.config = require('./src/configuration')
client.logger = require('./src/functions/logger')

client.logger.log("Configuration Has Been Loaded")

const boot = async function(){
    client.login(client.config.token)
    client.logger.log(`Bot has logged in.`)
}
boot()
module.exports = client;