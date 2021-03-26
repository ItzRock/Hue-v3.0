const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 
const fs = require('fs')
module.exports = async (client) => {
    client.modules = {}
    const modules = await readdir("./src/modules/")
    modules.forEach(module => {
        client.logger.module(`Loading Module: ${module}`)
        try {require(`./modules/${module}`)(client)} catch (error){
            client.logger.error(`Failed to load module: ${module}. (${error.name} : ${error.message})`)
        }
    })
}