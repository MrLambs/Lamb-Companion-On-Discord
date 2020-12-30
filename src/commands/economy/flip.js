const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { fire_brick_red } = require('../../util/jsons/colors.json');
const { getExampleCommand, titleCase, addCommas } = require('../../util/functions/chatFunctions');
const { getCoinFlipResult, addWinnings, deductBet, verifyBetAmount } = require('../../util/functions/casinoFunctions');
const User = require('../../util/models/user');

module.exports = {
    config: {
        name: "flip",
        aliases: ['flipcoin', 'cointoss', 'coinflip'],
        usage: `[bet] [heads/tails]`,
        description: "Check your current account balance.",
        accessableby: "Members",
        category: "economy"
    },
    run: async (bot, message, args) => {
        let bet = args[0],
            choice = args[1];
        if (!bet || !Number(bet) || Number(bet) < 1) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You **must** make a bet first! Your bet cannot be less than one. ${getExampleCommand(bot, 'flip')}`))
        else if (!choice || !['heads', 'tails'].includes(choice.toLowerCase())) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: Sorry, you must first select **__heads__** -or- **__tails__**. ${getExampleCommand(bot, 'flip')}`))
        else {
            bet = Number(bet)
            choice = choice.toLowerCase()
            User.findOne({ user_id: message.author.id })
                .then(user => {
                    let verified = verifyBetAmount(user, bet);
                    if (!verified) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: Sorry, your bet was declined. You do not have that much in your account. ${getExampleCommand(bot, 'roulette')}`))
                    let gameResult = getCoinFlipResult(choice);
                    switch (gameResult.res) {
                        case 'won':
                            addWinnings(user, bet);
                            return message.channel.send(
                                new MessageEmbed()
                                    .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSJki_4Z0UyjP9USnc7oP83JnP9mIzJWFgA2dD6jYNZa4qyDD8_&usqp=CAU')
                                    .setColor(fire_brick_red)
                                    .setDescription(`**Result: ${titleCase(gameResult.tossResult)}**\n---\nCongrats!\nYou won! New total: ${addCommas(user.money)} Lambies`)
                            )
                            break;
                        case 'lost':
                            deductBet(user, bet)
                            return message.channel.send(
                                new MessageEmbed()
                                    .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSJki_4Z0UyjP9USnc7oP83JnP9mIzJWFgA2dD6jYNZa4qyDD8_&usqp=CAU')
                                    .setColor(fire_brick_red)
                                    .setDescription(`**Result: ${titleCase(gameResult.tossResult)}**\n---\nSorry!\nYou lost. New Total: ${addCommas(user.money)} Lambies`)
                            )
                            break;
                    }
                })
        }
    }
};