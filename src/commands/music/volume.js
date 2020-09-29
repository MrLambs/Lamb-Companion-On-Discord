const { MessageEmbed } = require('discord.js');
const { getGuildPlayer } = require('../../util/functions/musicFunctions');

module.exports = {
    config: {
        name: "volume",
        aliases: ["vol", "v"],
        description: "Adjusts the volume of the bot.",
        accessibleby: "Member",
        category: "music",
        usage: "<input>"
    },
    run: async (bot, message, args) => {
        try {
            const player = getGuildPlayer(bot, message)
            if (!player) return message.channel.send(new MessageEmbed().setColor("RED").setDescription("No songs currently playing within this guild."));

            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.channel.send(new MessageEmbed().setColor("RED").setDescription("You need to be in a voice channel to adjust the volume."))
            else if (!args[0]) return message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(`Current Volume: ${player.volume}`))
            else if (!Number(args[0])) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`You must select a **__real__** number between 1-100.`))
            else if (Number(args[0]) <= 0 || Number(args[0]) > 100) return message.channel.send(new MessageEmbed().setColor("RED").setDescription("You may only set the volume to 1-100"))
            else {
                player.setVolume(Number(args[0]));
                return message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(`Set the volume to: ${args[0]}`))
            }
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}