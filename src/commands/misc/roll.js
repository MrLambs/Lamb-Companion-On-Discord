const { MessageEmbed } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');
const { stripIndents } = require('common-tags')
const { getExampleCommand } = require('../../util/functions/chatFunctions')

module.exports = {
    config: {
        name: "roll",
        aliases: ["r", "rolldice"],
        usage: `[number of dice to roll]d[number of sides on die (1-100)] [modifier]`,
        description: "Can roll many dice from d4-d100 with modifiers.",
        accessibleby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        try {
            const guardClause = new MessageEmbed()
                .setColor('RED')
                .setDescription(`:x: Please use proper format! Ex: !roll 1d6 ${getExampleCommand(bot, 'roll')}`)
            if (!args[0].includes('d')) return message.channel.send(
                guardClause
            )
            if (!args[0]) return message.channel.send(
                guardClause
            )
            let splitter = args[0].toLowerCase().split("d");
            let multy = splitter[0] || 1;
            if (!Number(multy) || multy > 100) return message.channel.send(
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`:x: Relax, chief! Cannot roll more than 100 dice. ${getExampleCommand(bot, 'roll')}`)
            )
            let modM = parseInt(args[1]) || 0;

            let diceRoll = 0;
            let diceArry = []
            for (let i = 0; i < multy; i++) {
                diceRoll = Math.floor(Math.random() * (parseInt(splitter[1]))) + 1;
                diceArry.push(diceRoll)
            }
            let total100 = 0;
            for (let i = 0; i < diceArry.length; i++) {
                total100 = parseInt(total100 + diceArry[i])
            }
            total100 += modM;
            const d100 = new MessageEmbed()
                .setColor(orange)
                .setDescription(stripIndents`
                :game_die: **A roll of the dice...** :game_die:

                ${diceArry.join(', ')}
                `)
                .addField('Total Roll:', `${total100 - modM}`, true)
                .addField('Modifier:', `${modM}`, true)
                .addField('Total:', `${total100}`)
            message.channel.send(d100);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }

    }
};