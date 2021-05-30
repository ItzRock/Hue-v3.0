const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    if(!args[0]) return message.channel.send(client.invalidArgs(filename))
    try{
        if(args[0] == "toggle" && client.config.AuthorizedUsers.includes(message.author.id)){
            const value = message.settings.allowedRegister.value
            client.enmap.edit(message, !value, "allowedRegister")
            message.reply(`Registering was set to \`${!value}\` on this guild!`)
        } else {
            if(message.settings.allowedRegister.value == false) return message.reply(`This guild is not authorized to run \`;${filename}\`. Maybe ask a ${client.user.username} Administrator to do it!`)
            const username = args.join(" ").substr(0,20)
            const password = getRandomString(24)
            await client.usersDB.register(username, password, message.author.id)
            message.reply(`You have registered as \`${username}\`! Please read DMs for more information.`)
            const msg = await message.author.send(`Hello :wave:, your **Hue Administration Panel** account has been created with these details. Keep them safe!\nUsername: \`${username}\`\nPassword: \`${password}\`\nSite Url: https://panel.itzrock.xyz/\n\nThis message will automatically expire in 10 minutes so write down your password!`)
            setTimeout(()=> {msg.delete()}, 600000)
        }
    }catch(error){message.channel.send(client.errorEmbed(error))}
}
function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Administrator",
    disablable: true,
    premium: true
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1].split("/")[__dirname.split("/").length - 1],
    description: "register to the hue admin panel (authorized premium guilds only)",
    usage: `${filename} <username> `
};
