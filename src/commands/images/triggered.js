const { MessageEmbed, MessageAttachment } = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
    config: {
        name: "triggered",
        description: "Trigger yourself or someone else in your guild",
        usage: "(optional: tag a member)",
        accessibleby: "Member",
        category: 'images'
    },
    run: async (bot, message, args) => {
        try {
            let avatar;
            if (!args[0]) avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' })
            else {
                let memberTag = message.mentions.members.first();
                if (!memberTag) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(':x: Please tag someone.'))
                else avatar = memberTag.user.displayAvatarURL({ dynamic: false, format: 'png' })
            }

            let image = await canvacord.Canvas.trigger(avatar)
            let triggered = new MessageAttachment(image, 'triggered.gif');

            return message.channel.send(triggered)
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}