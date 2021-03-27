const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
module.exports = async (client) => {
    client.apis = new Map()
    const dbModules = await readdir("./src/api/")
    dbModules.forEach(module => {
        client.logger.api(`Loading API Module: ${module}`)
        try{
            require(`./api/${module}`)(client)
        }catch(error){
            client.logger.error(`Failed to load API Module: ${module}. (${error.name} : ${error.message})`)
        }
    })
}