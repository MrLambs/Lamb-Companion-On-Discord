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
        let dailyReset = 86400000,
            tenMinute = 600000,
            lambiesAmount = (Math.floor(Math.random() * 80) * 1) + 1,
            xpAmount = (Math.floor(Math.random() * 80) * 1) + 1;

        User.findOne({ user_id: message.author.id })
            .then(user => {
                if (user.worked == null) {
                    user.worked = {
                        tenMinute: null,
                        dailyResetTimeout: null,
                        workedCounter: 0
                    }
                }
                let worked = user.worked

                let localWorkedCounter,
                    dailyDate = Date.now();
                if (!worked.workedCounter) localWorkedCounter = 0
                else localWorkedCounter = worked.workedCounter

                if ((worked.tenMinuteResetTimeout !== null || worked.tenMinuteResetTimeout !== undefined)
                    && (worked.dailyResetTimeout !== null || worked.dailyResetTimeout !== undefined)
                    && dailyReset - (Date.now() - worked.dailyResetTimeout) > 0) {
                    user.worked = {
                        ...user.worked,
                        workedCounter: localWorkedCounter + 1
                    }
                } else {
                    user.worked = {
                        tenMinuteResetTimeout: null,
                        dailyResetTimeout: dailyDate,
                        workedCounter: 0
                    }
                }


                if (worked.tenMinuteResetTimeout !== null && tenMinute - (Date.now() - worked.tenMinuteResetTimeout) > 0) {
                    let time = ms(tenMinute - (Date.now() - worked.tenMinuteResetTimeout));
                    return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You cannot work again for: **${time.minutes}m** and **${time.seconds}s**`))
                } else {
                    let currentCounter;
                    if (Number(worked.workedCounter)) currentCounter = worked.workedCounter
                    else currentCounter = 0;

                    counterIncrease = currentCounter + 1.
                    percentageIncrease = (currentCounter * 2.5) / 100;

                    lambiesAmount += Math.ceil(lambiesAmount * percentageIncrease);
                    xpAmount += Math.ceil(xpAmount * percentageIncrease);
                    user.worked = {
                        ...user.worked,
                        tenMinuteResetTimeout: Date.now(),
                        workedCounter: counterIncrease
                    }
                    user.money += lambiesAmount;
                    user.xp += xpAmount
                    user.save()

                    let dailyTimeLeft = ms(dailyReset - (Date.now() - worked.dailyResetTimeout)),
                        workEmbed = new MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(`💪 you **__worked__** and earned \`\`${lambiesAmount}\`\` **Lambies** and \`\`${xpAmount}\`\` **XP**`)

                    if (!dailyTimeLeft || dailyTimeLeft.hours < 0 || dailyTimeLeft.minutes < 0 || dailyTimeLeft.seconds < 0) workEmbed.setFooter(`Cannot work again for 10 minutes`)
                    else workEmbed.setFooter(`Cannot work again for 10 minutes - Bonus will reset in ${dailyTimeLeft.hours}h ${dailyTimeLeft.minutes}m ${dailyTimeLeft.seconds}s`)

                    if (currentCounter > 0) workEmbed.setAuthor(`${message.author.username} just worked their a** off and earned a ${(percentageIncrease * 100).toFixed()}% bonus!`, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    else workEmbed.setAuthor(`${message.author.username} just worked their a** off!`, message.author.displayAvatarURL({ format: 'png', dynamic: true }))

                    return message.channel.send(workEmbed)
                }
            })
    }
};