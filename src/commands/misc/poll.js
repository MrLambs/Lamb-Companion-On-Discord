const { MessageEmbed } = require('discord.js');
const { capitalize } = require('../../util/functions/chatFunctions');
const { orange } = require('../../util/jsons/colors.json');
const { prefix } = require('../../util/jsons/config.json');

module.exports = {
    config: {
        name: "poll",
        description: "Can roll many dice from d4-d100 and factor in an added modifier for things.",
        usage: "(question)",
        accessibleby: "Member",
        category: 'misc'
    },
    run: async (bot, message, args) => {
        try {
            if (!args[0]) return message.channel.send(`Proper Usage: ${prefix}poll (question)`);
            console.log(args)
            const embed = new MessageEmbed()
                .setColor(0xffffff)
                .setFooter('React to vote.')
                .setDescription(capitalize(args.join(' ')))
                .setColor(orange)
                .setTitle(`Poll created by ${message.author.username}`);
            let msg = await message.channel.send({ embed });

            await msg.react('✅');
            await msg.react('❌');

            message.delete({ timeout: 1000 });
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}