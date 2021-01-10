const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
module.exports = async (client) => {
    client.lib = {}
    const modules = await readdir("./src/lib/")
    modules.forEach(module => {
        require(`./lib/${module}`)(client)
        client.logger.log(`Loaded Module: ${module}`)
    })
}