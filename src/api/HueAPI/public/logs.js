module.exports = (client, app) => {
    return app.get("/api/oldlogs", (_, res) =>{
        res.json({status: "ok", code: "200", logs: client.logHistory})
    })
}