const { MessageEmbed } = require('discord.js');
const { prefix, nodes } = require('../../util/jsons/config.json');
const { Manager, Utils } = require('erela.js');

module.exports = async (bot) => {
    console.log(`${bot.user.username} is online!`)

    bot.manager
        .on('nodeConnect', () => console.log('Successfully created a new music node'))
        .on('nodeError', (node, err) => console.log(`[ERR] Node error: ${err.message}`))
        .on('trackStart', (player, track) => {
            let npEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`▶️ Now playing: **${track.title}** `)
                // \`${Utils.formatTime(track.duration, true)}\`
            bot.channels.cache
                .get(player.textChannel)
                .send(npEmbed)
                .then(m => m.delete({ timeout: 15000 }))
        })
        .on('queueEnd', (player) => {
            let qEndEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(":x: Queue has ended.")

            bot.channels.cache.get(player.textChannel).send(qEndEmbed);
            player.destroy()
        })

        bot.manager.init(bot.user.id);
        bot.levels = new Map()
        .set("none", 0, 0)
        .set("low", 0.10)
        .set("medium", 0.15)
        .set("high", 0.25);

    let statuses = [
        `${prefix}help`
    ]

    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status, {
            type: "WATCHING"
        });
    }, 5000)
}