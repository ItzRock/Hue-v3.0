module.exports = async client => {
    //client.user.setActivity(`for ${client.config.defaultSettings.prefix}help.`, {type: "WATCHING"});
    client.user.setActivity(`Development mode: Hue v3.0`, {type: "PLAYING"});
    client.logger.log(`Logged On As: ${client.user.tag}, Current Prefix: ${client.config.defaultSettings.prefix}`);
};