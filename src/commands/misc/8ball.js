const { MessageEmbed } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');
const { capitalize } = require('../../util/functions/chatFunctions');
const { get8ballResponse } = require('../../util/functions/miscFunctions.js');

module.exports = {
    config: {
        name: "8ball",
        aliases: ["magic8", "magic8ball"],
        usage: `(question)`,
        description: "Ask the magic 8ball what your fortune is",
        accessableby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        try {
            if (!args[0]) return message.channel.send("Please ask a full question!");
            let question = args.join(' ');
            let ballEmbed = new MessageEmbed()
                .setAuthor(`${message.author.username} shook the magic 8ball!`)
                .setColor(orange)
                .addField("Question", capitalize(question))
                .addField("Answer:", get8ballResponse())
                .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL)
                .setTimestamp()

            return message.channel.send(ballEmbed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};