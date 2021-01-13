module.exports = (client) => {
    client.apis.youtube = {}
    const authentication = {
        maxResults: 10,
        key: client.config.apiKeys.yt
    }
    client.apis.youtube.search = async function(searchFor){
        const promise = new Promise((resolve, reject) => {
            require('youtube-search')(searchFor, authentication, function(err, results) {
                if(err) return console.log(err);
                resolve(results)
            });
        })
        const results_1 = await promise
        return results_1
    }
}