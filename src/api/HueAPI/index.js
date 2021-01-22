module.exports = (client) => {
    const express = require('express');
    const app = express();
    const bodyParser = require('body-parser')
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json());
    const { promisify } = require("util");
    const readdir = promisify(require("fs").readdir); 

    async function service(){

    }
    service();
}