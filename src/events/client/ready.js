const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../util/jsons/config.json');
const { msToTime } = require('../../util/functions/musicFunctions');
const { resetTripSpecificChannel } = require('../../util/functions/moderationFunctions');
const { tarkovScrape } = require('../../util/functions/tarkovFunctions')

module.exports = async (bot) => {
    console.log(`[LOGS] ${bot.user.username} is online!`)

    bot.manager
        .on('nodeConnect', () => console.log('[LOGS] Successfully created a new music node'))
        .on('nodeError', (node, err) => console.log(`[ERR] Node error: ${err.message}`))
        .on('trackStart', (player, track) => {
            player.setVolume(25)
            let npEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`▶️ Now playing: **${track.title}** \`${msToTime(track.duration)}\``)
                .setFooter(`Volume set to 25. To adjust volume please use: !volume 1-100`)
                
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
    tarkovScrape()

    resetTripSpecificChannel(bot);
    
    let statuses = [
        `${prefix}help`,
        `over ${bot.guilds.cache.size} servers`
    ]

    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status, {
            type: "WATCHING"
        });
    }, 5000)
}