module.exports = (client, app) => {
    return app.get("/api/status", (_, res) =>{
        res.json({status: "ok", code: "200"})
    })
}