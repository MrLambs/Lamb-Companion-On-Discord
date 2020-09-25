const { MessageEmbed } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');
const { stripIndents } = require('common-tags')
const { getFortuneCookie } = require('../../util/functions/miscFunctions');

module.exports = {
    config: {
        name: "fortune",
        aliases: ['f'],
        usage: ``,
        description: "Spawns your fortune!",
        accessableby: "Members",
        category: "misc"
    },
    async run(bot, message, args) {
        try {
            getFortuneCookie(message)
                .then(data => {
                    data = data[0];
                    let embed = new MessageEmbed()
                        .setColor(orange)
                        .setAuthor(`${message.author.username} just opened a fortune cookie!`, message.author.displayAvatarURL)
                        .addField('Fortune:', `**${data.fortune.message}**`)
                        .addField('Lesson:', stripIndents`
*__Chinese:__* ${data.lesson.chinese}

*__English:__* ${data.lesson.english}

*__Pronunciation:__* ${data.lesson.pronunciation}
`)
                        .addField('Lucky Numbers:', `${data.lotto.numbers.join(", ")}`);
                return message.channel.send(embed)
                
                    })
        } catch (e) {
            message.channel.send('Could not obtain fortune cookie :confused: ');
            return console.error(e);
        }
    }
};