exports.run = async (client, message, args, level) => {
  const connections = {
    Discord: "pending",
    Server: "pending",
    API: "pending"
  }
  const pending = client.defaultEmbed()
    .setTitle(`🏓 Pong!`)
    .setDescription(`${message["!"]} Hue v3.2 Connection: \`${connections.Discord}\`\n${message["!"]} Hue Server v1.0 Connection: \`${connections.Server}\`\n${message["!"]} API Latency: \`${connections.API}\``)
  const msg = await message.channel.send(pending);
  connections.API = `${Math.round(client.ws.ping)}ms.`
  connections.Discord = `${msg.createdTimestamp - message.createdTimestamp}ms.`
  const curTime = new Date()
  const data = await client.apis.https.get("https://api.itzrock.xyz/v1/status")
  connections.Server = `${new Date() - curTime} ms.`
  const finish = client.defaultEmbed()
    .setTitle(`🏓 Pong!`)
    .setDescription(`${message["check"]} Hue v3.2 Connection: \`${connections.Discord}\`\n${message["check"]} Hue Server v1.0 Connection: \`${connections.Server}\`\n${message["check"]} API Latency: \`${connections.API}\``)
  msg.edit({embed: finish});
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