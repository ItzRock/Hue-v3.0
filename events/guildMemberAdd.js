const { unfollow } = require("noblox.js");

module.exports = (client, member) => {
    const settings = client.getSettings(member.guild);
    if(settings.welcoming == true){
        const welcomingChannel = client.getChannel(member.guild, settings["welcoming-channel"]);
        if(welcomingChannel !== undefined){
            
        }
    }
};