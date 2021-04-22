const { MessageEmbed } = require("discord.js");
const { getGuildPlayer } = require('../../util/functions/musicFunctions');
const createBar = require("string-progressbar");

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

            let index = 1;
            let string = "";

            if (player.queue.current) string += `__**Currently Playing**__\n [${player.queue.current.title}](${player.queue.current.uri}) | [${player.queue.current.requester}]. \n\n **${createBar((player.queue.current.duration == 0 ? player.position : player.queue.current.duration), player.position, 10, "▬", "🔵")[0] + "**\n**" + new Date(player.position).toISOString().substr(11, 8) + " / " + (player.queue.current.duration == 0 ? " ◉ LIVE" : new Date(player.queue.current.duration).toISOString().substr(11, 8))}**`;
            if (player.queue[0]) string += `\n\n__**Rest of queue:**__\n ${player.queue.slice(0, 10).map(x => `**${index++})** [${x.title}](${x.uri})`).join("\n")}`;

            const embed = new MessageEmbed()
                .setAuthor(`Queue for ${message.guild.name}`, message.guild.iconURL())
                .setThumbnail(player.queue.current.thumbnail)
                .setColor("GREEN")
                .setDescription(string)
                .setFooter(`Queue length: ${player.queue.length + 1}`)

            return message.channel.send(embed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}