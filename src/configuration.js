const keys = require("./keys.json")
const client = require("../index")
class Setting{
    constructor(name, value, editable, aliases){
        this.name = name;
        this.value = value;
        this.editable = editable
        if(aliases){
            this.aliases = aliases
        }
        
    }
}
const config = {
    "AuthorizedUsers": [ 
    /* For now this will an array like hue 2.0
    but once i get the database working
    we'll run this off of hue administrator 
    rules of the hue network admin panel */
        "299682971374452739"
    ],
    "database": ["mongodb://localhost:27017", "Hue"],
    "token": keys.main,

    "supportCases": "ill add this later",
    "logChannel": "69420 gmaer",
    
    "defaultSettings" : {
        
        "prefix": new Setting("prefix", "?", true),
        "adminroles": new Setting("Administrator Role", undefined, true, ["adminrole", "admin"]),
        "modroles": new Setting("Moderator Role", undefined, true, ["modrole", "mod"]),
        "mutedrole": undefined,
        "logs": undefined,
        "verification": undefined,
        "disabled-commands": []
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
                return false
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