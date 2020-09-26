const { Utils } = require("erela.js")
const { RichEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")

module.exports = {
    config: {
        name: "nowplaying",
        aliases: ["np", "now"],
        description: "Displays what the bot is currently playing.",
        accessableby: "Member",
        category: "music",
    },
    run: async (bot, message, args) => {
        const player = bot.music.players.get(message.guild.id);
        message.react(`${player.playing ? "▶️" : "⏸️"}`);
        message.react('475742289378017280')
        try {
        if (!player || !player.queue[0]) return message.channel.send("No song/s currently playing within this guild.");
        const { title, author, duration, thumbnail } = player.queue[0];

        const embed = new RichEmbed()
            .setAuthor("Current Song Playing.", message.author.displayAvatarURL)
            .setThumbnail(thumbnail)
            .setColor("GREEN")
            .setDescription(stripIndents`
            ${player.playing ? "▶️" : "⏸️"} **${title}** \`${Utils.formatTime(duration, true)}\` by ${author}
            `);

        return message.channel.send(embed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}