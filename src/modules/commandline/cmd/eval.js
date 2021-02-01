module.exports = async (client, args) => {
    const code = args.join(" ");
    try {
      const evaled = eval(code);
      const clean = await client.clean(client, evaled);
      client.logger.log(`${clean.substring(0, 1500)}`);
    } catch (err) {
        client.logger.log(`ERROR xl\n${(await client.clean(client, err.name + ":" +err.message)).substring(0, 1500)}`);
    }
}