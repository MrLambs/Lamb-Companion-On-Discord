const { MessageEmbed } = require('discord.js');
const { getEmoji } = require('../../util/functions/chatFunctions');
const User = require('../../util/models/user');
const ms = require('parse-ms');

module.exports = {
    config: {
        name: "work",
        aliases: [''],
        usage: ``,
        description: "Work your a** off!",
        accessableby: "Members",
        category: "economy"
    },
    run: async (bot, message, args) => {
        let dailyReset = 86400000,
            tenMinute = 600000,
            lambiesAmount = (Math.floor(Math.random() * 80) * 1) + 1,
            xpAmount = (Math.floor(Math.random() * 80) * 1) + 1;

        User.findOne({ user_id: message.author.id })
            .then(user => {
                if (user.worked.tenMinuteResetTimeout == null || user.worked.tenMinuteResetTimeout == undefined) {
                    user.worked = {
                        tenMinute: null,
                        dailyResetTimeout: null,
                        workedCounter: 0
                    }
                }
                let worked = user.worked,
                    localWorkedCounter,
                    dailyDate = Date.now(),
                    dailyTimeLeft = ms(dailyReset - (Date.now() - worked.dailyResetTimeout))

                if (!worked.workedCounter) localWorkedCounter = 0
                else localWorkedCounter = worked.workedCounter

                if ((worked.dailyResetTimeout !== null || worked.dailyResetTimeout !== undefined)
                    && (worked.tenMinuteResetTimeout !== null || worked.tenMinuteTimeout !== undefined)
                    && dailyReset - (Date.now() - worked.dailyResetTimeout) > 0) {
                    user.worked = {
                        ...user.worked,
                        workedCounter: localWorkedCounter + 1
                    };
                } else {
                    localWorkedCounter = 0;
                    user.worked = {
                        tenMinuteResetTimeout: dailyDate,
                        dailyResetTimeout: dailyDate,
                        workedCounter: localWorkedCounter
                    };
                }

                let time = ms(tenMinute - (Date.now() - worked.tenMinuteResetTimeout));

                if ((user.worked.tenMinuteResetTimeout !== null || user.worked.tenMinuteResetTimeout !== undefined) && tenMinute - (Date.now() - user.worked.tenMinuteResetTimeout) > 0 && (time.hours >= 0, time.minutes >= 0, time.seconds >= 0)) {
                    return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You cannot work again for: **${time.minutes}m** and **${time.seconds}s**`));
                } else {
                    counterIncrease = localWorkedCounter + 1;
                    percentageIncrease = (localWorkedCounter * 2.5) / 100;

                    lambiesAmount += Math.ceil(lambiesAmount * percentageIncrease);
                    xpAmount += Math.ceil(xpAmount * percentageIncrease);
                    user.worked = {
                        ...user.worked,
                        tenMinuteResetTimeout: dailyDate
                    };
                    user.money += lambiesAmount;
                    user.xp += xpAmount;
                    user.save();

                    workEmbed = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`💪 you **__worked__** and earned **${lambiesAmount} Lambies** and **${xpAmount}**${getEmoji(bot, '711014609519247371')}`)

                    if (!dailyTimeLeft || dailyTimeLeft.hours < 0 || dailyTimeLeft.minutes < 0 || dailyTimeLeft.seconds < 0) workEmbed.setFooter(`Cannot work again for 10 minutes`)
                    else workEmbed.setFooter(`Cannot work again for 10 minutes - Bonus will reset in ${dailyTimeLeft.hours}h ${dailyTimeLeft.minutes}m ${dailyTimeLeft.seconds}s`)

                    if (localWorkedCounter > 0) workEmbed.setAuthor(`${message.author.username} just worked their a** off and earned a ${(percentageIncrease * 100).toFixed()}% bonus!`, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    else workEmbed.setAuthor(`${message.author.username} just worked their a** off!`, message.author.displayAvatarURL({ format: 'png', dynamic: true }))

                    return message.channel.send(workEmbed)
                }
            })
    }
};