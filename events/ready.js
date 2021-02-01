module.exports = async client => {
    const statusType = client.config.status
    if(statusType == "static"){
            const message = `for ${client.config.defaultSettings.prefix.value}help | Hue v3.0`
            client.user.setActivity(message, {type: "WATCHING"});
            setInterval(function(){
                client.user.setActivity(message, {type: "WATCHING"});
            }, 3600000)
        }
     else if(statusType == "dev"){
            const message = `Development mode: Hue v3.0`
            client.user.setActivity(message, {type: "WATCHING"});
            setInterval(function(){
                client.user.setActivity(message, {type: "WATCHING"});
            }, 3600000)
        }
    client.logger.ready(`Logged On As: ${client.user.tag}, Current Prefix: ${client.config.defaultSettings.prefix.value} | Hue v3.0`);
};