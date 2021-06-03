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
        const missingPermissionsRegex = /(DiscordAPIError:\sMissing\sPermissions$\n)/im;
        const clean = await client.clean(client, err);
    
        if (missingPermissionsRegex.test(clean.substring(0, 1500))) {
            const channelPathRegex = /(^\s+path:\s)(\'\/channels\/[\d]+\/[^\n]*)/im
            var channelPath = clean.substring(0, 1500).match(channelPathRegex)
            if (!channelPath || channelPath === null) return; else channelPath = (typeof(channelPath[0]) == "string" ? channelPath[0] : channelPath[0].toString());
            
            var matchedChannelId = channelPath.match(/\d+/im)
            matchedChannelId = (Array.isArray(matchedChannelId) ? matchedChannelId[0] : client.config.errorChannel)
            try {
                const missingPermsChannel = client.channels.cache.get(matchedChannelId)
                if (!missingPermsChannel || missingPermsChannel === undefined || missingPermsChannel === null) throw new Error(`Failed to fetch channel by id: ${matchedChannelId || "Unable to fetch id"}`);
                const settings = await client.getSettings(missingPermsChannel.guild);   
    
                function getSendableChannel(guild = missingPermsChannel.guild) {
                    if (guild.channels.cache.has(guild.id)) return guild.channels.get(guild.id);
                    const generalChannel = guild.channels.cache.find(channel => channel.name === "general");
                    if (generalChannel) return generalChannel;
                    
                    return guild.channels.cache
                        .filter(channel => channel.type === "text" && channel.permissionsFor(client.user).has("SEND_MESSAGES"))
                        .sort((a, b) => a.position - b.position || Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
                        .first();
                }
    
                const cleanStackRegex = /(\s+at[^{]*)/im;
                let noStackCleanedErr = clean.replace(cleanStackRegex, "")
    
                const guildLogsChannel = client.getChannel(missingPermsChannel.guild, settings.logs.value);
                if (settings.logs.value === undefined) {
                    const firstSendableChannel = getSendableChannel(missingPermsChannel.guild);
                    if (firstSendableChannel && firstSendableChannel !== undefined && firstSendableChannel !== null) {
                        firstSendableChannel.send(`<@${missingPermsChannel.guild.ownerID}> MissingPermissions to send messages to channel: ${missingPermsChannel}`)
                        firstSendableChannel.send(client.errorEmbed({name: "MissingPermissions", message: noStackCleanedErr}))
                    } else return; // Bot can't send messages in any channel it can see
                } else if (guildLogsChannel && guildLogsChannel !== undefined && guildLogsChannel !== null) { // Send to logs channel
                    guildLogsChannel.send(`<@${missingPermsChannel.guild.ownerID}> MissingPermissions to send messages to channel: ${missingPermsChannel}`)
                    guildLogsChannel.send(client.errorEmbed({name: "MissingPermissions", message: noStackCleanedErr}))
                } else { // Logs channel exists but isn't configured properly
                    const firstSendableChannel = getSendableChannel(missingPermsChannel.guild);
                    if (firstSendableChannel && firstSendableChannel !== undefined && firstSendableChannel !== null) {
                        firstSendableChannel.send(`<@${missingPermsChannel.guild.ownerID}> MissingPermissions to send messages to channel: ${missingPermsChannel}`)
                        firstSendableChannel.send(client.errorEmbed({name: "MissingPermissions", message: noStackCleanedErr}))
                    } else return; // Bot can't send messages in any channel it can see
                }
            } catch (newErr) {
                client.channels.cache.get(client.config.errorChannel).send(`\`\`\`js\n${clean.substring(0, 1500)}\n\`\`\``)
                const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                client.logger.error(`Unhandled Rejection: ${errorMsg}`);
    
                const newErrorCleaned = await client.clean(client, newErr)
                client.channels.cache.get(client.config.errorChannel).send(`Another exception caught while trying to process the previous rejection: \`\`\`js\n${newErrorCleaned.substring(0, 1500)}\n\`\`\``)
                client.logger.error(`Another exception caught while trying to process the previous rejection: ${newErr}`);
            }
        } else {
            client.channels.cache.get(client.config.errorChannel).send(`\`\`\`js\n${clean.substring(0, 1500)}\n\`\`\``)
            const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
            client.logger.error(`Unhandled Rejection: ${errorMsg}`);
        }
    });
}