const { MessageEmbed } = require('discord.js');
const { titleCase } = require('../../util/functions/chatFunctions');
const beautify = require('beautify');

module.exports = {
    config: {
        name: "eval",
        description: "Evaluates code",
        usage: `[code or script]`,
        accessibleby: "Owner",
        aliases: ["e"],
        category: "moderation"
    },
    run: async (bot, message, args) => {
        try {
            if (!message.author.id === '328912599276060673') return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: Sorry, you do not have permission to use this command."))
            else if (!args[0]) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(':x: You need to enter **something** to evaluate.'))
            else if (args.join(' ').toLowerCase().includes('token')) return;
            else {
                const toEval = args.join(' '),
                    evaluated = eval(toEval);
                let hrTime = process.hrtime(),
                    hrDiff = process.hrtime(hrTime),
                    embed = new MessageEmbed()
                        .setTitle('Code Evaluation')
                        .setColor("GREEN")
                        .addField('To evaluate:', `\`\`\`js\n${beautify(args.join(" "), { format: "js" })}\n\`\`\``)
                        .addField("Evaluated:", evaluated)
                        .addField('Type:', titleCase(typeof (evaluated)))
                        .setFooter(`Evaluted in: ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.`)
                        .setTimestamp()

                return message.channel.send(embed)
            }
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
            return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`${e.message}`))
        }
    }
};