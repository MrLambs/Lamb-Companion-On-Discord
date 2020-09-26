const { RichEmbed } = require('discord.js')

module.exports = {
    config: {
        name: "skip",
        aliases: ["next"],
        description: "Skips the song currently playing.",
        accessableby: "Member",
        category: "music",
        usage: "<input>"
    },
    run: (bot, message, args) => {
        message.react('⏩')
        message.react('475742378028695562')
        try {
        const player = bot.music.players.get(message.guild.id);
        if (!player) return message.channel.send("No songs currently playing in this guild.");

        const { voiceChannel } = message.member;
        if (!voiceChannel || voiceChannel.id !== player.voiceChannel.id) return message.channel.send("You need to be in a voice channel to use the skip command.");

        player.stop();
        let skipEmbed = new RichEmbed()
        .setColor("GREEN")
        .setDescription(':white_check_mark: Skipped the current song!')
        return message.channel.send(skipEmbed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}