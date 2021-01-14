const { MessageEmbed } = require('discord.js');
module.exports = (client) => {
    client.permlevel = message => {
        let permlvl = 0;
    
        const permOrder = client.config.permissionLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
    
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
    client.findUser = (message, name) =>{
        let user = message.mentions.members.first();
        if (!user) {
            let users;
            users = client.searchForMembers(message.guild, name);
            if (users.length > 1)
                return [false,"Found multiple users! Please be more specific or mention the user instead."]
            else if (users.length == 0)
                return [false, "That user doesn't seem to exist. Try again!"]
            user = users[0];
        };
        return [true, user];
    } 
    client.clean = async (client, text) => {
        if (text && text.constructor.name == "Promise")
            text = await text;
        if (typeof text !== "string")
            text = require("util").inspect(text, {depth: 1});
    
        text = text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203))
          .replace(client.token, "ooga booga");
    
        return text;
    };
    
      client.loadCommand = (commandName,) => {
        try {
          client.logger.log(`Loading Command: ${commandName}`);
          const props = require(`../../commands/${commandName}`);
          if (props.init) {
            props.init(client);
          }
          client.commands.set(props.help.name, props);
          props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
          });
          return false;
        } catch (e) {
          return `Unable to load command ${commandName}: ${e}`;
        }
    };
      // MEMBER SEARCH
    client.searchForMembers = function(guild, query) {
        if (!query) return;
        query = query.toLowerCase();

        var a = [];
        var b;

        try {
            b = guild.members.cache.find(x => x.displayName.toLowerCase() == query);
            if (!b) guild.members.cache.find(x => x.user.username.toLowerCase() == query);
        } catch (err) {};
        if (b) a.push(b);
        guild.members.cache.forEach(member => {
            if ((member.displayName.toLowerCase().startsWith(query) || member.user.tag.toLowerCase().startsWith(query)) && member.id != (b && b.id)) {
                a.push(member);
            };
        });
        return a;
    };
    client.getChannel = function(guild, channel){
        const isAllNumber = channel.replace("<#", "").replace(">", "").match(/^[0-9]+$/) != null;
        if(isAllNumber == true){
            return guild.channels.cache.find(c => c.id == channel.replace("<#", "").replace(">", ""))
        }else return guild.channels.cache.find(c => c.name == channel)
    }
    client.getRole = function(guild, role){
        const isAllNumber = role.replace("<#", "").replace(">", "").match(/^[0-9]+$/) != null;
        if(isAllNumber == true){
            return guild.roles.cache.find(c => c.id == role.replace("<#", "").replace(">", ""))
        }else return guild.roles.cache.find(c => c.name == role)
    }
    client.embedGen = function(title, description, color = client.embedColour(), authorExtText = ""){
        const clientUser = client.user.username
        const avatar = client.user.avatarURL()
        const embed = new MessageEmbed()
            .setAuthor(`${clientUser} ${authorExtText}`, avatar)
            .setFooter(`${clientUser}`, avatar)
            .setTitle(title)
            .setColor(color)
            .setTimestamp()
            .setDescription(description)
        return embed
    }
    client.getUserFromMention = mention => {
        if (!mention) return;
  
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
  
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
  
            return client.users.cache.get(mention);
        }
    }
    client.findRole = function(input, message) {
        var role;
        role = message.guild.roles.cache.find(r => r.name.toLowerCase() === input.toLowerCase());
        if(!role) {
            role = message.guild.roles.cache.get(input.toLowerCase());
        };
  
        if(!role) {
            return;
        };
  
        return role;
    };

    client.embedColour = function(msg) {
        return ["#4287f5", "#f54242", "#e042f5", "#5d42f5", "#42f59e", "#f5d142", "#f56642"].random();
    };
    client.unloadCommand = async (commandName) => {
        let command;
        if (client.commands.has(commandName)) {
          command = client.commands.get(commandName);
        } else if (client.aliases.has(commandName)) {
          command = client.commands.get(client.aliases.get(commandName));
        }
        if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
        
        if (command.shutdown) {
          await command.shutdown(client);
        }
        const mod = require.cache[require.resolve(`../commands/${command.help.name}`)];
        delete require.cache[require.resolve(`../commands/${command.help.name}.js`)];
        for (let i = 0; i < mod.parent.children.length; i++) {
          if (mod.parent.children[i] === mod) {
            mod.parent.children.splice(i, 1);
            break;
          }
        }
        return false;
    };
    client.getSettings = (guild) => {
        client.settings.ensure("default", client.config.defaultSettings);
        if(!guild) return client.settings.get("default");
        const guildConf = client.settings.get(guild.id) || {};
        return ({...client.settings.get("default"), ...guildConf});
    };
    client.awaitReply = async (msg, question, limit = 60000) => {
        const filter = m => m.author.id === msg.author.id;
        await msg.channel.send(question);
        try {
          const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
          return collected.first().content;
        } catch (e) {
          console.log(e);
          return false;
        }
    };
    client.randomNumber = function(min, max){
        return Math.round(Math.random() * (max - min) + min);
    }

    client.getTime = function(){
      var currentdate = new Date(); currentdate.getFullYear()
      var datetime = currentdate.getFullYear()  + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getDate()
      return datetime;
    }
    Object.defineProperty(Array.prototype, "random", {
        value: function() {
          return this[Math.floor(Math.random() * this.length)];
        }
    });          
    client.wait = require("util").promisify(setTimeout);
    process.on("uncaughtException", (err) => {
        const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
        try{client.logger.error(`Uncaught Exception: ${errorMsg}`);}catch(err){
          console.log(`Uncaught Exception: ${errorMsg}`);
        }
        console.error(err);
    });
    process.on("unhandledRejection", err => {
        client.logger.error(`Unhandled rejection: ${err}`);
        console.error(err);
    });   
};