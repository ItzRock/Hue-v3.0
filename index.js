/* 
      _    _              ____         ___  
     | |  | |            |___ \       / _ \ 
     | |__| |_   _  ___    __) |     | | | |
     |  __  | | | |/ _ \  |__ <      | | | |
     | |  | | |_| |  __/  ___) |  _  | |_| |
     |_|  |_|\__,_|\___| |____/  (_)  \___/ 
                                        
                                        
    Written with love by It'z Rock
    ItzRock#0002 (299682971374452739)
    @ItzRock_ (twitter)
    Support Server : https://discord.gg/QwgnZ83XD3
    --------------------
    Based off: Hue 2.0 
    Hue 2.0 was based off: https://github.com/AnIdiotsGuide/guidebot

    While i wrote a bunch of this, its not all me.

    Contributors:
    HarryXChen3 https://github.com/HarryXChen3

*/

const Discord = require('discord.js'); // Discord JS will be the api we use
const client = new Discord.Client(); // Init a client.

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
const fs = require('fs')
const Enmap = require("enmap");

//Enmap to store data
client.settings = new Enmap({name: "settings"});
client.commands = new Enmap();
client.aliases = new Enmap();

client.config = require('./src/configuration')
client.logger = require('./src/functions/logger')
// Lets log a fancy boot logo so i can say "i worked on hue today"
const logo = client.config.bootMessage;
client.logger.log(logo)
/* Lets load our Functions */
require("./src/databaseLoader")(client)
require("./src/api-loader")(client)
require("./src/gamesLoader")(client)
require("./src/functions/functions")(client)
require("./src/functions/server-settings")(client)
require('./src/functions/music')(client)
// -- //

const boot = async function(){
    const commands = await readdir('./commands/'); // array of commands found in the commands folder of the bot.
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
        client.logger.event(`Loading Event: ${eventName}`); // logs the event is being loaded
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