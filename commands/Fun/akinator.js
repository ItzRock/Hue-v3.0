const { MessageEmbed } = require('discord.js');
const filename = require('path').basename(__filename).split(".")[0]
exports.run = async (client, message, args, level) => {
    return message.channel.send(`Game disbaled until finished`)
    const pending = await message.channel.send(`Game is pending.`)
    const { Aki } = require('aki-api');

    const region = 'en';
    const childMode = true;
    const aki = new Aki(region, childMode);

    await aki.start();

    const firstQuestion = aki.question
    const awnsers = aki.answers;
    awnsers.push("Exit Game")
    const reactions = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "❌"]

    let description = ""

    for (let i = 0; i < awnsers.length; i++) {
        description = `${description}\n${reactions[i]} = ${awnsers[i]}`
    }

    const embed = new MessageEmbed()
        .setAuthor(`${client.user.username}`, client.user.avatarURL())
        .setFooter(`${client.user.username}`, client.user.avatarURL())
        .setColor(client.embedColour())
        .setTimestamp()
        .setTitle(`Question: \`${firstQuestion}\``)
        .setDescription(description)
    const msg = await message.channel.send(embed)
    await pending.delete()
    async function addReactions(){
        reactions.forEach(async reaction => {await msg.react(reaction)})
    }
    addReactions()
    function awaitReactions(){
        msg.awaitReactions((reaction, user) => user.id == message.author.id && (reactions.includes(reaction.emoji.name)),
            { max: 1, time: 300000 }).then(collected => {
                collected.first().users.remove(message.author.id)
                const reaction = collected.first()
                const quit = reaction._emoji.name == reactions[reactions.length - 1]
                if(quit == true) return message.channel.send(`Operation quit by user`)
                awaitReactions()
            }).catch(() => {
            message.reply(`Ended after 5 minutes of inactivity.`);
        });
    }
    awaitReactions()

    /*
    const myAnswer = 1; // no = 1

    await aki.step(myAnswer);
    await aki.back();

    console.log('question:', aki.question);
    console.log('answers:', aki.answers);*/

}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "Hue Administrator",
    disablable: true,
    premium: false
};
exports.help = {
    name: filename,
    category: __dirname.split("\\")[__dirname.split("\\").length - 1],
    description: "",
    usage: `${filename} [optional] <required>`
};
