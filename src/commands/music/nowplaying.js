const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { msToTime, getGuildPlayer } = require('../../util/functions/musicFunctions');

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
        message.react(`${player.playing ? "▶️" : "⏸️"}`);
        try {
        if (!player || !player.queue.current) return message.channel.send("No song(s) currently playing within this guild.");
        const { title, author, duration, thumbnail } = player.queue.current;

        const embed = new MessageEmbed()
            .setAuthor("Current Song", message.author.displayAvatarURL)
            .setThumbnail(thumbnail)
            .setColor("GREEN")
            .setDescription(stripIndents`
            ${player.playing ? "▶️" : "⏸️"} **${title}** \`${msToTime(duration)}\` by ${author}
            `);
        return message.channel.send(embed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}