const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { createMusicPlayer, msToTime } = require('../../util/functions/musicFunctions');

module.exports = {
    config: {
        name: "play",
        description: "Play a song/playlist or search for a song from youtube",
        usage: "<input>",
        category: "music",
        accessibleby: "Member",
        aliases: ["p"]
    },
    run: async (bot, message, args) => {
        try {
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: You need to be in a voice channel to play music."));
            const permissions = voiceChannel.permissionsFor(bot.user);
            if (!permissions.has("CONNECT")) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: I cannot connect to your voice channel, make sure I have permission to!"));
            else if (!permissions.has("SPEAK")) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: I cannot connect to your voice channel, make sure I have permission to!"));
            else if (!args[0]) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: Please provide a song name or link to search."));

            const player = createMusicPlayer(bot, message)

            const res = await bot.manager.search(args.join(' '), message.author).then(async res => {
                switch (res.loadType) {

                    case "TRACK_LOADED":
                        player.queue.add(res.tracks[0]);
                        let tlEmbed = new MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(`Adding **${track.title}** \`${msToTime(track.duration)}\` to playlist.`)
                        message.channel.send(tlEmbed); if (!player.playing) player.play()
                        break;

                    case "SEARCH_RESULT":
                        let index = 1;
                        const tracks = res.tracks.slice(0, 5);
                        const embed = new MessageEmbed()
                            .setColor("GREEN")
                            .setAuthor(`${message.author.username}, please choose a song`, message.author.displayAvatarURL)
                            .setDescription(stripIndents`
                        :mag: ___Song Selection___
                        ${tracks.map(video => `\n**${index++} -** ${video.title}`)}
                        `)
                            .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection");

                        await message.channel.send(embed);

                        const collector = message.channel.createMessageCollector(m => {
                            return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                        }, { time: 30000, max: 1 });

                        collector.on("collect", m => {
                            if (/cancel/i.test(m.content)) return collector.stop("cancelled")

                            const track = tracks[Number(m.content) - 1];
                            player.queue.add(track)
                            let srEmbed = new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(`Adding **${track.title}** \`${msToTime(track.duration)}\`to playlist.`)
                            if (!player.playing) player.play();
                            message.channel.send(srEmbed);
                        });

                        collector.on("end", (_, reason) => {
                            if (["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled selection.")
                        });
                        break;
                }
            })
            player.connect();
        } catch (err) {
            console.log(`[ERR] ${err.message}`)
        }
    }
}