const { MessageEmbed } = require('discord.js');
const { fire_brick_red } = require('../../util/jsons/colors.json');
const { stripIndents } = require('common-tags')

module.exports = {
    config: {
        name: "store",
        aliases: ['shop'],
        usage: ``,
        description: "Check what's for sale in the Shepherd's Market",
        accessableby: "Members",
        category: "casino"
    },
    run: async (bot, message, args) => {
        return message.channel.send(
            new MessageEmbed()
                .setTitle("Welcome to the Shepherd's Market")
                .setColor(fire_brick_red)
                .setDescription(stripIndents`
                INVENTORY ITEMS COMING SOON!
                ---
                TTS Message - 500 Lambies
                `)
                .setFooter(`Shepherd's Market`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                .setTimestamp()
        )
    }
};