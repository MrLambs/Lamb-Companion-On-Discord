const math = require('mathjs');
const { MessageEmbed } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');

module.exports = {
    config: {
        name: "math",
        description: "Tells you the result of math problem.",
        usage: "(math-problem)",
        category: "misc",
        accessableby: "Members",
        aliases: ["calc"],
    },

    run: async (client, message, args, tools) => {
        try {
            if (!args[0]) return message.channel.send('Please input a calculation.');

            let resp;
            try {
                resp = math.evaluate(args.join(' '));
            } catch (e) {
                return message.channel.send('Sorry, please input a valid calculation.');
            }
            const embed = new MessageEmbed()
                .setColor(orange)
                .setTitle('Math Calculation')
                .addField('Input', `\`\`\`js\n${args.join('')}\`\`\``)
                .addField('Output', `\`\`\`js\n${resp}\`\`\``)

            message.channel.send(embed)
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}