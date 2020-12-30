const { MessageEmbed } = require('discord.js');
const User = require('../../util/models/user');
const ms = require('parse-ms')

module.exports = {
    config: {
        name: "daily",
        aliases: [''],
        usage: ``,
        description: "Perform your daily activity to receive an award of Lambies.",
        accessableby: "Members",
        category: "economy"
    },
    run: async (bot, message, args) => {
        let timeout = 86400000;
        let amount = 250;

        User.findOne({ user_id: message.author.id })
            .then(user => {
                let daily = user.daily
                if (daily !== null && timeout - (Date.now() - daily) > 0) {
                    let time = ms(timeout - (Date.now() - daily));
                    return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You've already collected your daily reward. Come back in: **${time.hours}h**, **${time.minutes}m** and **${time.seconds}s**`))
                } else {
                    user.daily = Date.now();
                    user.money += amount;
                    user.save()

                    return message.channel.send(new MessageEmbed().setColor("GREEN").setAuthor(`Congrats ${message.author.username}`, message.author.displayAvatarURL({ format: 'png', dynamic: true })).setDescription(`:white_check_mark: You've completed your daily and earned: **${amount} Lambies**`))
                }
            })
    }
};