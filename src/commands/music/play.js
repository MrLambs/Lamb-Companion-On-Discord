const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { createMusicPlayer, msToTime } = require('../../util/functions/musicFunctions');

module.exports = {
    config: {
        name: "play",
        description: "Play a song/playlist or search for a song from youtube",
        usage: "<YouTube, Spotify, Deezer link to song/playlist or a search query>",
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

                    case "LOAD_FAILED":
                        throw res.exception;
                        break;

                    case "PLAYLIST_LOADED":
                        let enqueing = await message.channel.send(new MessageEmbed().setColor('GREEN').setDescription(':mag: Powering up playlist using genetically enhanced hamsters...'))
                        await res.tracks.forEach(track => {
                            player.queue.add(track);
                        });
                        enqueing.edit(new MessageEmbed().setColor('GREEN').setDescription(`:white_check_mark: Enqueued playlist [${ res.playlist.name }](${ args[0] }) \`${ msToTime(res.playlist.duration) }\` [${ res.tracks[0].requester }].`).setFooter(`Playlist length: ${ player.playing ? player.queue.length : player.queue.length + 1 }`))
                        if (!player.playing) player.play()
                        break;

                    case "TRACK_LOADED":
                        player.queue.add(res.tracks[0]);
                        if (res.tracks[0].resolve) await res.tracks[0].resolve()
                        let tlEmbed = new MessageEmbed()
                            .setColor("GREEN")
                            .setThumbnail(res.tracks[0].thumbnail)
                            .setDescription(stripIndents`
                            :white_check_mark: Queued [${ res.tracks[0].title }](${ res.tracks[0].uri }) \`${ msToTime(res.tracks[0].duration) }\` [${ res.tracks[0].requester }]
                            ${ player.queue.length ? ("---\nPosition in queue: " + player.queue.length) : "" }
                            `)
                        message.channel.send(tlEmbed);
                        if (!player.playing) player.play()
                        break;

                    case "SEARCH_RESULT":
                        let index = 1;
                        const tracks = res.tracks.slice(0, 5);
                        const embed = new MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(stripIndents`
                        :mag: ${ message.author }, please choose a song
                        ${ tracks.map(video => `\n**${ index++ } -** [${ video.title }](${ video.uri })`) }
                        `)
                            .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection");
                        message.channel.send(embed)

                        const messageCollector = message.channel.createMessageCollector(m => {
                            return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                        }, { time: 30000, max: 1 });

                        messageCollector.on("collect", m => {
                            if (/cancel/i.test(m.content)) return messageCollector.stop("cancelled")

                            const searchSelect = tracks[Number(m.content) - 1];
                            player.queue.add(searchSelect)
                            let srEmbed = new MessageEmbed()
                                .setColor("GREEN")
                                .setDescription(stripIndents`
                            :white_check_mark: Queued [${ searchSelect.title }](${ searchSelect.uri }) \`${ msToTime(searchSelect.duration) }\` [${ searchSelect.requester }]
                            ${ player.queue.length ? ("---\nPosition in queue: " + player.queue.length) : "" }
                            `)
                            if (!player.playing) player.play();
                            message.channel.send(srEmbed);
                        });

                        messageCollector.on("end", (_, reason) => {
                            if (["time", "cancelled"].includes(reason)) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(":x: Cancelled selection."))
                        });
                        break;
                }
            })
            if (!player.playing) player.connect();
        } catch (err) {
            console.log(`[ERR] ${ err.message }`)
            return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: ${ err.message } [${ message.author }]`))
        }
    }
}