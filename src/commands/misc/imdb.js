const { MessageEmbed } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');
const imdb = require('node-movie')

module.exports = {
    config: {
        name: "imdb",
        aliases: ["movie"],
        usage: `(movie or tv show)`,
        description: "Returns IMDB's information on your search term.",
        accessibleby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        let genEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(":mag: Generating...")
        let msg = await message.channel.send(genEmbed)

        try {
            let search = args.join(' ').toLocaleLowerCase()
            if (!search) return message.channel.send('Please enter a search term.');
            imdb(search, data => {
                if (data.Response == 'False') {
                    return msg.edit(`${data.Error}`)
                } else {
                    let rtsFormatted = [];
                    data.Ratings.forEach(r => {
                        rtsFormatted.push(`${r.Source}: \`${r.Value}\``)
                    });
                    let embed = new MessageEmbed()
                        .setColor(orange)
                        .setTitle(data.Title)
                        .setThumbnail(data.Poster)
                        .setDescription(data.Plot)
                        .addField('Directed By:', data.Director)
                        .addField(`Ratings:`, rtsFormatted.join('\n '))
                        .addField('Awards:', data.Awards)
                    if (data.Type == 'movie') {
                        embed
                            .addField('Runtime:', data.Runtime)
                            .setFooter(`${data.Production} | ${data.Released}`)
                        if (data.BoxOffice != undefined) {
                            embed.addField('Box Office:', data.BoxOffice)
                        } else {
                            embed.addField('Box Office:', 'N/A')
                        }
                    } else {
                        embed
                            .addField('Episode Runtime:', data.Runtime)
                            .addField('Total Seasons:', data.totalSeasons)
                            .addField('Released:', data.Released)
                            .setFooter(`${data.Writer} | ${data.Year}`)
                    }
                    msg.edit(embed)
                }
            })
        } catch (e) {
            msg.edit(new MessageEmbed().setColor("RED").setDescription(`:x: Something went wrong. Please try again.`))
            console.log(`[ERR] ${e.message}`)
        }
    }
};