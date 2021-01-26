module.exports = (client, app) => {
    return app.get("/api/user/:discordID", async (req, res) =>{
        const raw = await client.database.verify.read(req.params.discordID)
        if(raw[0] == true){
            res.json({status: "ok", code: "200", robloxID: raw[1].RobloxID})
        }
        else res.json({status: "Not Found", code: "404", robloxID: raw[1].RobloxID})
    })
}