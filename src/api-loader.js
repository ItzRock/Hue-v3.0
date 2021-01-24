const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
const fs = require('fs')
module.exports = async (client) => {
    client.apis = {}
    const dbModules = await readdir("./src/api/")
    dbModules.forEach(module => {
        require(`./api/${module}`)(client)
        client.logger.api(`Loaded API Module: ${module}`)
    })
}