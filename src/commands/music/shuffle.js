const { MessageEmbed } = require("discord.js");
const { getGuildPlayer } = require('../../util/functions/musicFunctions');

module.exports = {
    config: {
        name: "shuffle",
        aliases: ["sh"],
        description: "Shuffle the current queue",
        accessibleby: "Member",
        category: "music",
    },
    run: async (bot, message, args) => {
        const player = getGuildPlayer(bot, message);
        try {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: You need to be in the voice channel to shuffle the queue."));
            else if (!player || player.queue.length === 0) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(':x: Cannot shuffle a queue that does not exist.'))
            else {
                player.queue.shuffle()
                return message.channel.send(
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(":white_check_mark: Queue has been shuffled!")
                )
            }
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}