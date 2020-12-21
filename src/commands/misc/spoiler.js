const { MessageEmbed } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');

module.exports = {
    config: {
        name: "spoiler",
        aliases: [""],
        usage: `[query to hide from being spoiled]`,
        description: "Keep a spoiler secret!",
        accessibleby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        try {
            if (!args) return message.channel.send(
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription(':x: You must type out a spoiler for me to hide!')
            )
            let spoiler = args.join(' ');
            await message.delete()
            return message.channel.send(
                new MessageEmbed()
                    .setColor(orange)
                    .setAuthor(`${message.author.username} has deemed this message as a SPOILER!!`, message.author.displayAvatarURL())
                    .setDescription(`||${spoiler}||`)
                    .setFooter(bot.user.username, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setTimestamp()
            );

        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}; 