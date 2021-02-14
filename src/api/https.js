const { resolve } = require("path")

module.exports = (client) => {
    const https = require("https")
    const http = require("http")
    client.apis.https = {}
    client.apis.https.get = (url) => {
        const data = new Promise((resolve, reject) => {
            https.get(url, (res) =>{
                res.on('data', async (raw) => { // do function when get data
                const output = JSON.parse(raw);
                resolve(output)
                })
            }).on('error', (e) => {
                setTimeout(()=> {
                    https.get(url, (res) =>{
                        res.on('data', async (raw) => { // do function when get data
                        const output = JSON.parse(raw);
                        resolve(output)
                        })
                    })
                },2000)
            });
        })
        return data.then(output => {
            return output;
        })
    }
    client.apis.https.post = (data, options) => {
        const Promisedata = new Promise((resolve, reject) => {
            const req = http.request(options, res => {
                console.log(`statusCode: ${res.statusCode}`)
              
                res.on('data', d => {
                    const output = JSON.parse(d);
                    resolve(output)
                })
              })
              
              req.on('error', error => {
                resolve(error)
              })
              
              req.write(data)
              req.end()
        })
        return Promisedata.then(output => {
            return output;
        })
    }
}