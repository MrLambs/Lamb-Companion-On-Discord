const { MessageEmbed } = require("discord.js");
const { getGuildPlayer } = require('../../util/functions/musicFunctions');

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

        if (player.queue.current) string += `__**Currently Playing**__\n ${player.queue.current.title} - **Requested by ${player.queue.current.requester.username}**. \n`;
        if (player.queue[0]) string += `__**Rest of queue:**__\n ${player.queue.slice(0, 10).map(x => `**${index++})** ${x.title} - **Requested by ${x.requester.username}**.`).join("\n")}`;

        const embed = new MessageEmbed()
            .setAuthor(`Current Queue for ${message.guild.name}`, message.guild.iconURL)
            .setThumbnail(player.queue.current.thumbnail)
            .setColor("GREEN")
            .setDescription(string);

        return message.channel.send(embed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)

        }
    }
}