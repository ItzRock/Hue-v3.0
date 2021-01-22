const chalk = require("chalk");
const moment = require("moment");
const fs = require("fs")
const filename = `${moment().format("YYYY-MM-DD HH;mm;ss")}.txt`.toString();
fs.writeFile(`./logs/${filename}`, "[LOGS]", function(err){
  if(err){console.log("oh god something broke: " + err);}
})
exports.log = (content, type = "log",) => {
  const timestamp = `[${moment().format("YYYY-MM-DD HH:mm")}]:`;
  fs.appendFile(`./logs/${filename}`, `\n${timestamp} ${type.toUpperCase()} ${content} `, function(err){
    if(err){console.log("Failed to log: "  + err)}
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
      return console.log(`${timestamp} ${chalk.bgYellow(type.toUpperCase())} ${content}`);
    }
    case "verify": {
      return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
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

exports.error = (...args) => this.log(...args, "error");

exports.verify = (...args) => this.log(...args, "verify");

exports.ai = (...args) => this.log(...args, "ai");

exports.warn = (...args) => this.log(...args, "warn");

exports.debug = (...args) => this.log(...args, "debug");

exports.cmd = (...args) => this.log(...args, "cmd");

exports.ready = (...args) => this.log(...args, "ready");