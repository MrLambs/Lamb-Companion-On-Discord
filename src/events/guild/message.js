const { prefix } = require('../../util/jsons/config.json');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../util/models/user');
const { getNeededXP, getEmoji } = require('../../util/functions/chatFunctions');
const { stripIndents } = require('common-tags')

module.exports = async (bot, message) => {
    if (message.author.bot || message.channel.type === "dm") return;
    if (message.guild === null) return;

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if (message.content.startsWith(prefix)) {
        let commandFile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd))

        if (commandFile) {
            commandFile.run(bot, message, args)
        }
    } else {
        let lambiesToAdd = Math.ceil(Math.random() * 5);
        let xpToAdd = Math.ceil(Math.random() * 15);
        User
            .findOne({ user_id: message.author.id }, (err, user) => {
                if (err) console.log(`[ERR] ${err.message}`)
                else if (!user) {
                    const newUser = new User({
                        _id: mongoose.Types.ObjectId(),
                        user_id: message.author.id,
                        username: message.author.username,
                        money: lambiesToAdd,
                        xp: xpToAdd,
                        level: 1,
                        daily: null,
                        worked: {
                            dailyResetTimeout: null,
                            tenMinuteResetTimeout: null,
                            workedCounter: 0
                        },
                        items: {
                            ttsCounter: 0
                        }
                    })
                    newUser.save().catch(err => console.log(`[ERR] ${err.message}`))
                    console.log(`[LOGS] User added to database`)
                } else {
                    user.money += lambiesToAdd;
                    user.xp += xpToAdd
                    const xpNeeded = getNeededXP(user.level)
                    if (user.xp >= xpNeeded) {
                        user.level++,
                            user.xp -= xpNeeded;

                        message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(stripIndents`
                        🎊🎉 ${message.author}, you are now **level ${user.level}** with **${user.xp}**${getEmoji(bot, '711014609519247371')}!! 🎉🎊 
                        
                        [ **Next level: ${getNeededXP(user.level)}**${getEmoji(bot, '711014609519247371')} ] 
                        `))
                            .then(m => {
                                m.delete({ timeout: 15000 })
                            })
                    };
                    user.save().catch(err => console.log(`[ERR] ${err.message}`));
                }
            })
    }

}