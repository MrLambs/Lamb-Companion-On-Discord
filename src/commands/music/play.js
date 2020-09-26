const { Utils } = require("erela.js")
const { RichEmbed } = require("discord.js")
const { stripIndents } = require("common-tags");

module.exports = {
    config: {
        name: "play",
        description: "Play a song/playlist or search for a song from youtube",
        usage: "<input>",
        category: "music",
        accessableby: "Member",
        aliases: ["p", "pplay"]
    },
    run: async (bot, message, args) => {
        // message.react('▶️')
        // message.react('475742425625657348')
        // const { voiceChannel } = message.member;
        // if (!voiceChannel) return message.channel.send("You need to be in a voice channel to play music.");

        // const permissions = voiceChannel.permissionsFor(bot.user);
        // if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect to your voice channel, make sure I have permission to!");
        // if (!permissions.has("SPEAK")) return message.channel.send("I cannot connect to your voice channel, make sure I have permission to!");

        // if (!args[0]) return message.channel.send("Please provide a song name or link to search.");

        // const player = bot.music.players.spawn({
        //     guild: message.guild,
        //     textChannel: message.channel,
        //     voiceChannel
        // });

        // bot.music.search(args.join(" "), message.author).then(async res => {
        //     switch (res.loadType) {
        //         case "TRACK_LOADED":
        //             player.queue.add(res.tracks[0]);
        //             let tlEmbed = new RichEmbed()
        //                 .setColor("GREEN")
        //                 .setDescription(`Adding \`${track.title}\` \`${Utils.formatTime(track.duration, true)}\` to playlist.`)
        //             message.channel.send(tlEmbed); if (!player.playing) player.play()
        //             break;

        //         case "SEARCH_RESULT":
        //             let index = 1;
        //             const tracks = res.tracks.slice(0, 5);
        //             const embed = new RichEmbed()
        //                 .setColor("GREEN")
        //                 .setAuthor(`${message.author.username}, Please choose a song`, message.author.displayAvatarURL)
        //                 .setDescription(stripIndents`
        //                 :mag: ___Song Selection___
        //                 ${tracks.map(video => `\n**${index++} -** ${video.title}`)}
        //                 `)
        //                 .setFooter("Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection");

        //             await message.channel.send(embed);

        //             const collector = message.channel.createMessageCollector(m => {
        //                 return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
        //             }, { time: 30000, max: 1 });

        //             collector.on("collect", m => {
        //                 if (/cancel/i.test(m.content)) return collector.stop("cancelled")

        //                 const track = tracks[Number(m.content) - 1];
        //                 player.queue.add(track)
        //                 let srEmbed = new RichEmbed()
        //                     .setColor("GREEN")
        //                     .setDescription(`Adding \`${track.title}\` \`${Utils.formatTime(track.duration, true)}\` to playlist.`)
        //                 message.channel.send(srEmbed);
        //                 if (!player.playing) player.play();
        //             });

        //             collector.on("end", (_, reason) => {
        //                 if (["time", "cancelled"].includes(reason)) return message.channel.send("Cancelled selection.")
        //             });
        //             break;

        //         case "PLAYLIST_LOADED":
        //             res.playlist.tracks.forEach(track => player.queue.add(track));
        //             const duration = Utils.formatTime(res.playlist.tracks.reduce((acc, cur) => ({ duration: acc.duration + cur.duration })).duration, true);
        //             let plEmbed = new RichEmbed()
        //                 .setColor("GREEN")
        //                 .setDescription(`Adding \`${res.playlist.tracks.length}\` \`${duration}\` to queue. Tracks in playlist \`${res.playlist.info.name}\``)
        //             message.channel.send(plEmbed);
        //             if (!player.playing) player.play()
        //             break;
        // }
        // }).catch(err => message.channel.send(err.message))
        // Note: This example only works for retrieving tracks using a query, such as "Rick Astley - Never Gonna Give You Up".

        // Retrieves tracks with your query and the requester of the tracks.
        // Note: This retrieves tracks from youtube by default, to get from other sources you must enable them in application.yml and provide a link for the source.
        // Note: If you want to "search" for tracks you must provide an object with a "query" property being the query to use, and "source" being one of "youtube", "soundcloud".
        const res = await bot.manager.search(
            message.content.slice(6),
            message.author
        );

        // Create a new player. This will return the player if it already exists.
        const player = bot.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
        });

        // Connect to the voice channel.
        player.connect();

        // Adds the first track to the queue.
        player.queue.add(res.tracks[0]);
        message.channel.send(`Enqueuing track ${res.tracks[0].title}.`);

        // Plays the player (plays the first track in the queue).
        // The if statement is needed else it will play the current track again
        if (!player.playing && !player.paused && !player.queue.length)
            player.play();

        // For playlists you'll have to use slightly different if statement
        if (
            !player.playing &&
            !player.paused &&
            player.queue.size === res.tracks.length
        )
            player.play();
    }
}