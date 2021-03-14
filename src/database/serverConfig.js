module.exports = (client) => {
  const MongoClient = require("mongodb").MongoClient;
  const url = client.config.database[0];
  const dbName = client.config.database[1];
  const collection = "server configs";
  const defaults = client.config.defaultSettings;
  client.HueMap = {};
  client.HueMap.lookUp = async function(guild){
    if(guild == null) return defaults
    return await client.HueMap.read(guild.id)
  }
  client.HueMap.read = async function (id) {
    let promise = new Promise((resolve, reject) => {
      MongoClient.connect(url,{ useUnifiedTopology: true },function (err, mongoClient) {
          const db = mongoClient.db(dbName);
          const query = { GuildID: id.toString() };
          db.collection(collection).find(query).toArray(async function (err, result) {
              if (err) throw err;
              if (result.length < 1) {
                create(id).then(async _ =>{
                  resolve(await client.HueMap.read(id));
                })
              } else {
                checkup(id, result[0].Settings)
                resolve(await finalRead(id));
              }
            });
        }
      );
    });
    return await promise;
  };
  finalRead = async function(id){
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url,{ useUnifiedTopology: true }, function (err, client) {
            const db = client.db(dbName);
            const query = { GuildID: id.toString() };
            db.collection(collection).find(query).toArray(async function (err, result) {
                if (err) throw err;
                resolve(result[0].Settings);
            });
          }
        );
      });
      return await promise;      
  }
  checkup = function (guildID, Settings) {
    const keys = Object.keys(Settings)
    const defaultKeys = Object.keys(defaults)
    const keep = {}
    keys.forEach(key => { // Keep settings that are in the defaults
        if(defaultKeys.includes(key)) keep[key] = Settings[key]
    })
    defaultKeys.forEach(key => { // throw out old ones
        if(!keys.includes(key)) keep[key] = defaults[key]
    })
    // If the value of defaults changed
    // do later

    client.HueMap.hardSet(guildID, keep)
  };
  client.HueMap.edit = async function (guildID, configItem, value) {
        const data = await client.HueMap.read(guildID)
        const toEdit = data[configItem]
        toEdit.value = value
        data[configItem] = toEdit
        const promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, client) {
                const db = client.db(dbName);
                const search_Query  = { GuildID: guildID.toString() };
                const DB_values = { $set: {Settings: data} };
                db.collection(collection).updateOne(search_Query, DB_values, function(err, res) {
                    if (err) resolve([false, `${err.name}: ${err.message}`]);
                    resolve([true, 'Successfully Updated Item'])
                });
            });
        });
        return await promise;
  };
  client.HueMap.hardSet = async function (guildID, wholeSettingsTable) {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, client) {
            const db = client.db(dbName);
            const search_Query  = { GuildID: guildID.toString() };
            const DB_values = { $set: {Settings: wholeSettingsTable} };
            db.collection(collection).updateOne(search_Query, DB_values, function(err, res) {
                if (err) resolve([false, `${err.name}: ${err.message}`]);
                resolve([true, 'Successfully Updated Item'])
            });
        });
    });
    return await promise;
  };


  client.HueMap.add = async function (id, configItem, toAdd) {
    const data = await client.HueMap.read(id)
    const toEdit = data[configItem]
    if(toEdit.value.includes(toAdd)) return [false, `Attempted to write: ${toAdd} but that value was already present`]
    if(typeof(toEdit.value) !== "object") return [false, "Did you mean 'client.HueMap.edit'"]
    toEdit.value.push(toAdd)
            const promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, client) {
                const db = client.db(dbName);
                const search_Query  = { GuildID: id.toString() };
                const DB_values = { $set: {Settings: data} };
                db.collection(collection).updateOne(search_Query, DB_values, function(err, res) {
                    if (err) resolve([false, `${err.name}: ${err.message}`]);
                    resolve([true, 'Successfully Updated Item'])
                });
            });
        });
        return await promise;
  };
  client.HueMap.remove = async function (id, configItem, toRemove) {
    const data = await client.HueMap.read(id)
    const toEdit = data[configItem]
    if(typeof(toEdit.value) !== "object") return [false, "Did you mean 'client.HueMap.edit'"]
    const array = []
    toEdit.value.forEach(item => {
      if(item !== toRemove) array.push(item)
    })
    toEdit.value = array
            const promise = new Promise((resolve, reject) => {
            MongoClient.connect(url,{ useUnifiedTopology: true } , async function(err, client) {
                const db = client.db(dbName);
                const search_Query  = { GuildID: id.toString() };
                const DB_values = { $set: {Settings: data} };
                db.collection(collection).updateOne(search_Query, DB_values, function(err, res) {
                    if (err) resolve([false, `${err.name}: ${err.message}`]);
                    resolve([true, 'Successfully Updated Item'])
                });
            });
        });
        return await promise;
  };
  create = async function (guildID, defaults) {
    if (defaults == undefined) defaults = client.config.defaultSettings;
    const promise = new Promise((resolve, reject) => {
      MongoClient.connect(
        url,
        { useUnifiedTopology: true },
        function (err, mongoClient) {
          const db = mongoClient.db(dbName);
          const items = { GuildID: guildID, Settings: defaults };
          db.collection(collection).insertOne(items, function (err, res) {
            if (err) resolve(err);
            resolve(true);
          });
        }
      );
    });
    const value = await promise;
    return value;
  };
  client.HueMap.create = create
};
