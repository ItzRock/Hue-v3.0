module.exports = (client) => {
    client.enmap = {}
    client.enmap.edit = function(message, value, key){
        return client.HueMap.edit(message.guild.id, key, value).then(value => {return value})
    }
    /*client.enmap.allowEdit = function(guild, key){
        if (!client.settings.has(guild.id)) client.settings.set(guild.id, {});
        const settings = Object.values(guild.settings)
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
        currentKey.editable = true;
        client.settings.set(guild.id, currentKey, key)
        return true
    }*/
    client.enmap.add = function(message, value, key){
        return client.HueMap.add(message.guild.id, key, value).then(value => {return value})
    }
    client.enmap.remove = function(message, value, key){
        return client.HueMap.remove(message.guild.id, key, value).then(value => {return value})
    }
}