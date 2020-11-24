const { MessageEmbed } = require('discord.js');
const User = require('../../util/models/user');
const ms = require('parse-ms')

module.exports = {
    config: {
        name: "work",
        aliases: [''],
        usage: ``,
        description: "Work your a** off!",
        accessableby: "Members",
        category: "casino"
    },
    run: async (bot, message, args) => {
        let timeout = 600000;
        let amount = (Math.floor(Math.random() * 80) * 1) + 1

        User.findOne({ user_id: message.author.id })
            .then(user => {
                let worked = user.worked
                if (worked !== null && timeout - (Date.now() - worked) > 0) {
                    let time = ms(timeout - (Date.now() - worked));
                    return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You cannot work again for: **${time.minutes}m** and **${time.seconds}s**`))
                } else {
                    user.worked = Date.now();
                    user.money += amount;
                    user.save()

                    return message.channel.send(new MessageEmbed().setColor("GREEN").setAuthor(`${message.author.username} just worked their a** off!`, message.author.displayAvatarURL({ format: 'png', dynamic: true })).setDescription(`💪 you **__worked__** and earned \`\`${amount}\`\` **Lambies**`).setFooter('Cannot work again for 10 minutes'))
                }
            })
    }
};