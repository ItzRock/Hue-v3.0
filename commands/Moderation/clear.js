exports.run = async (client, message, args, level) => {
  var amount = args.join(" ");
  if (!amount)
    return message.reply("You haven't given an amount of messages which should be deleted!");
  if (isNaN(amount)) return message.reply("You Crazy? That isn't a number!");

  if (amount > 100)
    return message.reply("You can't delete more than 100 messages at once!");
  if (amount < 1) return message.reply("You cant delete less than 0");
  amount++;
  const channel = message.channel;
  await message.channel.messages.fetch({ limit: amount }).then((messages) => {
    channel.bulkDelete(messages);
    message
      .reply(`Deleted ${amount - 1} messages :thumbsup:`)
      .then((msg) => {
        msg.delete({ timeout: 5000 });
      })
      .catch(/* uh idk*/);
  });
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["bin", "wipe", "purge"],
  permLevel: "Moderator",
  disablable: true,
  premium: false,
};

exports.help = {
  name: "clear",
  category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
  description: "cleans the chat what you say.",
  usage: "clear [value]",
};
