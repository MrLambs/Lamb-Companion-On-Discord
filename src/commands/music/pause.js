const { RichEmbed } = require('discord.js')
const { Utils } = require("erela.js")
const { stripIndents } = require("common-tags");


module.exports = { 
    config: {
        name: "pause",
        aliases: ["resume"],
        description: "Makes the bot pause/resume the music currently playing.",
        accessableby: "Member",
        category: "music",
    },
    run: (bot, message, args) => {
        const player = bot.music.players.get(message.guild.id);
        const { title, author, duration, thumbnail } = player.queue[0];
        message.react(`${player.playing ? "⏸️" : "▶️"}`);
        message.react('475742289378017280')
        try {

        let nsEmbed = new RichEmbed()
        .setColor("RED")
        .setDescription(":x: No songs currently playing in this guild.")
        if (!player) return message.channel.send(nsEmbed);

        const { voiceChannel } = message.member;
        let vcEmbed = new RichEmbed()
        .setColor("RED")
        .setDescription(":x: You need to be in a voice channel to pause music.")
        if (!voiceChannel || voiceChannel.id !== player.voiceChannel.id) return message.channel.send(vcEmbed);
        

        player.pause(player.playing);
        let pEmbed = new RichEmbed()
        .setColor("GREEN")
        .setDescription(stripIndents`
        ${player.playing ? "▶️" : "⏸️"} **${title}** \`${Utils.formatTime(duration, true)}\` by ${author}
        `);        
        return message.channel.send(pEmbed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}