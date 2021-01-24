module.exports = (client) => {
    return
    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser')
    const port = 1269
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());
    const { promisify } = require("util");
    const readdir = promisify(require("fs").readdir); 
    app.post('/run', async (req, res) => {
        console.log('input request');
        try{
          const content = req.body
          const rawEval = eval(content.data);
          const clean = await client.clean(client, rawEval);
          res.json({status: "success", result : clean, code: "200"})
        }catch(error){
          res.json({status: "error", result : error.name + " : " + error.message, code: "400"})
        }
    })
    async function service(){
        const public = await readdir('./src/api/HueAPI/public/');
        public.forEach(apiModule => {
            require(`./public/${apiModule}`)(client, app)
            client.logger.api(`Opening API Module: ${apiModule}`)
        })
        app.listen(port, () => {
            client.logger.api(`Hue API online, http://localhost:${port}`);
        })
    }
    service();
}