const { MessageEmbed } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');
const { getExampleCommand, titleCase } = require('../../util/functions/chatFunctions')
const cleverbot = require("cleverbot-free");

module.exports = {
    config: {
        name: "cleverbot",
        aliases: ["cb", "cbot", "clever"],
        usage: `[query]`,
        description: "Start a conversation with CleverBot",
        accessibleby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        try {
            if (!args) return message.channel.send(
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`:x: Please say something to cleverbot! ${getExampleCommand(bot, 'cleverbot')}`)
            )
            message.channel.send(
                new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(':mag: Speaking with CleverBot..')
            ).then(async msg => {
                let query = args.join(' ')
                cleverbot(query).then(res => {
                    msg.edit(
                        new MessageEmbed()
                            .setColor(orange)
                            .setAuthor(`CleverLamb`, bot.user.displayAvatarURL())
                            .addField('Query', titleCase(query))
                            .addField("CleverLamb's Response:", res)
                    )
                })
            })
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};