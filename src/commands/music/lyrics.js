const { getGuildPlayer } = require('../../util/functions/musicFunctions');
const lyricsFinder = require('lyrics-finder')
const { PaginatedEmbed } = require('embed-paginator')

module.exports = {
    config: {
        name: "lyrics",
        aliases: [],
        description: "Displays lyrics for the currently playing song if available",
        accessibleby: "Member",
        category: "music",
    },
    run: async (bot, message, args) => {
        const player = getGuildPlayer(bot, message);
        if (!player || !player.queue.current) return message.channel.send("No song(s) currently playing within this guild.");

        const { title, author, uri, thumbnail } = player.queue.current
        try {
            const lyrics = (await lyricsFinder(author, title)) || "No lyrics found"
            const lyricsArr = lyrics.split('\n')
            console.log(await lyricsFinder(author, title))
            const embed = new PaginatedEmbed({
                colours: ['GREEN'],
                descriptions: lyricsArr,
                duration: 60 * 1000 * 4,
                itemsPerPage: 20,
                paginationType: 'description'
            })
                .setTitle(title) //
                .setURL(uri)
                .setThumbnail(thumbnail)

            embed.send(message.channel)
        } catch (e) {
            console.log(`[ERR] ${ e.message }`)
        }
    }
}