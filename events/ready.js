module.exports = async client => {
    const statusType = client.config.status
    switch (statusType) {
        case "static":{
            const message = `for ${client.config.defaultSettings.prefix.value}help`
            client.user.setActivity(message, {type: "WATCHING"});
            setInterval(function(){
                client.user.setActivity(message, {type: "WATCHING"});
            }, 3600000)
        }
        case "dev":{
            const message = `Development mode: Hue v3.0`
            client.user.setActivity(message, {type: "WATCHING"});
            setInterval(function(){
                client.user.setActivity(message, {type: "WATCHING"});
            }, 3600000)
        }
    }
    client.logger.log(`Logged On As: ${client.user.tag}, Current Prefix: ${client.config.defaultSettings.prefix.value}`);
};