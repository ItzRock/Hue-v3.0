exports.run = async (client, message, args, level) => {
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    message.channel.send(`${client.config.emojis.check}\`Success!\``, {files: [{
      name: `eval.js`,
      attachment: new Buffer.from(`${clean}`)
    }]});
  } catch (err) {
    message.channel.send(`${client.config.emojis.x}\`ERROR\` \`\`\`xl\n${(await client.clean(client, err.name + ":" +err.message)).substring(0, 1500)}\n\`\`\``);
  }
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Hue Administrator",
  disablable: true,
  premium: false
};

exports.help = {
  name: "eval",
  category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};
