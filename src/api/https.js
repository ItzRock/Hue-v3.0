const { resolve } = require("path")

module.exports = (client) => {
    const https = require("https")
    client.apis.https = {}

    client.apis.https.get = (url) => {
        const data = new Promise((resolve, reject) => {
            https.get(url, (res) =>{
                res.on('data', async (raw) => { // do function when get data
                const output = JSON.parse(raw);
                resolve(output)
                })
            })
        })
        return data.then(output => {
            return output;
        })
    }
}