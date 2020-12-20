const { MessageEmbed } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');
const Random = require('srod-v2');
const { stripIndents } = require('common-tags')

module.exports = {
    config: {
        name: "fact",
        description: "Generate a random fact",
        usage: "",
        category: "misc",
        accessibleby: "Members",
        aliases: [""],
    },

    run: async (bot, message, args) => {
        try {
            let fact = await Random.GetFact({ color: orange });
            let exclamationsArray = ['Did you know...?', 'The more you know!', 'You learn something new every day!', "Boy, I'm not even sure I knew that one..", "Ain't that something?"]
            message.channel.send(
                new MessageEmbed()
                    .setColor(orange)
                    .setAuthor(`${bot.user.username} Facts!`, message.guild.iconURL())
                    .setDescription(stripIndents`
                    **${exclamationsArray[Math.floor(Math.random() * exclamationsArray.length)]}**

                    ${fact.embed.description}
                    `)
                    .setFooter(bot.user.username, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))

            );
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}