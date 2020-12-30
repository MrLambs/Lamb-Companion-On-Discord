const { MessageEmbed } = require('discord.js');
const { fire_brick_red } = require('../../util/jsons/colors.json');
const { stripIndents } = require('common-tags');
const { getEmoji, addCommas, getNeededXP } = require('../../util/functions/chatFunctions')
const User = require('../../util/models/user');

module.exports = {
    config: {
        name: "inventory",
        aliases: ['backpack'],
        usage: ``,
        description: "Check what's currently in your invenory",
        accessableby: "Members",
        category: "economy"
    },
    run: async (bot, message, args) => {
        User.findOne({ user_id: message.author.id })
            .then(user => {
                let itemCounter = 0;
                let itemsWithoutTtsCounter = { ...user.items };

                delete itemsWithoutTtsCounter.ttsCounter
                for (let item in itemsWithoutTtsCounter) {
                    if (itemsWithoutTtsCounter.hasOwnProperty(item)) {
                        itemCounter++
                    }
                }
                if (itemCounter < 1) itemsWithoutTtsCounter = 'Nothing';
                let currentLvl = user.level - 1,
                    totalXp = 0;
                while (currentLvl > 0) {
                    totalXp += getNeededXP(currentLvl)
                    currentLvl--
                }
                totalXp += user.xp;

                let inventEmbed = new MessageEmbed()
                    .setAuthor(`${message.author.username}'s Backpack`, message.author.displayAvatarURL({ dynamic: false, format: 'png' }))
                    .setColor(fire_brick_red)
                    .setDescription(stripIndents`
                    Account Level: **${user.level}**
                    Total Account ${getEmoji(bot, '711014609519247371')}: **${addCommas(totalXp)}**
                    Lambies in Stash: **${addCommas(user.money)}**
                    `)
                    .addField('Inventory', itemsWithoutTtsCounter)
                
                if (user.items.ttsCounter > 0) {
                    inventEmbed
                    .addField('Deeds & Tickets', stripIndents`
                    **${addCommas(user.items.ttsCounter)}** TTS Messages Redeemed
                    `)
                }

                return message.channel.send(inventEmbed)
            })
    }
};