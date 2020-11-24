const { MessageEmbed, MessageAttachment } = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
    config: {
        name: "spank",
        description: "spank someone ( ͡° ͜ʖ ͡°)",
        usage: "(tag a member)",
        accessibleby: "Member",
        category: 'misc'
    },
    run: async (bot, message, args) => {
        try {
            let avatar1;
            let avatar2;
            if (!args[0]) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(':x: Please tag someone first!'))
            else {
                let memberTag = message.mentions.members.first();
                if (!memberTag) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(':x: Please tag someone first!'))
                else {
                    avatar1 = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
                    avatar2 = memberTag.user.displayAvatarURL({ dynamic: false, format: 'png' });
                }
            }

            let image = await canvacord.Canvas.spank(avatar1, avatar2)
            let spanked = new MessageAttachment(image, 'spanked.jpeg');

            return message.channel.send(spanked)
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}