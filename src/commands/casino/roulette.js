const { MessageEmbed, Message } = require('discord.js');
const { stripIndents } = require('common-tags');
const { fire_brick_red } = require('../../util/jsons/colors.json');
const { getExampleCommand, titleCase } = require('../../util/functions/chatFunctions');
const User = require('../../util/models/user');
const { verifyBetAmount, deductBet, addWinnings, returnBet, getRouletteResult } = require('../../util/functions/casinoFunctions');

module.exports = {
    config: {
        name: "roulette",
        aliases: [],
        usage: `[bet] [red/black] `,
        description: "Play roulette!",
        accessableby: "Members",
        category: "casino"
    },
    run: async (bot, message, args) => {
        let playerBet = args[0];
        let playerChoice = args[1];
        if (!playerBet || !Number(playerBet) || Number(playerBet < 1)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`You must make a bet first! Your bet cannot be less than 1. ${getExampleCommand(bot, 'roulette')}`));
        else if (!playerChoice || !playerChoice == 'red' || !playerChoice == 'black') return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`You must choose [red/black] first! ${getExampleCommand('roulette')}`));
        else if (!verifyBetAmount(Number(playerBet), message)) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`Sorry, your bet was declined. You do not have that much in your account.`));
        else {
            playerBet = Number(playerBet);
            playerChoice = playerChoice.toLowerCase();
            try {
                await deductBet(playerBet, message);
                let rouletteGame = getRouletteResult(playerChoice);
                await message.channel.send(`${rouletteGame.newMessage}`);
                User.findOne({ user_id: message.author.id })
                .then(user => {
                    switch (rouletteGame.result) {
                        case 'won':
                            addWinnings(playerBet, message);
                            return message.channel.send(new MessageEmbed()
                            .setColor(fire_brick_red)
                            .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                            .setDescription(stripIndents`
                            **Congrats, you won!**
                            ---
                            [\`${user.money}\` **Lambies** 💵]
                            `)
                            .addField('Result:', titleCase(rouletteGame.lastColor)))
                            break;
                        case 'lost':
                            return message.channel.send(new MessageEmbed()
                            .setColor(fire_brick_red)
                            .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                            .setDescription(stripIndents`
                            **Sorry, you lost!**
                            ---
                            [\`${user.money}\` **Lambies** 💵]
                            `)
                            .addField('Result:', titleCase(rouletteGame.lastColor)))
                            break;
                    }
                })
            } catch (err) {
                console.log(`[ERR] ${err.message}`);
                returnBet(playerBet, message);
                return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`Oops, something went wrong. Your bet was returned. Please try again.`))
            }
        }
    }
};