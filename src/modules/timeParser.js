module.exports = (client) => {
    client.timeParser = function(input){
        const multiply = {
            ["d"]: 86400000,
            ["h"]: 3600000,
            ["m"]: 60000,
            ["s"]: 1000
        }
        const multipler = multiply[input.substring(input.length - 1, input.length).toLowerCase()]
        if(input.match(/\d+/) == undefined || multipler == undefined) throw new Error(`${input} is not a valid time format. Example (6D = 6 Days, 6H = 6 Hours, 6M = 6 Minutes.)`)
        return input.match(/\d+/)[0] * multipler
    }
}