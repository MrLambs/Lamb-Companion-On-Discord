const { MessageEmbed } = require("discord.js");
const { getGuildPlayer } = require('../../util/functions/musicFunctions');
const { getEmoji } = require('../../util/functions/chatFunctions')
const createBar = require("string-progressbar");
const play = require("./play");

module.exports = {
    config: {
        name: "queue",
        aliases: ["q"],
        description: "Displays what the current queue is.",
        accessibleby: "Member",
        category: "music",
    },
    run: async (bot, message, args) => {
        try {
            const player = getGuildPlayer(bot, message)

            if (!player || !player.queue.current) return message.channel.send("No song currently playing in this guild.");
            let loadingQueueEmbed = await message.channel.send(new MessageEmbed().setColor('GREEN').setDescription(':mag: Loading queue...'))
            let index = 1;
            let string = "";

            if (player.queue.current) string += `__**Currently Playing**__\n [${ player.queue.current.title }](${ player.queue.current.uri }) | [${ player.queue.current.requester }]. \n\n **${ createBar.splitBar((player.queue.current.duration == 0 ? player.position : player.queue.current.duration), player.position, 10, "▬", `${ getEmoji(bot, '475742289378017280') }`)[0] + "**\n**" + new Date(player.position).toISOString().substr(11, 8) + " / " + (player.queue.current.duration == 0 ? " ◉ LIVE" : new Date(player.queue.current.duration).toISOString().substr(11, 8)) }**`;
            if (player.queue[0]) {
                let stopLoopFlag = player.queue.length;
                if (stopLoopFlag > 10) stopLoopFlag = 10;
                for (i = 0; i < stopLoopFlag; i++) {
                    if (player.queue[i].resolve) {
                        await player.queue[i].resolve()
                    }
                }
                string += `\n\n__**Rest of queue:**__\n ${ player.queue.slice(0, 10).map(x => `**${ index++ })** [${ x.title }](${ x.uri })`).join("\n") }`;
            }

            const embed = new MessageEmbed()
                .setAuthor(`Queue for ${ message.guild.name }`, message.guild.iconURL())
                .setThumbnail(player.queue.current.thumbnail)
                .setColor("GREEN")
                .setDescription(string)
                .setFooter(`Queue length: ${ player.queue.length + 1 }`)

            return loadingQueueEmbed.edit(embed);
        } catch (e) {
            console.log(`[ERR] ${ e.message }`)
        }
    }
}