module.exports = (client) => {
    client.games.chicken = async function(client, message){
        let map =[
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
        ];
        let discordMap = [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
        ]
        const player = {
            x: 0,
            y: 0,
            Health: 100,
            defence: 0
        }
        const enemy = {
            x: 0,
            y: 0,
            Health: 100,
            defence: 0
        }
        map[2][1] = 1
        map[2][6] = 2
        refreshMap()
        let GameAction = "Game Start"
        let enemyAction = ""
        let gameData = `Last Action: ${GameAction} | Enemy Action: ${enemyAction} | Player HP: ${player.Health} | Enemy HP: ${enemy.Health}\nControls: Up, Down, Left, Right, Block, Attack. (type in chat)}`

        const msg = await message.channel.send(`\`${GameAction}\`\n${':black_large_square:'.repeat(10)}\n:black_large_square:${discordMap[0].join("")}:black_large_square:\n:black_large_square:${discordMap[1].join("")}:black_large_square:\n:black_large_square:${discordMap[2].join("")}:black_large_square:\n:black_large_square:${discordMap[3].join("")}:black_large_square:\n:black_large_square:${discordMap[4].join("")}:black_large_square:\n${':black_large_square:'.repeat(10)}`)
        update()
        function inReach(){
             // shit code time
            try{if(map[player.y][player.x + 1] == 2) return true;}catch(err){return false}
            try{if(map[player.y][player.x - 1] == 2) return true;}catch(err){return false}
            try{if(map[player.y + 1][player.x] == 2) return true;}catch(err){return false}
            try{if(map[player.y - 1][player.x] == 2) return true;}catch(err){return false}
            try{if(map[player.y + 1][player.x + 1] == 2) return true}catch(err){return false}
            try{if(map[player.y - 1][player.x + 1] == 2) return true}catch(err){return false}
            try{if(map[player.y + 1][player.x - 1] == 2) return true}catch(err){return false}
            try{if(map[player.y - 1][player.x - 1] == 2) return true}catch(err){return false}
        }
        function movePlayer(direction){
            refreshMap()
            if(direction == "up") {
                if(player.y == 0) return;
                if(map[player.y - 1][player.x] == 2) return;
                map[player.y][player.x] = 0 
                map[player.y - 1][player.x] = 1  
                GameAction = "Move Up"
            }
            if(direction == "down") {
                if(player.y == 4) return;
                if(map[player.y + 1][player.x] == 2) return;
                map[player.y][player.x] = 0 
                map[player.y + 1][player.x] = 1
                GameAction = "Move Down"
            }
            if(direction == "left") {
                if(player.x == 0) return;
                if(map[player.y][player.x - 1] == 2) return;
                map[player.y][player.x] = 0 
                map[player.y][player.x - 1] = 1
                GameAction = "Move Left"
            }
            if(direction == "right") {
                if(player.x == 7) return;
                if(map[player.y][player.x + 1] == 2) return;
                map[player.y][player.x] = 0 
                map[player.y][player.x + 1] = 1
                GameAction = "Move Right"
            }
            if(direction == "block"){
                const defenceAmount = Math.round(client.randomNumber(1, 15))
                player.defence = defenceAmount;
                GameAction = `You Blocked`
            }
            if(direction == "attack" && inReach() == false){
                GameAction = `You tried to attack but you were too far!`
            }
            if(direction == "attack" && inReach() == true){
                const damage = Math.round(client.randomNumber(0, 40)) - enemy.defence
                if(damage < 0) return GameAction = `You Attacked but his defence blocked your attack.`
                enemy.Health = enemy.Health - damage;
                GameAction = `You Attacked ${damage} points.`
                enemy.defence = 0;
            }
            gameData = `Last Action: ${GameAction} | Enemy Action: ${enemyAction} | Player HP: ${player.Health} | Enemy HP: ${enemy.Health}\nControls: Up, Down, Left, Right, Block, Attack. (type in chat)}`
            refreshMap()
            screenDraw()
        }
        function refreshMap(){
            const alive = client.emojis.cache.get("793768306489557013")
            for (let i = 0; i < map.length; i++) {
                for (let index = 0; index < map[i].length; index++) {
                    if(map[i][index] === 0) discordMap[i][index] = ":white_large_square:"
                    if(map[i][index] === 1) {
                        player.x = index;
                        player.y = i;
                        discordMap[i][index] = ":chicken:"
                    }
                    if(map[i][index] == 2) {
                        enemy.x = index;
                        enemy.y = i;
                        discordMap[i][index] = alive
                    }
                }
            }
        }
        const endGame = ["end", "stop", "cancel", "quit",]
        async function getControls(){
            if(player.Health < 0) return lose();
            if(enemy.Health < 0) return win();
            let filter = m => m.author.id === message.author.id
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 600000,
                errors: ['time']
            }).then(m => {
                m = m.first()
                if(endGame.includes(m.content)) {
                    GameAction = "Game Ended No Winner!"
                    gameData = `Last Action: ${GameAction} | Enemy Action: ${enemyAction} | Player HP: ${player.Health} | Enemy HP: ${enemy.Health}\nControls: Up, Down, Left, Right, Block, Attack. (type in chat)}`

                    screenDraw();
                    return;
                }
                update(m.content.toLowerCase());
                m.delete()
            })

            return;
        }
        function screenDraw(){
            msg.edit(`\`${gameData}\`\n${':black_large_square:'.repeat(10)}\n:black_large_square:${discordMap[0].join("")}:black_large_square:\n:black_large_square:${discordMap[1].join("")}:black_large_square:\n:black_large_square:${discordMap[2].join("")}:black_large_square:\n:black_large_square:${discordMap[3].join("")}:black_large_square:\n:black_large_square:${discordMap[4].join("")}:black_large_square:\n${':black_large_square:'.repeat(10)}`)
        }
        function enemyTurn(){
            if(player.Health < 0) return lose();
            if(enemy.Health < 0) return win();
            function enemyMove(direction){
                if(player.Health < 0) return lose();
                if(enemy.Health < 0) return win();
                refreshMap()
                if(direction == "up") {
                    if(enemy.y == 0) return false;
                    if(map[enemy.y - 1][enemy.x] == 1) return false;
                    map[enemy.y][enemy.x] = 0 
                    map[enemy.y - 1][enemy.x] = 2 
                    enemyAction = "Enemy Move Up"
                    return true
                }
                if(direction == "down") {
                    if(enemy.y == 4) return false;
                    if(map[enemy.y + 1][enemy.x] == 1) return false;
                    map[enemy.y][enemy.x] = 0 
                    map[enemy.y + 1][enemy.x] = 2
                    enemyAction = "Enemy Move Down"
                    return true
                }
                if(direction == "left") {
                    if(enemy.x == 0) return false;
                    if(map[enemy.y][enemy.x - 1] == 1) return false;
                    map[enemy.y][enemy.x] = 0 
                    map[enemy.y][enemy.x - 1] = 2
                    enemyAction = "Enemy Move Left"
                    return true
                }
                if(direction == "right") {
                    if(enemy.x == 7) return false;
                    if(map[enemy.y][enemy.x + 1] == 1) return false;
                    map[enemy.y][enemy.x] = 0 
                    map[enemy.y][enemy.x + 1] = 2
                    enemyAction = "Enemy Move Right"
                    return true
                }
                if(player.Health < 0) return lose();
            if(enemy.Health < 0) return win();  
                refreshMap()
            }
            
            function decideMove(){
                const move = Math.round(client.randomNumber(0, 5))
                if(move == 0){
                    const action = enemyMove("up")
                    if(action == false) decideMove()
                }
                if(move == 1){
                    const action = enemyMove("down")
                    if(action == false) decideMove()
                }
                if(move == 3){
                    const action = enemyMove("left")
                    if(action == false) decideMove()
                }
                if(move == 4){
                    const action = enemyMove("right")
                    if(action == false) decideMove()
                }
            }
            function enemyAttack(){
                const damage = Math.round(client.randomNumber(10, 40)) - player.defence
                if(damage < 0) return GameAction = `Enemy Attacked but your defence blocked his attack.`
                player.Health = player.Health - damage;
                enemyAction = `Enemy Attacked you ${damage} points.`
                gameData = `Last Action: ${GameAction} | Enemy Action: ${enemyAction} | Player HP: ${player.Health} | Enemy HP: ${enemy.Health}\nControls: Up, Down, Left, Right, Block, Attack. (type in chat)}`
                player.defence = 0;
            }   
            function enemyBlock(){
                const defenceAmount = Math.round(client.randomNumber(10, 20))
                enemy.defence = defenceAmount;
                enemyAction = `Enemy Blocked`
                gameData = `Last Action: ${GameAction} | Enemy Action: ${enemyAction} | Player HP: ${player.Health} | Enemy HP: ${enemy.Health}\nControls: Up, Down, Left, Right, Block, Attack. (type in chat)}`
                refreshMap()
            }
            if(inReach() == true){
                const move = Math.round(client.randomNumber(0,4))
                if(move == 1) decideMove()
                if(move == 2 || move== 4) enemyAttack()
                if(move == 3) enemyBlock()
            } else decideMove()
            refreshMap()
            refreshMap()
            screenDraw()
            turn = true;
        }
        function lose(){
            const alive = client.emojis.cache.get("793768306489557013")
            for (let i = 0; i < map.length; i++) {
                for (let index = 0; index < map[i].length; index++) {
                    if(map[i][index] === 0) discordMap[i][index] = ":white_large_square:"
                    if(map[i][index] === 1) {
                        player.x = index;
                        player.y = i;
                        discordMap[i][index] = "<:playerDead:793777589620703242>"
                    }
                    if(map[i][index] == 2) {
                        enemy.x = index;
                        enemy.y = i;
                        discordMap[i][index] = alive
                    }
                }
            }
            gameData = "<:playerDead:793777589620703242>You Lose! Your chicken died, in order to play again buy another chicken."
            msg.edit(`${gameData}\n${':black_large_square:'.repeat(10)}\n:black_large_square:${discordMap[0].join("")}:black_large_square:\n:black_large_square:${discordMap[1].join("")}:black_large_square:\n:black_large_square:${discordMap[2].join("")}:black_large_square:\n:black_large_square:${discordMap[3].join("")}:black_large_square:\n:black_large_square:${discordMap[4].join("")}:black_large_square:\n${':black_large_square:'.repeat(10)}`)
        }
        async function win(){
            const alive = client.emojis.cache.get("793768306481430549")
            for (let i = 0; i < map.length; i++) {
                for (let index = 0; index < map[i].length; index++) {
                    if(map[i][index] === 0) discordMap[i][index] = ":white_large_square:"
                    if(map[i][index] === 1) {
                        player.x = index;
                        player.y = i;
                        discordMap[i][index] = ":chicken:"
                    }
                    if(map[i][index] == 2) {
                        enemy.x = index;
                        enemy.y = i;
                        discordMap[i][index] = alive
                    }
                }
            }
            client.Inventory.add("rubber chicken", message.author.id)
            const money = Math.round(client.randomNumber(40, 120))
            const info = await client.database.economy.read(message.author.id)

            client.database.economy.setMoney(message.author.id, parseInt(info.Wealth) + parseInt(money));
            gameData =`:chicken::trophy: You won!! Not only your chicken is alive, you also won $${money}!` 
            msg.edit(`${gameData}\n${':black_large_square:'.repeat(10)}\n:black_large_square:${discordMap[0].join("")}:black_large_square:\n:black_large_square:${discordMap[1].join("")}:black_large_square:\n:black_large_square:${discordMap[2].join("")}:black_large_square:\n:black_large_square:${discordMap[3].join("")}:black_large_square:\n:black_large_square:${discordMap[4].join("")}:black_large_square:\n${':black_large_square:'.repeat(10)}`)
        }
        async function update(action){
            if(player.Health < 0) return lose();
            if(enemy.Health < 0) return win();
            gameData = `Last Action: ${GameAction} | Enemy Action: ${enemyAction} | Player HP: ${player.Health} | Enemy HP: ${enemy.Health}\nControls: Up, Down, Left, Right, Block, Attack. (type in chat)}`
            movePlayer(action)
            enemyTurn()
            getControls()
        }
        
    }
}