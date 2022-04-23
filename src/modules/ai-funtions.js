module.exports = (client) => {
    client.ai = {
        Cleverbot: async function(msg, params){
            const cleverbot = require("cleverbot-free");
            const response = cleverbot(msg, params.context)
            return response
        },
        Derieri: async function(msg, params){
            const Derieri = require('derieri');
            const deri = new Derieri.Client({
                islearning: params.isLearning
            });
            params.context.push(msg)
            const promise = new Promise((resolve, reject) => {
                deri.reply(msg, params.context).then(response => {
                    params.context.push(response)
                    console.log(`${Derieri}: ${response}`);
                    resolve(response)
                })
            })
            return await promise
            
        },
        SmartestChatBot: async function(msg, params){
            const smartestchatbot = require('smartestchatbot')
            const bot = new smartestchatbot.Client()
            const promise = new Promise((resolve, reject) => {
                bot.chat({
                    message: msg, 
                    name: client.user.username, 
                    owner:"Anthony", 
                    user: params.sessionID, 
                    language:"en"
                }).then(reply => resolve(reply))
            })
            return await promise
        }
    }
}