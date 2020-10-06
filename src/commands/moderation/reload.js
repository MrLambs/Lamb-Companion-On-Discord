const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path')

module.exports = {
    config: {
        name: "reload",
        usage: `[command name]`,
        description: "Shuts the bot down",
        accessibleby: "owner",
        category: "moderation"
    },
    run: async (bot, message, args) => {
        if (!message.author.id == `328912599276060673` || !message.author.id == `379149411567009792`) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You do not have permission to do that`));
        else {
            try {
                if (!args[0]) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(':x: Please provide a command name to reload!'));
                else {
                    const commandName = args[0].toLowerCase();
                    if (!bot.commands.get(commandName)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: No command name found with query provided. Please try again.`))
                    else {
                        readdirSync(join(__dirname, '..')).forEach(f => {
                            let files = readdirSync(join(__dirname, '..', f));
                            if (files.includes(commandName + '.js')) {
                                delete require.cache[require.resolve(`../${f}/${commandName}.js`)]
                                bot.commands.delete(commandName)
                                const pull = require(`../${f}/${commandName}.js`)
                                bot.commands.set(commandName, pull)

                                return message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(`:white_check_mark: Successfully reloaded \`${commandName}\` command!`))
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