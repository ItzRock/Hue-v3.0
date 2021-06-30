const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
module.exports = async (client) => {
    client.database = {}
    client.database.users = {}
    const dbModules = await readdir("./src/database/")
    dbModules.forEach(module => {
        client.logger.data(`Loading Database Module: ${module}`)
        try {
            require(`./database/${module}`)(client)
        } catch (error) {
            client.logger.error(`Failed to load Database Module: ${module}. (${error.name} : ${error.message})`)
        }
    })
}