module.exports = async client => {
    const statusType = client.config.status
    client.activeStatus = undefined
    if(statusType == "static"){
            client.activeStatus =`for ${client.config.defaultSettings.prefix.value}help | ${client.user.username} v3.2`
            
            client.user.setActivity(client.activeStatus, {type: "WATCHING"});
            setInterval(function(){
                client.user.setActivity(client.activeStatus, {type: "WATCHING"});
            }, 3600000)
        }
     else if(statusType == "dev"){
            client.activeStatus = `Development mode: ${client.user.username} v3.2`
            client.user.setActivity(client.activeStatus, {type: "WATCHING"});
            setInterval(function(){
                client.user.setActivity(client.activeStatus, {type: "WATCHING"});
            }, 3600000)
        }
    client.logger.ready(`Logged On As: ${await client.user.tag}, Current Prefix: ${client.config.defaultSettings.prefix.value} | Hue v3.2`);
};