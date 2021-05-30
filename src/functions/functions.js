const { MessageEmbed } = require("discord.js");
const noblox = require("noblox.js");
const { resolve } = require("path");
module.exports = (client) => {

  client.permlevel = (message) => {
    let permlvl = 0;

    const permOrder = client.config.permissionLevels
      .slice(0)
      .sort((p, c) => (p.level < c.level ? 1 : -1));

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };
  client.isInGroup = async function (id, groupID) {
    if (groupID == undefined || client.isNum(groupID) == false) { msg.delete(); return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid group id.`) }
    const groupRank = await noblox.getRankInGroup(groupID, id)
    return groupRank !== 0
  }
  client.getArgs = (commandname) => {
    return client.commands.get(`${commandname}`).help.usage;
  };
  client.findUser = (message, name) => {
    let user = message.mentions.members.first();
    if (!user) {
      let users;
      users = client.searchForMembers(message.guild, name);
      if (users.length > 1)
        return [
          false,
          client.config.emojis.x + " Found multiple users! Please be more specific or mention the user instead.",
        ];
      else if (users.length == 0)
        return [false, client.config.emojis.x + " That user doesn't seem to exist. Try again!"];
      user = users[0];
    }
    return [true, user];
  };
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise") text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "ooga booga");

    return text;
  };
  client.invalidArgs = (cmdName) => {
    return `${client.config.emojis.x} Invalid Arguments. Usage: \`${client.getArgs(cmdName)}\``
  }
  client.loadEvent = (eventName) => {
    try{
      client.logger.event(`Loading Event: ${eventName}`);
      const event = require("../../events/" + eventName)
      client.events.set(eventName, event)
      return false
    }catch(e){
      client.logger.error(e);
      return `Unable to load command ${eventName}: ${e}`;
    }
  }

  client.loadCommand = (commandName) => {
    try {
      client.logger.cmd(`Loading Command: ${commandName}`);
      const props = require(`../../commands/${commandName}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      client.logger.error(e);
      return `Unable to load command ${commandName}: ${e}`;
    }
  };
  // MEMBER SEARCH
  client.searchForMembers = function (guild, query) {
    if (!query) return;
    query = query.toLowerCase();

    var a = [];
    var b;

    try {
      b = guild.members.cache.find((x) => x.displayName.toLowerCase() == query);
      if (!b)
        guild.members.cache.find((x) => x.user.username.toLowerCase() == query);
    } catch (err) { }
    if (b) a.push(b);
    guild.members.cache.forEach((member) => {
      if (
        (member.displayName.toLowerCase().startsWith(query) ||
          member.user.tag.toLowerCase().startsWith(query)) &&
        member.id != (b && b.id)
      ) {
        a.push(member);
      }
    });
    if(a.length == 0) {
      if(guild.members.cache.get(query) !== undefined) a.push(guild.members.cache.get(query))
    }
    return a;
  };
  client.getChannel = function (guild, channel) {
    if (channel == undefined) return undefined
    channel = channel.toString();
    const isAllNumber =
      channel
        .replace("<#", "")
        .replace(">", "")
        .match(/^[0-9]+$/) != null;
    if (isAllNumber == true) {
      return guild.channels.cache.find(
        (c) => c.id == channel.replace("<#", "").replace(">", "")
      );
    } else return guild.channels.cache.find((c) => c.name == channel);
  };

  client.errorEmbed = (error) => {
    const avatarURL = client.user.avatarURL()
    const clientUsername = client.user.username
    const embed = new MessageEmbed()
      .setAuthor(clientUsername, avatarURL)
      .setFooter(clientUsername, avatarURL)
      .setTimestamp()
      .setColor("RED")
      .setTitle(`${client.config.emojis.exclamation} An Error has occurred`)
      .setDescription(`\`${error.name}: ${error.message}\`\nIf this continues to happen please join our support server by running \`;server\``)
    return embed
  }
  client.isNum = client.isNumeric = (string) => {
    if (string == undefined) return false;
    string = string.toString()
    return string.match(/^[0-9]+$/) != null;
  }
  client.getRole = function (guild, role) {
    role = role.toString();
    const isAllNumber =
      role
        .replace("<@&", "")
        .replace(">", "")
        .match(/^[0-9]+$/) != null;
    if (isAllNumber == true) {
      return guild.roles.cache.find(
        (c) => c.id == role.replace("<#", "").replace(">", "")
      );
    } else return guild.roles.cache.find((c) => c.name == role);
  };
  client.hasRole = (member, role) => {
    role = role.toString().replace("<#", "").replace(">", "");
    if (
      member.roles.cache.find((r) => r.id === role) ||
      member.roles.cache.find((r) => r.name === role)
    ) {
      return true;
    } else return false;
  };
  client.aiChat = async function(toSend, message, sessionID){
    const smartestchatbot = require('smartestchatbot')
    const bot = new smartestchatbot.Client()
    const promise = new Promise((resolve, reject) => {
      bot.chat({message: toSend , name: client.user.username, owner:"Anthony", user: sessionID, language:"en"}).then(reply => resolve(reply))
    })
    return await promise
  }
  client.embedGen = function (
    title,
    description,
    color = client.embedColour(),
    authorExtText = ""
  ) {
    const clientUser = client.user.username;
    const avatar = client.user.avatarURL();
    const embed = new MessageEmbed()
      .setAuthor(`${clientUser} ${authorExtText}`, avatar)
      .setFooter(`${clientUser}`, avatar)
      .setTitle(title)
      .setColor(color)
      .setTimestamp()
      .setDescription(description);
    return embed; 
  };
  client.defaultEmbed = function () {
    const defaults = {
      color: client.embedColour(),
      author: client.user.username,
      footer: client.user.username,
      authorIMG: client.user.avatarURL()
    }
    const embed = new MessageEmbed()
      .setTimestamp()
      .setColor(defaults.color)
      .setAuthor(defaults.author, defaults.authorIMG)
      .setFooter(`${defaults.author}`, defaults.authorIMG,)
    return embed
  }
  client.getUserFromMention = (mention) => {
    if (!mention) return;

    if (mention.startsWith("<@") && mention.endsWith(">")) {
      mention = mention.slice(2, -1);

      if (mention.startsWith("!")) {
        mention = mention.slice(1);
      }

      return client.users.cache.get(mention);
    }
  };
  client.shuffle = (array) => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };
  client.embedColour = function (safe) {
    if (safe) {
      // Removed red so people don't get confused by color, mainly for verify.
      return [
        "#4287f5",
        "#e042f5",
        "#5d42f5",
        "#42f59e",
        "#f5d142",
        "#ff8133",
      ].random();
    } else
      return [
        "#4287f5",
        "#f54242",
        "#e042f5",
        "#5d42f5",
        "#42f59e",
        "#f5d142",
        "#ff8133",
      ].random();
  };

  client.arrayToMap = (array, nameIndex = "name", toSetIndex = "value") => {
    const newMap = new Map()
    array.forEach(index => newMap.set(index[nameIndex], index[toSetIndex]))
    return newMap;
  }

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command)
      return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    const mod =
      require.cache[require.resolve(`../../commands/${command.help.category}/${command.help.name}`)];
    delete require.cache[
      require.resolve(`../../commands/${command.help.category}/${command.help.name}.js`)
    ];
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
    return false;
  };
  client.unloadEvent = async (eventName) => {
    if(!client.events.has(eventName)) `The command \`${eventName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
    const mod = require.cache[require.resolve(`../../events/${eventName}`)]
    delete require.cache[
      require.cache[require.resolve(`../../events/${eventName}`)]
    ]
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
    return false;
  }
  client.unloadAPIModule = async (moduleName) => {
    let _module;
    if(client.apis.has(moduleName)){
      _module = client.apis.get(moduleName);
    }
    if(!_module) return `${moduleName} isnt a valid child of APIS`
    const fullpath = `../apis/${moduleName}`
    const mod = require.cache[require.resolve(fullpath)];
    delete require.cache[require.resolve(`${fullpath}.js`)]
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
    return false;
  }
  
  client.getSettings = (guild) => {
    return client.HueMap.lookUp(guild).then(value => { return value })
  };
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = (m) => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: limit,
        errors: ["time"],
      });
      return collected.first().content;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  client.randomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  client.getTime = function () {
    var currentdate = new Date();
    currentdate.getFullYear();
    var datetime =
      currentdate.getFullYear() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getDate();
    return datetime;
  };
  Object.defineProperty(Array.prototype, "random", {
    value: function () {
      return this[Math.floor(Math.random() * this.length)];
    },
  });
  client.wait = require("util").promisify(setTimeout);
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    try {
      client.logger.error(`Uncaught Exception: ${errorMsg}`);
    } catch (err) {
      console.log(`Uncaught Exception: ${errorMsg}`);
    }
  });
  process.on("unhandledRejection", async (err) => {
    const missingPermissionsRegex = /(DiscordAPIError:\sMissing\sPermissions$\n)/im;
    const clean = await client.clean(client, err);

    if (missingPermissionsRegex.test(clean.substring(0, 1500))) {
        const channelPathRegex = /(^\s+path:\s)(\'\/channels\/[\d]+\/[^\n]*)/im
        var channelPath = clean.substring(0, 1500).match(channelPathRegex)
        if (!channelPath || channelPath === null) return; else channelPath = (typeof(channelPath[0]) == "string" ? channelPath[0] : channelPath[0].toString());
        
        var matchedChannelId = channelPath.match(/\d+/im)
        matchedChannelId = (Array.isArray(matchedChannelId) ? matchedChannelId[0] : client.config.errorChannel)
        try {
            const missingPermsChannel = client.channels.cache.get(matchedChannelId)
            if (!missingPermsChannel || missingPermsChannel === undefined || missingPermsChannel === null) throw new Error(`Failed to fetch channel by id: ${matchedChannelId || "Unable to fetch id"}`);
            const settings = await client.getSettings(missingPermsChannel.guild);   

            function getSendableChannel(guild = missingPermsChannel.guild) {
                if (guild.channels.cache.has(guild.id)) return guild.channels.get(guild.id);
                const generalChannel = guild.channels.cache.find(channel => channel.name === "general");
                if (generalChannel) return generalChannel;
                
                return guild.channels.cache
                    .filter(channel => channel.type === "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES"))
                    .sort((a, b) => a.position - b.position || Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
                    .first();
            }

            const cleanStackRegex = /(\s+at[^{]*)/im;
            let noStackCleanedErr = clean.replace(cleanStackRegex, "")

            const guildLogsChannel = client.getChannel(missingPermsChannel.guild, settings.logs.value);
            if (settings.logs.value === undefined) {
                const firstSendableChannel = getSendableChannel(missingPermsChannel.guild);
                if (firstSendableChannel && firstSendableChannel !== undefined && firstSendableChannel !== null) {
                    firstSendableChannel.send(`<@${missingPermsChannel.guild.ownerID}> MissingPermissions to send messages to channel: ${missingPermsChannel}`)
                    firstSendableChannel.send(client.errorEmbed({name: "MissingPermissions", message: noStackCleanedErr}))
                } else return; // Bot can't send messages in any channel it can see
            } else if (guildLogsChannel && guildLogsChannel !== undefined && guildLogsChannel !== null) { // Send to logs channel
                guildLogsChannel.send(`<@${missingPermsChannel.guild.ownerID}> MissingPermissions to send messages to channel: ${missingPermsChannel}`)
                guildLogsChannel.send(client.errorEmbed({name: "MissingPermissions", message: noStackCleanedErr}))
            } else { // Logs channel exists but isn't configured properly
                const firstSendableChannel = getSendableChannel(missingPermsChannel.guild);
                if (firstSendableChannel && firstSendableChannel !== undefined && firstSendableChannel !== null) {
                    firstSendableChannel.send(`<@${missingPermsChannel.guild.ownerID}> MissingPermissions to send messages to channel: ${missingPermsChannel}`)
                    firstSendableChannel.send(client.errorEmbed({name: "MissingPermissions", message: noStackCleanedErr}))
                } else return; // Bot can't send messages in any channel it can see
            }
        } catch (newErr) {
            client.channels.cache.get(client.config.errorChannel).send(`\`\`\`js\n${clean.substring(0, 1500)}\n\`\`\``)
            const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
            client.logger.error(`Unhandled Rejection: ${errorMsg}`);

            const newErrorCleaned = await client.clean(client, newErr)
            client.channels.cache.get(client.config.errorChannel).send(`Another exception caught while trying to process the previous rejection: \`\`\`js\n${newErrorCleaned.substring(0, 1500)}\n\`\`\``)
            client.logger.error(`Another exception caught while trying to process the previous rejection: ${newErr}`);
        }
    } else {
        client.channels.cache.get(client.config.errorChannel).send(`\`\`\`js\n${clean.substring(0, 1500)}\n\`\`\``)
        const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
        client.logger.error(`Unhandled Rejection: ${errorMsg}`);
    }
  });
};
