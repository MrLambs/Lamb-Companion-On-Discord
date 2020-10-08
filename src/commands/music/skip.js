const { MessageEmbed } = require('discord.js');
const { getGuildPlayer } = require('../../util/functions/musicFunctions');

module.exports = {
    config: {
        name: "skip",
        aliases: ["next"],
        description: "Skips the song currently playing.",
        accessibleby: "Member",
        category: "music",
        usage: "<input>"
    },
    run: (bot, message, args) => {
        message.react('⏩')
        try {
        const player = getGuildPlayer(bot, message)
        if (!player) return message.channel.send(new MessageEmbed().setColor("RED").setDescription("No songs currently playing in this guild."));

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send(new MessageEmbed().setColor("RED").setDescription("You need to be in a voice channel to use the skip command."));

        player.stop();
        let skipEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(':white_check_mark: Skipped the current song!')
        return message.channel.send(skipEmbed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}