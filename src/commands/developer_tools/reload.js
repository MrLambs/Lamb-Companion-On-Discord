const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const { my_discord_id } = require('../../util/jsons/config.json');

module.exports = {
    config: {
        name: "reload",
        usage: `[command name]`,
        description: "Shuts the bot down",
        accessibleby: "owner",
        category: "developer_tools"
    },
    run: async (bot, message, args) => {
        if (message.author.id !== my_discord_id) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You do not have permission to do that`));
        else {
            try {
                if (!args[0]) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(':x: Please provide a command name to reload!'));
                else {
                    const commandName = args[0].toLowerCase();
                    if (!bot.commands.get(commandName)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: No command name found with query provided. Please try again.`))
                    else {
                        const startRestart = new Date()
                        readdirSync(join(__dirname, '..')).forEach(f => {
                            let files = readdirSync(join(__dirname, '..', f));
                            if (files.includes(commandName + '.js')) {
                                delete require.cache[require.resolve(`../${f}/${commandName}.js`)]
                                bot.commands.delete(commandName)
                                const pull = require(`../${f}/${commandName}.js`)
                                bot.commands.set(commandName, pull)
                                const endRestart = new Date(),
                                    timeInMs = endRestart.getTime() - startRestart.getTime()
                                return message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(`:white_check_mark: Successfully reloaded \`${commandName}\` command!`).setFooter(`Operation took ${timeInMs}ms`))
                            }
                        })
                    }
                }
            } catch (err) {
                console.log(`[ERR] ${err.message}`)
                return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: Could not reload command. Please try again."))
            }
        }
    }
};