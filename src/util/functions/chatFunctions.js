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

export {
    getNeededXP,
    capitalize,
    titleCase,
    getExampleCommand
}