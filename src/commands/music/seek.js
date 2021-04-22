const { MessageEmbed } = require("discord.js");
const { getGuildPlayer } = require('../../util/functions/musicFunctions');

module.exports = {
    config: {
        name: "seek",
        aliases: ["forward", "ff"],
        description: "Seek to a song ahead in the queue.",
        accessibleby: "Member",
        category: "music",
    },
    run: async (bot, message, args) => {
        const player = getGuildPlayer(bot, message);
        try {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: You need to be in the voice channel to shuffle the queue."));
            else if (!args[0] || !Number(args[0]) || Number(args[0]) < 1 || Number(args[0]) > player.queue.length) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: Please provide a number in the queue you'd like me to seek to."));
            else if (!player || player.queue.length === 0) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(':x: Cannot shuffle a queue that does not exist.'))
            else {
                let number = Number(args[0] - 1)
                if (number < 1) player.stop()
                else {
                    await player.queue.remove(0, number)
                    player.stop()
                }
                return message.channel.send(
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`:white_check_mark: Skipped ahead to **position __#${number + 1}__** in the queue!`)
                )
            }
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}