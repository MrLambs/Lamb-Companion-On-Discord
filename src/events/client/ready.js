const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../util/jsons/config.json');
const { msToTime } = require('../../util/functions/musicFunctions');
const { resetTripSpecificChannel } = require('../../util/functions/moderationFunctions');
const { tarkovScrape } = require('../../util/functions/tarkovFunctions')
const { stripIndents } = require('common-tags')
const createBar = require("string-progressbar");

module.exports = async (bot) => {
    console.log(`[LOGS] ${bot.user.username} is online!`)

    bot.manager
        .on('nodeConnect', () => console.log('[LOGS] Successfully created a new music node'))
        .on('nodeError', (node, err) => console.log(`[ERR] Node error: ${err.message}`))
        .on('trackStart', (player, track) => {
            player.setVolume(25)
            let npEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(track.thumbnail)
                .setDescription(stripIndents`
                ▶️ Now playing: 
                
                [${track.title}](${track.uri}) \`${new Date(track.duration) === 'Invalid Date' ? '' : msToTime(track.duration)}\`
                [${track.requester}]
                `)
                .setFooter(`Volume set to 25. To adjust volume please use: !volume 1-100`)
            if (!new Date(track.duration) === 'Invalid Date') {
                npEmbed
                    .addField("\u200b", "**" + createBar((player.queue.current.duration == 0 ? player.position : player.queue.current.duration), 0, 10, "▬", "🔵")[0] + "**\n**" + new Date(0).toISOString().substr(11, 8) + " / " + (player.queue.current.duration == 0 ? " ◉ LIVE" : new Date(player.queue.current.duration).toISOString().substr(11, 8)) + "**")
            }

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