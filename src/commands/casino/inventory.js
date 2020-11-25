const { MessageEmbed } = require('discord.js');
const { fire_brick_red } = require('../../util/jsons/colors.json');
const { stripIndents } = require('common-tags');
const User = require('../../util/models/user');

module.exports = {
    config: {
        name: "inventory",
        aliases: ['backpack'],
        usage: ``,
        description: "Check what's currently in your invenory",
        accessableby: "Members",
        category: "casino"
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
                let inventEmbed = new MessageEmbed()
                    .setAuthor(`${message.author.username}'s Backpack`, message.author.displayAvatarURL({ dynamic: false, format: 'png' }))
                    .setColor(fire_brick_red)
                    .addField('Inventory', itemsWithoutTtsCounter)
                
                if (user.items.ttsCounter > 0) {
                    inventEmbed
                    .addField('Deeds & Tickets', stripIndents`
                    \`\`${user.items.ttsCounter}\`\` TTS Messages Redeemed
                    `)
                }

                return message.channel.send(inventEmbed)
            })
    }
};