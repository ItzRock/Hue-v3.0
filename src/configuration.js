const keys = require("./keys.json");
const config = {
    "AuthorizedUsers": [
        "299682971374452739"
    ],
    "database": ["mongodb://localhost:27017", "Hue"],
    "token": keys.main,

    "status": "dev", // static or dev

    "supportCases": "ill add this later",
    "logChannel": "767976193483079690",
    
    "defaultSettings" : {
        "prefix": {name: "prefix", value: "?", editable: true},
        "adminrole": {name: "adminrole", value: [], editable: true, aliases: ["adminrole", "admin"]},
        "modroles": {name: "modroles", value :[], editable: true, aliases:["modrole", "mod"]},
        "mutedrole": {name: "mutedrole", value: undefined, editable: true, aliases: ["muted"]},
        "logs": {name: "logs", value: undefined, editable: true},
        "verification": {name: "verification", value: undefined, editable: true},
        "disabled-commands": {name: "disabled-commands", value: [], editable: true, aliases:["disable"]}
    },
    permissionLevels: [
        {
            level: 0,
            name: "User", 
            check: () => true
        },
        {
            level: 1,
            name: "Moderator",
            check: (message) => {
                return false
            }
        },
        {
            level: 2,
            name: "Administrator",
            check: (message) => {
                try {
                    try {
                        let adminRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.adminrole.value.toLowerCase());
                        if(adminRole == undefined) adminRole = message.guild.roles.cache.find(r => r.id === message.settings.adminrole.value.replace("<@&", ""));
                        return (adminRole && message.member.roles.cache.has(adminRole.id));
                      } catch (e) {
                        return false;
                      }
                  } catch (e) {
                    return false;
                  }
            }
        },
        {
            level: 3,
            name: "Server Owner",
            check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
        },
        {
            level: 5,
            name: "Hue Administrator",
            check: (message) => config.AuthorizedUsers.includes(message.author.id)
        }
    ]
}
module.exports = config;