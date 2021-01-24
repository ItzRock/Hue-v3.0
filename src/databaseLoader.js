const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
const fs = require('fs')
module.exports = async (client) => {
    client.database = {}
    client.database.users = {}
    const dbModules = await readdir("./src/database/")
    dbModules.forEach(module => {
        require(`./database/${module}`)(client)
        client.logger.data(`Loaded Database Module: ${module}`)
    })
}