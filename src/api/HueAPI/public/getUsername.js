module.exports = (client, app) => {
    return app.get("/api/user/:rblxID", async (req, res) =>{
        const noblox = require('noblox.js')
        try {
            const user = noblox.getUsernameFromId(req.params.rblxID).then(user => { return user })
            res.json({status: "ok", code: "200", username: user})    
        } catch (error) {
            res.json({status: "Not found", code: "404", username: "Not Found"}) 
        }
    })
}