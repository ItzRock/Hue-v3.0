const { default: axios } = require("axios");

module.exports = (client) => {
  const chalk = require("chalk");
  const moment = require("moment");
  client.logHistory = []
  // This file has horrible indents (fix!!!! (never)) -Harry

  const fs = require("fs")
  if (!fs.existsSync("./logs")) {
    fs.mkdirSync("./logs");
  }

  const filename = `${moment().format("YYYY-MM-DD HH;mm;ss")}.txt`.toString();
  fs.writeFile(`./logs/${filename}`, "[LOGS]", function (err) {
    if (err) { console.log("oh god something broke: " + err); }
  })
    const log = (content, type = "log",) => {
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm")}]:`;
    const full = `${timestamp} ${type.toUpperCase()} ${content}`
    client.logHistory.push(full)
    try {
      const data = axios({
        url: `https://api.itzrock.xyz/v2/log`,
        method: "put",
        headers: {
          authentication: require("../../src/keys.json").panel
        },
        data: {
          log: full
        }
      })
      data.catch(error => {})
    } catch (error) {
      
    }
    fs.appendFile(`./logs/${filename}`, `\n${full}`, function (err) {
      if (err) { console.log("Failed to log: " + err) }
    })
    switch (type) {
      case "log": {
        return console.log(`${timestamp} ${chalk.bgMagenta(type.toUpperCase())} ${content} `);
      }
      case "warn": {
        return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
      }
      case "error": {
        return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
      }
      case "debug": {
        return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
      }
      case "cmd": {
        return console.log(`${timestamp} ${chalk.bgHex('#eb5a00')(type.toUpperCase())} ${content}`);
      }
      case "verify": {
        return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
      }
      case "API": {
        return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
      }
      case "module": {
        return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
      }
      case "DATA": {
        return console.log(`${timestamp} ${chalk.bgGreen(type.toUpperCase())} ${content} `);
      }
      case "EVENT": {
        return console.log(`${timestamp} ${chalk.bgCyan(type.toUpperCase())} ${content} `);
      }
      case "ai": {
        return console.log(`${timestamp} ${chalk.bgYellow(type.toUpperCase())} ${content} `);
      }
      case "ready": {
        return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content}`);
      }
      default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    }
  };
  const exportObj = {
    log: log,
    error: (...args) => log(...args, "error"),
    verify: (...args) => log(...args, "verify"),
    ai: (...args) => log(...args, "ai"),
    warn: (...args) => log(...args, "warn"),
    debug: (...args) => log(...args, "debug"),
    cmd: (...args) => log(...args, "cmd"),
    api: (...args) => log(...args, "API"),
    data: (...args) => log(...args, "DATA"),
    event: (...args) => log(...args, "EVENT"),
    module: (...args) => log(...args, "module"),
    ready: (...args) => log(...args, "ready"),
  }
  return exportObj
}