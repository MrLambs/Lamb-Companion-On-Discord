const ms = require('ms');
const { orange } = require('../../util/jsons/colors.json');
const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        name: "timer",
        aliases: ['countdown'],
        usage: `(time)`,
        description: "Creates a countdown in chat!",
        accessableby: "Members",
        category: "misc"
    },
    async run(bot, message, args) {
        let timer = args[0];
        if (!args[0]) return message.channel.send('\n**Usage**\n!timer + duration + s|m|h')
        if (args[0] <= 0) return message.channel.send('\n**Usage**\n!timer + duration + s|m|h')

        try {
            let startTimeEmbed = new MessageEmbed()
                .setColor(orange)
                .setDescription('⏰ A new timer has been set for: ' + `\`${timer}\`` + ' ⏰')
            let msg = await message.channel.send(startTimeEmbed)

            let remaining = ms(timer)

            async function setEmbedEdit() {
                if (remaining <= 0) {
                    msg.delete()
                    clearInterval(myEdits)
                } else {
                    remaining -= 5000
                    let remainingEmbed = new MessageEmbed()
                        .setColor(orange)
                        .setDescription(`**⏰ Time remaining**: \`${ms(remaining)}\``)
                    await msg.edit(remainingEmbed)
                }
            }

            let myEdits = setInterval(setEmbedEdit, 5000);

            return setTimeout(() => {
                let timeEmbed = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`⏰ ${message.author.toString()}, your timer has **finished**! ⏰\n\n**Timer duration:** \`${timer}\``)
                message.channel.send(timeEmbed)
            }, ms(timer));
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};