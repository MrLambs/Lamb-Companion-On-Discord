const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { msToTime, getGuildPlayer } = require('../../util/functions/musicFunctions');
const { getEmoji } = require('../../util/functions/chatFunctions')
const createBar = require("string-progressbar");

module.exports = {
    config: {
        name: "nowplaying",
        aliases: ["np", "now"],
        description: "Displays what the bot is currently playing.",
        accessibleby: "Member",
        category: "music",
    },
    run: async (bot, message, args) => {
        const player = getGuildPlayer(bot, message);
        try {
            if (!player || !player.queue.current) return message.channel.send("No song(s) currently playing within this guild.");
            const { title, author, duration, thumbnail, uri, requester } = player.queue.current;

            const embed = new MessageEmbed()
                .setAuthor("Now Playing", message.author.displayAvatarURL)
                .setThumbnail(thumbnail)
                .setColor("GREEN")
                .setDescription(stripIndents`
            ${ player.playing ? "▶️" : "⏸️" } [${ title }](${ uri }) \`${ msToTime(duration) }\` by ${ author }
            [${ requester }]
            `)
                .addField("\u200b", "**" + createBar.splitBar((player.queue.current.duration == 0 ? player.position : player.queue.current.duration), player.position, 10, "▬", `${ getEmoji(bot, '475742289378017280') }`)[0] + "**\n**" + new Date(player.position).toISOString().substr(11, 8) + " / " + (player.queue.current.duration == 0 ? " ◉ LIVE" : new Date(player.queue.current.duration).toISOString().substr(11, 8)) + "**")
                ;

            return message.channel.send(embed);
        } catch (e) {
            console.log(`[ERR] ${ e.message }`)
        }
    }
}