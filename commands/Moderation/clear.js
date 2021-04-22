const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
  if(!args[0]) return message.channel.send(client.invalidArgs(filename))
  const clearLimit = 99
  try{
    let failed = false
    let amount = args[0] 
    if(isNaN(amount)) return message.channel.send(`${client.config.emojis.x} Please provide a number.`)
    amount = parseInt(amount);
    if(amount > clearLimit) return message.channel.send(`${client.config.emojis.x} You cannot clear more than ${clearLimit} messages.`)
    if (amount < 1) return message.reply(`${client.config.emojis.x} You cant delete less than 1 message`);
    amount++; // this is because it will catch one less than expected.
    async function clear(clrAmount){
      await message.channel.messages.fetch({limit: clrAmount}).then(async (messages) =>{
        const msgCache = messages
        await message.channel.bulkDelete(messages)
        .catch(error => {
          message.channel.send(`${client.config.emojis.x} ${error.name} : \`${error.message}\``)
          return failed = true;
        })
        if(failed == true) return;
        const msg = await message.channel.send(`${client.config.emojis.check} Successfully Deleted ${clrAmount - 1} messages.`)
        await msg.delete({ timeout: 5000 }).catch(/* uh idk*/);

        const logs = client.getChannel(message.guild, message.settings.logs.value);
        if(logs !== undefined){
          const messageArray = []
          let index = 0
          msgCache.forEach( msg => {
            index++;
            const attachments = msg.attachments.array()
            const content = msg.content
            let arrayMessage = `${msg.createdAt} | ${msg.author.tag}: ${content} |`
            attachments.forEach(attachment => arrayMessage = `${arrayMessage} ${attachment.proxyUrl} |`)
            messageArray.push(arrayMessage)
            if(index >= clrAmount){
              logs.send({files: [{
                name: `${message.channel.name}-${clrAmount - 1}.txt`,
                attachment: new Buffer.from(messageArray.join("\n"))
              }]})
            }
          })
        }
      });
    }
    clear(amount)

  }catch(error){message.channel.send(client.embedError(error))}
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["purge", "wipe", "bin", "AAAAAAAAAAAAAAAAAAAAAA"],
  permLevel: "Moderator",
  level: 5,
  disablable: true,
  premium: false
};
exports.help = {
  name: filename,
  category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
  description: "Clear a certain amount of text from your channels.",
  usage: `${filename} <amount>`
};
