module.exports = (client, app) => {
    return app.get("/status", (_, res) =>{
        res.json({status: "ok", code: "200"})
    })
}