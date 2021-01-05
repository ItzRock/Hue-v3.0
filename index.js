/* 
    Written with love by It'z Rock
    ItzRock#0002 (299682971374452739)
    @ItzRock_ (twitter)

    Although while this is based off hue 2.0, hue 2.0 was based off of https://github.com/AnIdiotsGuide/guidebot
*/

const Discord = require('discord.js'); // Discord JS will be the api we use
const client = new Discord.Client(); // Init a client.

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
const fs = require('fs')
const Enmap = require("enmap");

//Enmap because idk 
client.settings = new Enmap({name: "settings"});
client.commands = new Enmap();
client.aliases = new Enmap();

client.config = require('./src/configuration')
client.logger = require('./src/functions/logger')
client.logger.log("Configuration Has Been Loaded")

/* Lets load our Functions */
require("./src/functions/functions")(client)
// -- //
const boot = async function(){
    const commands = await readdir('./commands/'); // array of commands found in the commands folder of the bot.
    client.logger.log(`Loading a total of ${commands.length} commands.`); // logs number of commands that was found using readdir
    commands.forEach(async f => { // for each of the entries in the command array]
        var stats = fs.statSync(__dirname + '\\commands\\' + f); 
        if(stats.isDirectory() == true){
          const catagory = await readdir(__dirname + '\\commands\\' + f);
          catagory.forEach(command => {
            if(!command.endsWith(".js")) return; // if it isnt a js file then it ignores
            const response = client.loadCommand(`${f}\\${command}`); // if it is then it tries to load the command with a load command function
            if (response) console.log(response);
          })
        }
        if(!f.endsWith(".js")) return; // if it isnt a js file then it ignores
        const response = client.loadCommand(f); // if it is then it tries to load the command with a load command function
        if (response) console.log(response); // then it logs the response it gets
    });

    const evtFiles = await readdir("./events/"); // grabs all the event files from the event files directory and puts them in a array
    client.logger.log(`Loading a total of ${evtFiles.length} events.`); // logs number of events found
    evtFiles.forEach(file => { // for each item found in the directory it will run the following on it
        const eventName = file.split(".")[0]; // splits the name
        client.logger.log(`Loading Event: ${eventName}`); // logs the event is being loaded
        const event = require(`./events/${file}`); // requires that event
        client.on(eventName, event.bind(null, client)); // honestly, i dont know but it works.
    });

    client.levelCache = {}; // god i dont want to explain how this works
    for (let i = 0; i < client.config.permissionLevels.length; i++) {
        const thisLevel = client.config.permissionLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }
    client.login(client.config.token);
}
boot()
module.exports = client;