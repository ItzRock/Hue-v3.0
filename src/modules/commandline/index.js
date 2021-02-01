const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
module.exports = (client) => {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    loadCommands()
    const validCommands = []
    client.on("ready", () =>{
        setTimeout(function(){CLI()}, 100);
    })
    function CLI(){
        rl.question('Input: ', async (input) => {
            const args = input.replace(`${input.split(" ")[0]} `, "").split(" ")
            const command = input.split(" ").shift()
            if(!validCommands.includes(command)) {
                client.logger.warn(`Invalid Command: "${command}"`)
                return CLI();
            }
            await require(`./cmd/${command}`)(client, args)
            setTimeout(function(){CLI()}, 100);
        })
    }
    async function loadCommands() {
        const commands = await readdir(`${__dirname}/cmd`)
        commands.forEach(cmd => {
            validCommands.push(cmd.split(".js")[0])
        })
    }
}