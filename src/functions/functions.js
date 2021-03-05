const { MessageEmbed } = require("discord.js");
const noblox = require("noblox.js")
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
  client.isInGroup = async function(id, groupID){
    if(groupID == undefined || client.isNum(groupID) == false) {msg.delete(); return message.channel.send(`The guild's configuration hasn't been properly set up. please set a valid group id.`)}
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
          "Found multiple users! Please be more specific or mention the user instead.",
        ];
      else if (users.length == 0)
        return [false, "That user doesn't seem to exist. Try again!"];
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
    } catch (err) {}
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
    return a;
  };
  client.getChannel = function (guild, channel) {
    if(channel == undefined) return undefined
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

  client.errorEmbed = (error) =>{
    const avatarURL = client.user.avatarURL()
    const clientUsername = client.user.username
    const embed = new MessageEmbed()
      .setAuthor(clientUsername, avatarURL)
      .setFooter(clientUsername, avatarURL)
      .setTimestamp()
      .setColor("RED")
      .setTitle(`An Error has occurred`)
      .setDescription(`${error.name}: ${error.message}`)
    return embed
  }
  client.isNum = (string) => {
    if(string == undefined) return;
    string = string.toString()
    return string.match(/^[0-9]+$/) != null;
  }
  client.getRole = function (guild, role) {
    role = role.toString();
    const isAllNumber =
      role
        .replace("<#", "")
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
  client.getSettings = (guild) => {
    return client.HueMap.lookUp(guild).then(value => {return value})
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
    console.error(err);
  });
  process.on("unhandledRejection", async (err) => {
    if(err.message == "Missing Permissions") return // ksfhg SHUT UP ABOUT MISSING PERMISSIONS OR I WILL DROP KICK YOU IN THE BALLS
    const clean = await client.clean(client, err);
    client.channels.cache.get(client.config.errorChannel).send(`\`\`\`js\n${clean.substring(0, 1500)}\n\`\`\``)
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Unhandled Rejection: ${errorMsg}`);
  });
};
