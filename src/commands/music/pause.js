const { MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { msToTime, getGuildPlayer } = require('../../util/functions/musicFunctions');


module.exports = { 
    config: {
        name: "pause",
        aliases: ["resume"],
        description: "Makes the bot pause/resume the music currently playing.",
        accessableby: "Member",
        category: "music",
    },
    run: (bot, message, args) => {
        const player = getGuildPlayer(bot, message);
        const { title, author, duration, thumbnail } = player.queue.current;
        message.react(`${player.playing ? "⏸️" : "▶️"}`);
        // message.react('475742289378017280')
        try {
        let nsEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(":x: No songs currently playing in this guild.")
        if (!player) return message.channel.send(nsEmbed);

        const voiceChannel = message.member.voice.channel;
        let vcEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(":x: You need to be in a voice channel to pause music.")
        if (!voiceChannel) return message.channel.send(vcEmbed);
        

        player.pause(player.playing);
        let pEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(stripIndents`
        ${player.playing ? "▶️" : "⏸️"} **${title}** \`${msToTime(duration)}\` by ${author}
        `);        
        return message.channel.send(pEmbed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`);
        }
    }
}