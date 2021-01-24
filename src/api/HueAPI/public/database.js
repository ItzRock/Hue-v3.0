module.exports = (client, app) => {
    return
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
}