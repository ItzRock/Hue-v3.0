module.exports = (client) => {
    client.enmap = {}
    client.enmap.edit = function(message, value, key){
        return client.HueMap.edit(message.guild.id, key, value).then(value => {return value})
    }
    client.enmap.add = function(message, value, key){
        return client.HueMap.add(message.guild.id, key, value).then(value => {return value})
    }
    client.enmap.remove = function(message, value, key){
        return client.HueMap.remove(message.guild.id, key, value).then(value => {return value})
    }
}