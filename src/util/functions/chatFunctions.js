const { prefix } = require('../jsons/config.json')

const getNeededXP = level => {
    return level * level * 100;
};

const capitalize = str => {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
};

const titleCase = oldStr => {
    return oldStr.charAt(0).toUpperCase() + oldStr.slice(1).toLowerCase()
};

const getExampleCommand = (bot, commandName) => {
    let command = bot.commands.get(commandName.toLowerCase());
    let exampleCommand = `(${prefix}${command.config.name} ${command.config.usage})`;

    return exampleCommand;
};

const getEmoji = (bot, id) => {
    return bot.emojis.cache.get(id).toString();
};

const addCommas = (nStr) => {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
};

export {
    getNeededXP,
    capitalize,
    titleCase,
    getExampleCommand,
    getEmoji,
    addCommas
}