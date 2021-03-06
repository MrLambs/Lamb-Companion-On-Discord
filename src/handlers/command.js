const { readdirSync } = require("fs");

module.exports = (bot) => {
    const load = dirs => {
        const commands = readdirSync(`./src/commands/${ dirs }/`).filter(d => d.endsWith('.js'));
        for (let file of commands) {
            const pull = require(`../commands/${ dirs }/${ file }`)
            bot.commands.set(pull.config.name, pull);
            if (pull.config.aliases) pull.config.aliases.forEach(a => bot.aliases.set(a, pull.config.name))
        };
    };
    ["developer_tools", "misc", "music", 'economy', 'images', 'giveaways', 'escape_from_tarkov'].forEach(x => load(x))
};