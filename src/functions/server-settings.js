module.exports = (client) => {
    client.enmap = {}
    client.enmap.edit = function(message, value, key){
        if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
        const settings = Object.values(message.settings)
        const guild = message.guild
        const settingArray = []
        settings.forEach(setting => {
            if(setting.name == key){
                return settingArray.push(setting)
            }
            if(setting.length == 0){
                if(setting.aliases == undefined) return;
                if(setting.aliases.includes(key)){
                return settingArray.push(setting)
                }
            }
        });
        const currentKey = settingArray[0];
        if(currentKey == undefined) return "No key found."
        currentKey.value = value;
        client.settings.set(guild.id, currentKey, key)
        return true
    }
    client.enmap.add = function(message, value, key){
        if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
        const settings = Object.values(message.settings)
        const guild = message.guild
        const settingArray = []
        settings.forEach(setting => {
            if(setting.name == key){
                return settingArray.push(setting)
            }
            if(setting.length == 0){
                if(setting.aliases == undefined) return;
                if(setting.aliases.includes(key)){
                return settingArray.push(setting)
                }
            }
        });
        const currentKey = settingArray[0];
        if(currentKey == undefined) return ["No key found.", false]
        if(typeof(currentKey.value) !== "object") return [`Type of key not Array, got ${typeof(currentKey.value)}`, false]
        if(currentKey.value.includes(value)) return [`Attempted to write: ${value} but that value was already present`, false]
        currentKey.value.push(value)
        client.settings.set(guild.id, currentKey, key)
        return ["success", true]
    }
    client.enmap.remove = function(message, value, key){
        if (!client.settings.has(message.guild.id)) client.settings.set(message.guild.id, {});
        const settings = Object.values(message.settings)
        const guild = message.guild
        const settingArray = []
        settings.forEach(setting => {
            if(setting.name == key){
                return settingArray.push(setting)
            }
            if(setting.length == 0){
                if(setting.aliases == undefined) return;
                if(setting.aliases.includes(key)){
                return settingArray.push(setting)
                }
            }
        });
        const currentKey = settingArray[0];
        if(currentKey == undefined) return ["No key found.", false]
        if(typeof(currentKey.value) !== "object") return [`Type of key not Array, got ${typeof(currentKey.value)}`, false]
        const keyValue = currentKey.value
        currentKey.value = []
        /*
            I want to address, yes I did try to use an array.filter method. I TRIED and for what ever bizarre reason.
            it refused to work. I dont know WHY it didn't work i TRIED to get it to work for like 30 minutes.
            so i give up. here is a for each loop to ducktape my sanity
        */
        keyValue.forEach(keyVal => { 
            if(keyVal !== value) currentKey.value.push(keyVal)
        })
        client.settings.set(guild.id, currentKey, key)
        return ["success", true]
    }
}