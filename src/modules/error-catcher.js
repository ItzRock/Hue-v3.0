module.exports = (client) => {
    // Harry do stuff here
    process.on("uncaughtException", (err) => {
        const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
        try {
            client.logger.error(`Uncaught Exception: ${errorMsg}`);
        } catch (err) {
            console.log(`Uncaught Exception: ${errorMsg}`);
        }
    });
    process.on("unhandledRejection", async (err) => {
        function getSendableChannel(guild) {
            if (guild.channels.cache.has(guild.id)) return guild.channels.get(guild.id);
            const generalChannel = guild.channels.cache.find(channel => channel.name === "general");
            if (generalChannel) return generalChannel;
            
            return guild.channels.cache
                .filter(channel => channel.type === "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES"))
                .sort((a, b) => a.position - b.position || Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
                .first();
        }

        function logRejectionToConsole(err, cleanedErr) {
            client.channels.cache.get(client.config.errorChannel).send(`\`\`\`js\n${cleanedErr.substring(0, 1500)}\n\`\`\``)
            const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
            client.logger.error(`Unhandled Rejection: ${errorMsg}`);
        }
        
        const cleanStackRegex = /(\s+at[^{]*)/im;
        const regexMatches = {
            MissingPermissions : {
                Regex : /(DiscordAPIError:\sMissing\sPermissions$\n)/im,
                Function : async function(rejectionChannel) {
                    const guildSettings = await client.getSettings(rejectionChannel.guild);   
                    let noStackCleanedErr = clean.replace(cleanStackRegex, "")

                    const guildLogsChannel = client.getChannel(rejectionChannel.guild, settings.logs.value);
                    const firstSendableChannel = getSendableChannel(rejectionChannel.guild);

                    if (guildSettings.logs.value === undefined) {
                        
                        if (firstSendableChannel && firstSendableChannel !== undefined && firstSendableChannel !== null) {
                            firstSendableChannel.send(`<@${rejectionChannel.guild.ownerID}> MissingPermissions to send messages to channel: ${rejectionChannel}`)
                            firstSendableChannel.send(client.errorEmbed({name: "MissingPermissions", message: noStackCleanedErr}))

                        } else return; // Bot can't send messages in any channel it can see
                   
                    } else if (guildLogsChannel && guildLogsChannel !== undefined && guildLogsChannel !== null) { // Send to logs channel
                        
                        guildLogsChannel.send(`<@${rejectionChannel.guild.ownerID}> MissingPermissions to send messages to channel: ${rejectionChannel}`)
                        guildLogsChannel.send(client.errorEmbed({name: "MissingPermissions", message: noStackCleanedErr}))

                    } else { // Logs channel exists but isn't configured properly
                        
                        if (firstSendableChannel && firstSendableChannel !== undefined && firstSendableChannel !== null) {
                            firstSendableChannel.send(`<@${rejectionChannel.guild.ownerID}> MissingPermissions to send messages to channel: ${rejectionChannel}`)
                            firstSendableChannel.send(client.errorEmbed({name: "MissingPermissions", message: noStackCleanedErr}))

                        } else return; // Bot can't send messages in any channel it can see
                    }
                },
            },
        };
        
        const cleanedErr = await client.clean(client, err);
        const channelPathRegex = /(^\s+path:\s)(\'\/channels\/[\d]+\/[^\n]*)/im
        
        let matchedRejections = {};
        for (let [rejectionName, rejectionTable] of Object.entries(regexMatches)) {
            const matchedRejection = rejectionTable.Regex ? rejectionTable.Regex.test(cleanedErr.substring(0, 1500)) : undefined
            console.log(`continue case 1 ${matchedRejection}`)
            if (matchedRejection === undefined || !matchedRejection) continue;
            
            let channelPath = cleanedErr.substring(0, 1500).match(channelPathRegex)
            console.log(`continue case 2 ${channelPath}`)
            if (!channelPath || channelPath === undefined || channelPath === null) continue;
            else channelPath = (typeof(channelPath[0]) == "string" ? channelPath[0] : channelPath[0].toString());

            let channelId = channelPath.match(/\d+/im)
            channelId = (Array.isArray(channelId) ? channelId[0] : client.config.errorChannel)

            const rejectionChannel = client.channels.cache.get(channelId)
            if (!rejectionChannel || rejectionChannel === undefined || rejectionChannel === null) {
                client.logger.error(`Failed to fetch channel by id: ${rejectionChannel || "Unable to fetch id"}`);
                continue;
            };

            console.log(`finished case 1`)
            matchedRejections[rejectionName] = {
                RejectionChannel : rejectionChannel,
            };
        }

        if (Object.keys(matchedRejections).length <= 0) {
            console.log(`length <= 0, calling console rejection log case 1`)
            logRejectionToConsole(err, cleanedErr);
            return;
        };
        
        for (let [rejectionName, rejectionData] of Object.entries(matchedRejections)) {
            const rejectionFunction = regexMatches[rejectionName] ? regexMatches[rejectionName].Function : undefined;
            try {
                console.log(`calling rejection function for ${rejectionName}`)
                await rejectionFunction(rejectionData.RejectionChannel);
            } catch (newError) {
                console.log(`calling console rejection log case 2`)
                logRejectionToConsole(err, cleanedErr);
    
                const newErrorCleaned = await client.clean(client, newError)
                client.channels.cache.get(client.config.errorChannel).send(`Another exception caught while trying to process the previous rejection: \`\`\`js\n${newErrorCleaned.substring(0, 1500)}\n\`\`\``)
                client.logger.error(`Another exception caught while trying to process the previous rejection: ${newError}`);
            }
        }
    });
};
