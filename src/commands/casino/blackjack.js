const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const { fire_brick_red } = require('../../util/jsons/colors.json');
const { getBlackJackGame, finishBlackJackGame, filterCardArrays, getRandomCardSuit, addWinnings, deductBet, verifyBetAmount } = require('../../util/functions/casinoFunctions');
const { titleCase, getExampleCommand, addCommas } = require('../../util/functions/chatFunctions');
const User = require('../../util/models/user');

module.exports = {
        config: {
                name: "blackjack",
                aliases: ['bj', '21'],
                usage: `[bet]`,
                description: "Play a game of BlackJack against the bot",
                accessableby: "Members",
                category: "casino"
        },
        run: async (bot, message, args) => {
                let playerBet = args[0];
                if (!message.guild.me.hasPermission("ADD_REACTIONS")) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: I do not have the permission to add reactions."))
                else if (!playerBet || !Number(playerBet) || Number(playerBet < 1)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`You must make a bet first! Your bet cannot be less than 1. ${getExampleCommand(bot, 'blackjack')}`));
                else {
                        let { playerHand, botHand } = getBlackJackGame(),
                                playerTotal = playerHand.card1 + playerHand.card2,
                                botTotal = botHand.card1 + botHand.card2,
                                playerArray = [playerHand.card1, playerHand.card2],
                                botArray = [botHand.card1, botHand.card2],
                                tenValues = ['J', 'K', 'Q', 10];

                        let { valueArrays, filterArrays } = filterCardArrays(playerArray, botArray, tenValues)
                        let { newPlayArr, newBotArr } = filterArrays;
                        playerBet = Number(playerBet);

                        let botSum = valueArrays.botValueArr.reduce((a, b) => a + b),
                                playerSum = valueArrays.playValueArr.reduce((a, b) => a + b);
                        User.findOne({ user_id: message.author.id })
                                .then(user => {
                                        let verified = verifyBetAmount(user, playerBet);
                                        if (!verified) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: Sorry, your bet was declined. You do not have that much in your account. ${getExampleCommand(bot, 'blackjack')}`))

                                        let embed = new MessageEmbed()
                                                .setAuthor(`${message.author.username} started a game of LambJack!`, message.author.displayAvatarURL())
                                                .setColor(fire_brick_red)
                                                .setDescription(stripIndents`
        __React with 🤚 to **hit** -or- 🛑 to **stay**__

        - You will **__only__** get **__1 move__**, so choose wisely!
        - Bot chooses whether aces are worth 1 or 11

    :hearts: :spades: :diamonds: :clubs:
            `)
                                                .addField('Your Hand:', stripIndents`
                    ${filterArrays.newPlayArr.join(' | ')}

                    __Your total:__ ${playerTotal}
                    `)
                                                .addField(stripIndents`
                ${bot.user.username}'s Hand:`, `${filterArrays.newBotArr[0]} | ??

                __Bot's total:__  ??
                `)
                                                .setFooter(`Please wait a couple seconds before reacting - Your response time closes in 60 seconds`)

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

                                                if (playerSum > 21 && botSum >= 21) {
                                                        deductBet(user, playerBet)
                                                        embed.fields = [];
                                                        embed
                                                                .setAuthor(`${message.author.username} has bust!`, message.author.displayAvatarURL())
                                                                .addField('Your Hand:', stripIndents`${playerArray.join(' | ')}
                        
                        __Your total:__ ${playerSum}
                        `)
                                                                .addField(`${bot.user.username}'s Hand:`, stripIndents`${botArray.join(' | ')}
                        
                        __Bot's total:__ ${botSum}`)
                                                                .setDescription(stripIndents`
                            Bust! Your count: ${playerSum}

                            [**${addCommas(user.money)} Lambies** 💵]

                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                        finishBlackJackGame(msg, embed, hit, stand);
                                                } else if (playerSum === 21 && botSum < 21 || playerSum === 21 && botSum > 21) {
                                                        embed.fields = [];
                                                        addWinnings(user, playerBet)
                                                        embed
                                                                .setColor("GREEN")
                                                                .setAuthor(`${message.author.username} has won!`, message.author.displayAvatarURL())
                                                                .addField('Your Hand:', stripIndents`${playerArray.join(' | ')}

                        __Your total:__ ${playerSum}
                        `)
                                                                .addField(`${bot.user.username}'s Hand:`, stripIndents`${botArray.join(' | ')}
                        
                        __Bot's total:__ ${botSum}`)
                                                                .setDescription(stripIndents`
                        Won with a count of ${playerSum}!

                        [**${addCommas(user.money)} Lambies** 💵]

                        :hearts: :spades: :diamonds: :clubs:
                        `)
                                                        finishBlackJackGame(msg, embed, hit, stand);
                                                } else if (botSum === 21 && playerSum < 21) {
                                                        embed.fields = [];
                                                        deductBet(user, playerBet)
                                                        embed
                                                                .setAuthor(`${message.author.username} has lost!`, message.author.displayAvatarURL())
                                                                .addField('Your Hand:', stripIndents`${playerArray.join(' | ')}
                        
                        __Your total:__ ${playerSum}
                        `)
                                                                .addField(`${bot.user.username}'s Hand:`, stripIndents`${botArray.join(' | ')}
                        
                        __Bot's total:__ ${botSum}
                        `)
                                                                .setDescription(stripIndents`
                        Lost! ${bot.user.username} has won with a count of ${botSum}!

                        [**${addCommas(user.money)} Lambies** 💵]

                        :hearts: :spades: :diamonds: :clubs:
                        `)
                                                        finishBlackJackGame(msg, embed, hit, stand);
                                                }


                                                stand.on('collect', r => {
                                                        if (playerSum >= 21 && botSum >= 21) {
                                                                embed.fields = [];
                                                                deductBet(user, playerBet)
                                                                embed
                                                                        .setAuthor(`${message.author.username} has bust!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}
                            `)
                                                                        .setDescription(stripIndents`
                            Bust! Your count: ${playerSum}

                            [**${addCommas(user.money)} Lambies** 💵]

                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (playerSum === 21 && botSum < 21) {
                                                                embed.fields = [];
                                                                addWinnings(user, playerBet)
                                                                embed
                                                                        .setColor("GREEN")
                                                                        .setAuthor(`${message.author.username} has won!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(stripIndents`
                            Won with a count of ${playerSum}!

                            [**${addCommas(user.money)} Lambies** 💵]

                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (playerSum === 21 && botSum > 21) {
                                                                embed.fields = [];
                                                                addWinnings(user, playerBet)
                                                                embed
                                                                        .setColor("GREEN")
                                                                        .setAuthor(`${message.author.username} has won!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(`
                            Won with a count of ${playerSum}!

                            [**${addCommas(user.money)} Lambies** 💵]

                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (botSum === 21 && playerSum <= 21) {
                                                                embed.fields = [];
                                                                deductBet(user, playerBet)
                                                                embed
                                                                        .setAuthor(`${message.author.username} has lost!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(stripIndents`
                            Lost! ${bot.user.username} has won with a count of ${botSum}!

                            [**${addCommas(user.money)} Lambies** 💵]

                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (playerSum > 21 && botSum < 21) {
                                                                embed.fields = [];
                                                                deductBet(user, playerBet)
                                                                embed
                                                                        .setAuthor(`${message.author.username} has bust!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(stripIndents`
                            Bust with a count of ${playerSum}!

                            [**${addCommas(user.money)} Lambies** 💵]

                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (botSum > 21 && playerSum < 21) {
                                                                embed.fields = [];
                                                                addWinnings(user, playerBet)
                                                                embed
                                                                        .setColor('GREEN')
                                                                        .setAuthor(`${message.author.username} has won!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(stripIndents`
                            ${bot.user.username} has bust with a count of ${botSum}!

                            [**${addCommas(user.money)} Lambies** 💵]

                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (playerSum < 21 && botSum < 21) {
                                                                if (playerSum > botSum) {
                                                                        embed.fields = [];
                                                                        addWinnings(user, playerBet)
                                                                        embed
                                                                                .setColor("GREEN")
                                                                                .setAuthor(`${message.author.username} has won!`, message.author.displayAvatarURL())
                                                                                .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                                
                                __Your total:__ ${playerSum}`)
                                                                                .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                                
                                __Bot's total:__ ${botSum}`)
                                                                                .setDescription(stripIndents`
                                Won with a count of ${playerSum}!

                                [**${addCommas(user.money)} Lambies** 💵]
                                
                                :hearts: :spades: :diamonds: :clubs:
                                `)
                                                                                .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                        finishBlackJackGame(msg, embed, hit, stand);
                                                                } else {
                                                                        embed.fields = [];
                                                                        deductBet(user, playerBet)
                                                                        embed
                                                                                .setAuthor(`${message.author.username} has lost!`, message.author.displayAvatarURL())
                                                                                .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                                
                                __Your total:__ ${playerSum}`)
                                                                                .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                                
                                __Bot's total:__ ${botSum}`)
                                                                                .setDescription(stripIndents`
                                Lost! ${bot.user.username} has won with a count of ${botSum}!

                                [**${addCommas(user.money)} Lambies** 💵]
                                
                                :hearts: :spades: :diamonds: :clubs:
                                `)
                                                                                .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                        finishBlackJackGame(msg, embed, hit, stand);
                                                                }
                                                        }
                                                })

                                                hit.on('collect', async r => {
                                                        playerHand.card3 = Math.floor(Math.random() * 11) + 1;
                                                        botHand.card3 = Math.floor(Math.random() * 11) + 1;

                                                        valueArrays.playValueArr.push(playerHand.card3);
                                                        valueArrays.botValueArr.push(botHand.card3);
                                                        newPlayArr.push(`**${playerHand.card3 == 1 || playerHand.card3 == 11 ? 'A' : playerHand.card3 == 10 ? tenValues[Math.floor(Math.random() * tenValues.length)] : playerHand.card3}** of **${titleCase(getRandomCardSuit())}**`)
                                                        newBotArr.push(`**${botHand.card3 == 1 || botHand.card3 == 11 ? 'A' : botHand.card3 == 10 ? tenValues[Math.floor(Math.random() * tenValues.length)] : botHand.card3}** of **${titleCase(getRandomCardSuit())}**`)

                                                        playerSum = valueArrays.playValueArr.reduce((a, b) => a + b)
                                                        botSum = valueArrays.botValueArr.reduce((a, b) => a + b)
                                                        if (playerSum < 21 && botSum < 21) {
                                                                embed.fields = [];
                                                                embed
                                                                        .setAuthor(`${message.author.username} started a game of BlackJack!`, message.author.displayAvatarURL())
                                                                        .setColor(fire_brick_red)
                                                                        .setDescription(stripIndents`
        React with 🤚 to **hit** -or- 🛑 to **stay**

        :hearts: :spades: :diamonds: :clubs:
            `)
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setFooter(`Please wait a couple seconds before reacting - your response time closes in 60 seconds`)

                                                                msg.edit(embed)
                                                        }

                                                        if (playerSum > 21 && botSum >= 21) {
                                                                embed.fields = [];
                                                                deductBet(user, playerBet)
                                                                embed
                                                                        .setAuthor(`${message.author.username} has bust!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(stripIndents`
                            Bust! Your count: ${playerSum}

                            [**${addCommas(user.money)} Lambies** 💵]
                            
                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (playerSum === 21 && botSum < 21) {
                                                                embed.fields = [];
                                                                addWinnings(user, playerBet)
                                                                embed
                                                                        .setColor("GREEN")
                                                                        .setAuthor(`${message.author.username} has won!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(stripIndents`
                            Won with a count of ${playerSum}!

                            [**${addCommas(user.money)} Lambies** 💵]
                            
                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (playerSum === 21 && botSum > 21) {
                                                                embed.fields = [];
                                                                addWinnings(user, playerBet)
                                                                embed
                                                                        .setColor("GREEN")
                                                                        .setAuthor(`${message.author.username} has won!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(stripIndents`
                            Won with a count of ${playerSum}!

                            [**${addCommas(user.money)} Lambies** 💵]
                            
                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (botSum === 21 && playerSum <= 21) {
                                                                embed.fields = [];
                                                                deductBet(user, playerBet)
                                                                embed
                                                                        .setAuthor(`${message.author.username} has lost!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(stripIndents`
                            Lost! ${bot.user.username} has won with a count of ${botSum}!

                            [**${addCommas(user.money)} Lambies** 💵]

                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (playerSum > 21 && botSum < 21) {
                                                                embed.fields = [];
                                                                deductBet(user, playerBet)
                                                                embed
                                                                        .setAuthor(`${message.author.username} has bust!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(stripIndents`
                            Bust with a count of ${playerSum}!

                            [**${addCommas(user.money)} Lambies** 💵]

                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);

                                                        } else if (botSum > 21 && playerSum < 21) {
                                                                embed.fields = [];
                                                                addWinnings(user, playerBet)
                                                                embed
                                                                        .setColor('GREEN')
                                                                        .setAuthor(`${message.author.username} has won!`, message.author.displayAvatarURL())
                                                                        .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                            
                            __Your total:__ ${playerSum}`)
                                                                        .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                            
                            __Bot's total:__ ${botSum}`)
                                                                        .setDescription(stripIndents`
                            ${bot.user.username} has bust with a count of ${botSum}!

                            [**${addCommas(user.money)} Lambies** 💵]

                            :hearts: :spades: :diamonds: :clubs:
                            `)
                                                                        .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                finishBlackJackGame(msg, embed, hit, stand);
                                                        } else if (playerSum < 21 && botSum < 21) {
                                                                if (playerSum > botSum) {
                                                                        embed.fields = [];
                                                                        addWinnings(user, playerBet)
                                                                        embed
                                                                                .setColor("GREEN")
                                                                                .setAuthor(`${message.author.username} has won!`, message.author.displayAvatarURL())
                                                                                .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                                
                                __Your total:__ ${playerSum}`)
                                                                                .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                                
                                __Bot's total:__ ${botSum}`)
                                                                                .setDescription(stripIndents`
                                Won with a count of ${playerSum}!

                                [**${addCommas(user.money)} Lambies** 💵]
                                
                                :hearts: :spades: :diamonds: :clubs:
                                `)
                                                                                .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                        finishBlackJackGame(msg, embed, hit, stand);
                                                                } else {
                                                                        embed.fields = [];
                                                                        deductBet(user, playerBet)
                                                                        embed
                                                                                .setAuthor(`${message.author.username} has lost!`, message.author.displayAvatarURL())
                                                                                .addField('Your Hand:', stripIndents`${newPlayArr.join(' | ')}
                                
                                __Your total:__ ${playerSum}`)
                                                                                .addField(`${bot.user.username}'s Hand:`, stripIndents`${newBotArr.join(' | ')}
                                
                                __Bot's total:__ ${botSum}`)
                                                                                .setDescription(stripIndents`
                                Lost! ${bot.user.username} has won with a count of ${botSum}!

                                [**${addCommas(user.money)} Lambies** 💵]

                                :hearts: :spades: :diamonds: :clubs:
                                `)
                                                                                .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                                                                        finishBlackJackGame(msg, embed, hit, stand);
                                                                }
                                                        }
                                                })
                                        })
                                })
                }
        }
};