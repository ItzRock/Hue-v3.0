module.exports = (client, app) => {
    app.post("/api/findpending/", async (req, res) =>{
        const body = req.body

        if(client.activeVerifications.has(body.robloxid.toString())){
            client.activeVerifications.delete(body.robloxid.toString())
            client.clearToVerify.set(body.discordid.toString(), {
                robloxID: body.robloxid.toString(),
                discordID: body.discordid.toString()
            })
        }

        res.json({status: "ok", code: "200"})
    })
    return app.get("/api/findpending/:user", async (req, res) =>{
        const user = req.params.user
        const data = client.activeVerifications.get(user)
        if(data == undefined){
            return res.json({status: "Not Found", code: "404"})
        }
        else {
            return res.json({status: "ok", code : 200, data: {
                user: data.user,
                robloxID: data.robloxID,
            }})
        }
    })
}