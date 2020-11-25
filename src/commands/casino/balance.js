const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { fire_brick_red } = require('../../util/jsons/colors.json');
const { addCommas } = require('../../util/functions/chatFunctions')
const User = require('../../util/models/user');

module.exports = {
    config: {
        name: "balance",
        aliases: ['lambies', 'checkbalance', 'atm'],
        usage: ``,
        description: "Check your current account balance.",
        accessableby: "Members",
        category: "casino"
    },
    run: async (bot, message, args) => {
        User.findOne({ user_id: message.author.id })
            .then(user => {
                if (!user) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`${message.author.username}, you do not have a Lambies account yet. Try talking in chat to earn Lambies and xp to level up!`))
                else return message.channel.send(
                    new MessageEmbed()
                        .setColor(fire_brick_red)
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                        .setDescription(stripIndents`
            Your account 💳 currently has \`${addCommas(user.money)}\` **Lambies** 💵
            `)
                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                        .setTimestamp()
                )
            })
    }
};