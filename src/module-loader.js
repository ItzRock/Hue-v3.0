const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
const fs = require('fs')
module.exports = async (client) => {
    client.modules = {}
    const modules = await readdir("./src/modules/")
    modules.forEach(module => {
        require(`./modules/${module}`)(client)
        client.logger.module(`Loaded Module: ${module}`)
    })
}