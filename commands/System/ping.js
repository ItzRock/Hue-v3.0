exports.run = async (client, message, args, level) => {
    const msg = await message.channel.send("pending");
    msg.edit(`🏓 Pong! My latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  };
  
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "User",
    disablable: false,
    premium: false
  };
  
  exports.help = {
    name: "ping",
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "Check's the latency of the bot.",
    usage: "ping"
  };