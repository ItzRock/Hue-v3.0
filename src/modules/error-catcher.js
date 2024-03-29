const rejectionMessageTimeout = new Set();
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
        async function getSendableChannel(guild) {
            if (guild.channels.cache.has(guild.id)) return guild.channels.get(guild.id);
            const generalChannel = guild.channels.cache.find(channel => channel.name === "general");
            if (generalChannel) return generalChannel;

            return guild.channels.cache
                .filter(channel => channel.type === "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES"))
                .sort((a, b) => a.position - b.position || parseInt(a.id) - parseInt(b.id)) // Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
                .first();
        }

        async function logRejectionToConsole(err, cleanedErr) {
            client.channels.cache.get(client.config.errorChannel).send(`\`\`\`js\n${cleanedErr.substring(0, 1500)}\n\`\`\``)
            const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
            client.logger.error(`Unhandled Rejection: ${errorMsg}`);
        }
        
        async function sendEmbed(channel, rejectedChannel, err) {
            if (channel && channel !== undefined && channel !== null) {
                await channel.send(`<@${channel.guild.ownerID}> MissingPermissions to send messages to channel: ${rejectedChannel}`)
                await channel.send(client.errorEmbed({name: "", message: err}))
                return true;
            } else return false; // Bot can't send messages in any channel it can see
        };
        
        const cleanStackRegex = /(\s+at[^{]*)/im;
        const regexMatches = {
            MissingPermissions : {
                Regex : /(DiscordAPIError:\sMissing\sPermissions$\n)/im,
                Function : async function(error, rejectionChannel) {
                    const guildSettings = await client.getSettings(rejectionChannel.guild);   
                    let noStackCleanedErr = error.replace(cleanStackRegex, " :: ")

                    const guildLogsChannel = client.getChannel(rejectionChannel.guild, guildSettings.logs.value);
                    const firstSendableChannel = await getSendableChannel(rejectionChannel.guild);
                    
                    let immediateReturn = false
                    if (guildSettings.logs.value === undefined) {
                        
                        immediateReturn = !( await sendEmbed(firstSendableChannel, rejectionChannel, noStackCleanedErr) );
                        if (immediateReturn === true) return;
                   
                    } else if (guildLogsChannel && guildLogsChannel !== undefined && guildLogsChannel !== null) { // Send to logs channel
                        
                        guildLogsChannel.send(`<@${rejectionChannel.guild.ownerID}> MissingPermissions to send messages to channel: ${rejectionChannel}`)
                        guildLogsChannel.send(client.errorEmbed({name: "", message: noStackCleanedErr}))
                       
                        immediateReturn = !( await sendEmbed(firstSendableChannel, rejectionChannel, noStackCleanedErr) );
                        if (immediateReturn === true) return;

                    } else { // Logs channel exists but isn't configured properly
                       
                        immediateReturn = !( await sendEmbed(firstSendableChannel, rejectionChannel, noStackCleanedErr) );
                        if (immediateReturn === true) return;
                        
                    }
                },
            },
            UnknownMessage : {
                Regex : /(DiscordAPIError:\sUnknown\sMessage$\n)/im,
                Function : async function(error, rejectionChannel) {
                    return;
                },
            },
        };
        
        const cleanedErr = await client.clean(client, err);
        const channelPathRegex = /(^\s+path:\s)(\'\/channels\/[\d]+\/[^\n]*)/im
        
        let matchedRejections = {};
        for (let [rejectionName, rejectionTable] of Object.entries(regexMatches)) {
            const matchedRejection = rejectionTable.Regex ? rejectionTable.Regex.test(cleanedErr.substring(0, 1500)) : undefined
            if (matchedRejection === undefined || !matchedRejection) continue;
            
            if (rejectionMessageTimeout.has(rejectionName)) continue; 
            
            let channelPath = cleanedErr.substring(0, 1500).match(channelPathRegex)
            if (!channelPath || channelPath === undefined || channelPath === null) continue;
            else channelPath = (typeof(channelPath[0]) == "string" ? channelPath[0] : channelPath[0].toString());

            let channelId = channelPath.match(/\d+/im)
            channelId = (Array.isArray(channelId) ? channelId[0] : client.config.errorChannel)

            const rejectionChannel = client.channels.cache.get(channelId)
            if (!rejectionChannel || rejectionChannel === undefined || rejectionChannel === null) {
                client.logger.error(`Failed to fetch channel by id: ${rejectionChannel || "Unable to fetch id"}`);
                continue;
            };

            matchedRejections[rejectionName] = {
                Rejection : cleanedErr,
                RejectionChannel : rejectionChannel,
            };
        }

        if (Object.keys(matchedRejections).length <= 0) {
            await logRejectionToConsole(err, cleanedErr);
            return;
        };
        
        for (let [rejectionName, rejectionData] of Object.entries(matchedRejections)) {
            const rejectionFunction = regexMatches[rejectionName] ? regexMatches[rejectionName].Function : undefined;
            try {
                rejectionMessageTimeout.add(rejectionName);
                setTimeout(function(){ rejectionMessageTimeout.delete(rejectionName) }, 5000);
                await rejectionFunction(rejectionData.Rejection, rejectionData.RejectionChannel);
            } catch (newError) {
                await logRejectionToConsole(err, cleanedErr);
    
                const newErrorCleaned = await client.clean(client, newError)
                client.channels.cache.get(client.config.errorChannel).send(`Another exception caught while trying to process the previous rejection: \`\`\`js\n${newErrorCleaned.substring(0, 1500)}\n\`\`\``)
                client.logger.error(`Another exception caught while trying to process the previous rejection: ${newError}`);
            }
        }
    });
};
