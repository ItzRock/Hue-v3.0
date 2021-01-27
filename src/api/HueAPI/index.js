module.exports = (client) => {
    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser')
    const port = 555
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());
    const { promisify } = require("util");
    const readdir = promisify(require("fs").readdir); 
    async function service(){
        const public = await readdir('./src/api/HueAPI/public/');
        public.forEach(apiModule => {
            require(`./public/${apiModule}`)(client, app)
            client.logger.api(`Hue API Module: ${apiModule} Loaded into memory`)
        })
        app.listen(port, () => {
            client.logger.api(`Hue API online, http://localhost:${port}`);
        })
    }
    service();
}