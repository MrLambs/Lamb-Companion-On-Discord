const { MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { msToTime, getGuildPlayer } = require('../../util/functions/musicFunctions');
const createBar = require("string-progressbar");

module.exports = {
    config: {
        name: "pause",
        aliases: ["resume"],
        description: "Makes the bot pause/resume the music currently playing.",
        accessibleby: "Member",
        category: "music",
    },
    run: (bot, message, args) => {
        const player = getGuildPlayer(bot, message);
        const { title, author, duration, thumbnail, uri, requester } = player.queue.current;
        message.react(`${player.playing ? "⏸️" : "▶️"}`);
        try {
            let nsEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(":x: No songs currently playing in this guild.")
            if (!player) return message.channel.send(nsEmbed);

            const voiceChannel = message.member.voice.channel;
            let vcEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(":x: You need to be in a voice channel to pause music.")
            if (!voiceChannel) return message.channel.send(vcEmbed);


            player.pause(player.playing);
            let pEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(thumbnail)
                .setDescription(stripIndents`
        ${player.playing ? "▶️" : "⏸️"} [${title}](${uri}) \`${msToTime(duration)}\` by ${author}
        [${requester}]
        `)
                .addField("\u200b", "**" + createBar((player.queue.current.duration == 0 ? player.position : player.queue.current.duration), player.position, 10, "▬", "🔵")[0] + "**\n**" + new Date(player.position).toISOString().substr(11, 8) + " / " + (player.queue.current.duration == 0 ? " ◉ LIVE" : new Date(player.queue.current.duration).toISOString().substr(11, 8)) + "**")
            return message.channel.send(pEmbed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`);
        }
    }
}