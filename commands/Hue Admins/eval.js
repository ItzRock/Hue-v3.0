exports.run = async (client, message, args, level) => {
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    message.channel.send(`\`\`\`js\n${clean.substring(0, 1500)}\n\`\`\``);
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${(await client.clean(client, err.name + ":" +err.message)).substring(0, 1500)}\n\`\`\``);
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
  category: __dirname.split("\\")[__dirname.split("\\").length - 1],
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};
