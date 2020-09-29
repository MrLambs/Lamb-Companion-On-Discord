const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "leave",
        aliases: ["lev", "stop"],
        description: "Makes the bot leave the voice channel.",
        accessibleby: "Member",
        category: "music",
    },
    run: async (bot, message, args) => {
        message.react('👋')
        message.react('🛑')
        try {
            const voiceChannel = message.member.voice.channel;
            const player = bot.manager.players.get(message.guild.id);

            if (!player) return message.channel.send("No song(s) currently playing in this guild.");
            if (!voiceChannel || voiceChannel.id !== player.voiceChannel) return message.channel.send("You need to be in a voice channel to use the leave command.");
            player.destroy();
            
            let lEmbed = new MessageEmbed()
                .setDescription('Successfully stopped the music.')
                .setColor("RED")
            return message.channel.send(lEmbed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}