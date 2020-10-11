const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { fire_brick_red } = require('../../util/jsons/colors.json');
const { getBlackJackGame, finishBlackJackGame } = require('../../util/functions/casinoFunctions');
const User = require('../../util/models/user');

module.exports = {
    config: {
        name: "blackjack",
        aliases: ['bj', '21'],
        usage: ``,
        description: "Play a game of BlackJack against the bot",
        accessableby: "Members",
        category: "casino"
    },
    run: async (bot, message, args) => {
        if (!message.guild.me.hasPermission("ADD_REACTIONS")) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: I do not have the permission to add reactions."))
        else {
            let { playerHand, botHand } = getBlackJackGame(),
                playerTotal = playerHand.card1 + playerHand.card2,
                botTotal = botHand.card1 + botHand.card2,
                playerArray = [playerHand.card1, playerHand.card2],
                botArray = [botHand.card1, botHand.card2],
                embed = new MessageEmbed()
                    .setAuthor(`${message.author.username} started a game of BlackJack!`, message.author.displayAvatarURL())
                    .setColor(fire_brick_red)
                    .setDescription(stripIndents`
        React with 🤚 to **hit** -or- 🛑 to **stay**

        :hearts: :spades: :diamonds: :clubs:
            `)
                    .addField('Your Hand:', `${playerHand.card1}, ${playerHand.card2}: ${playerTotal}`)
                    .addField(`${bot.user.username}'s Hand:`, `${botHand.card1}, ??: ??`);

            message.channel.send(embed).then(async msg => {
                await msg.react('🤚');
                await msg.react('🛑');

                const standFilter = (reaction, user) => reaction.emoji.name === '🛑' && user.id === message.author.id,
                    hitFilter = (reaction, user) => reaction.emoji.name === '🤚' && user.id === message.author.id,
                    stand = msg.createReactionCollector(standFilter, {
                        time: 60000,
                        max: 1
                    }),
                    hit = msg.createReactionCollector(hitFilter, {
                        time: 60000
                    })

                let botSum = botArray.reduce((a, b) => a + b),
                    playerSum = playerArray.reduce((a, b) => a + b);

                if (playerSum >= 21 && botCount >= 21) {
                    embed.fields = [];
                    embed
                        .setTitle(`${message.author.username} has bust!`)
                        .addField('Your Hand:', `${playerArray}: ${playerSum}`)
                        .addField(`${bot.user.username}'s Hand:`, `${botArray}: ${botSum}`)
                    finishBlackJackGame(msg, embed, hit, stand);
                } else if (playerSum === 21 && botSum < 21 || playerSum === 21 && botSum > 21) {
                    embed.fields = [];
                    embed
                        .setColor("GREEN")
                        .setTitle(`${message.author.username} has won`)
                        .addField('Your Hand:', `${playerArray}: ${playerSum}`)
                        .addField(`${bot.user.username}'s Hand:`, `${botArray}: ${botSum}`)
                        .setDescription(`${message.author.username} has won with a count of ${playerSum}!`)
                    finishBlackJackGame(msg, embed, hit, stand);
                } else if (botSum === 21 && playerSum < 21) {
                    embed.fields = [];
                    embed
                        .setTitle(`${bot.user.username} has won!`)
                        .addField('Your Hand:', `${playerArray}: ${playerSum}`)
                        .addField(`${bot.user.username}'s Hand:`, `${botArray}: ${botSum}`)
                        .setDescription(`${bot.user.username} has won with a count of ${botSum}!`)
                    finishBlackJackGame(msg, embed, hit, stand);
                }



                stand.on('collect', r => {
                    if (playerSum >= 21 && botCount >= 21) {
                        embed.fields = [];
                        embed
                            .addField('Your Hand:', `${playerArray}: ${playerSum}`)
                            .addField(`${bot.user.username}'s Hand:`, `${botArray}: ${botSum}`)
                            .setDescription(`${message.author.username} has bust!`)
                        finishBlackJackGame(msg, embed, hit, stand);
                    } else if (playerSum === 21 && botSum < 21) {
                        embed.fields = [];
                        embed
                            .addField('Your Hand:', `${playerArray}: ${playerSum}`)
                            .addField(`${bot.user.username}'s Hand:`, `${botArray}: ${botSum}`)
                            .setDescription(`${message.author.username} has won with a count of ${playerSum}!`)
                        finishBlackJackGame(msg, embed, hit, stand);
                    } else if (playerSum === 21 && botSum > 21) {
                        embed.fields = [];
                        embed
                            .addField('Your Hand:', `${playerArray}: ${playerSum}`)
                            .addField(`${bot.user.username}'s Hand:`, `${botArray}: ${botSum}`)
                            .setDescription(`${message.author.username} has won with a count of ${playerSum}!`)
                        finishBlackJackGame(msg, embed, hit, stand);
                    } else if (botSum === 21 && playerSum < 21) {
                        embed.fields = [];
                        embed
                            .addField('Your Hand:', `${playerArray}: ${playerSum}`)
                            .addField(`${bot.user.username}'s Hand:`, `${botArray}: ${botSum}`)
                            .setDescription(`${bot.user.username} has won with a count of ${botSum}!`)
                        finishBlackJackGame(msg, embed, hit, stand);
                    } else if (playerSum < 21 && botSum < 21) {
                        if (playerSum > botSum) {
                            embed.fields = [];
                            embed
                                .addField('Your Hand:', `${playerArray}: ${playerSum}`)
                                .addField(`${bot.user.username}'s Hand:`, `${botArray}: ${botSum}`)
                                .setDescription(`${message.author.username} has won with a count of ${playerSum}!`)
                            finishBlackJackGame(msg, embed, hit, stand);
                        } else if (botSum > playerSum) {
                            embed.fields = [];
                            embed
                                .addField('Your Hand:', `${playerArray}: ${playerSum}`)
                                .addField(`${bot.user.username}'s Hand:`, `${botArray}: ${botSum}`)
                                .setDescription(`${bot.user.username} has won with a count of ${botSum}!`)
                            finishBlackJackGame(msg, embed, hit, stand);
                        }
                    }
                })
            })
        }
    }
};