const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
module.exports = async (client) => {
    client.games = {}
    const gameModules = await readdir("./src/games/")
    gameModules.forEach(module => {
        require(`./games/${module}`)(client)
        client.logger.log(`Loaded Game Module: ${module}`)
    })
}