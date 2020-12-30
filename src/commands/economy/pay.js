const mongoose = require('mongoose');
const User = require('../../util/models/user');
const { MessageEmbed } = require('discord.js');
const { verifyBetAmount } = require('../../util/functions/casinoFunctions');
const { getExampleCommand, addCommas } = require('../../util/functions/chatFunctions');
const { fire_brick_red } = require('../../util/jsons/colors.json');

module.exports = {
    config: {
        name: "pay",
        aliases: ['give', 'loan'],
        usage: `[amount] [tag a member]`,
        description: "Inflate their bank account!",
        accessableby: "Members",
        category: "economy"
    },
    run: async (bot, message, args) => {
        try {   
            let amountToPay = args[0]
            memberToPay = args[1];
            if (!amountToPay || !Number(amountToPay)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You must enter a real number. ${getExampleCommand(bot, 'pay')}`));
            else if (!memberToPay || Number(memberToPay)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You must tag a member to pay. ${getExampleCommand(bot, 'pay')}`));
            else {
                amountToPay = Number(amountToPay);
                let memberTag = message.mentions.members.first();
                if (!memberTag) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You must tag a member to pay. ${getExampleCommand(bot, 'pay')}`));
                else {
                    User.findOne({ user_id: message.author.id })
                    .then(user => {
                        if (user) {
                            let verified = verifyBetAmount(user, amountToPay);
                            if (!verified) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: Sorry, your bet was declined. You do not have that much in your account. ${getExampleCommand(bot, 'pay')}`))
                            else {
                                User.findOne(({ user_id: memberTag.id }))
                                    .then(member => {
                                        let payEmbed = new MessageEmbed()
                                            .setColor(fire_brick_red)
                                            .setAuthor(`${message.author.username} just paid ${memberTag.user.username}`, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                                            .setDescription(`💵 \`${amountToPay}\` **Lambies** 💵`)
                                            .addField(`New total for ${message.author.username}:`, `\`${addCommas((user.money - amountToPay))}\` **Lambies**`)
                                            .setTimestamp()
                                            .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }));
                                        if (!member) {
                                            const newUser = new User({
                                                _id: mongoose.Types.ObjectId(),
                                                user_id: memberTag.user.id,
                                                username: memberTag.user.username,
                                                money: amountToPay,
                                                xp: 0,
                                                level: 1
                                            })
                                            user.money -= amountToPay;
                                            newUser.save();
                                            user.save();
                                            payEmbed.addField(`New total for ${memberTag.user.username}:`, `\`${addCommas(newUser.money)}\` **Lambies** `)
                                            return message.channel.send(payEmbed)
                                        }
                                        else {
                                            member.money += amountToPay;
                                            user.money -= amountToPay;
                                            member.save();
                                            user.save();
                                            payEmbed.addField(`New total for ${memberTag.user.username}:`, `\`${addCommas(member.money)}\` **Lambies**`)
                                            return message.channel.send(payEmbed)
                                        }
                                    })
                            }
                        }
                    })
                }
            }
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
            message.channel.send(new RichEmbed().setColor("RED").setDescription(':x: Sorry, something went wrong. Please make sure you tagged another guild member.'))
        }
    }
};