const PlayStore = require("google-play-scraper");
const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "playstore",
        description: "Show Google Play Store Application information for your query",
        usage: "[application name]",
        category: "misc",
        accessibleby: "Members",
        aliases: ["pstore", 'ps', 'googleplaystore', 'googlestore'],
    },

    run: async (bot, message, args) => {
        try {
            if (!args[0])
                return message.channel.send(
                    new MessageEmbed
                        .setColor('RED')
                        .setDescription(`:x: Please Give Something To Search - ${message.author.username}`)
                );

            PlayStore.search({
                term: args.join(" "),
                num: 1
            }).then(Data => {
                let App;

                try {
                    App = JSON.parse(JSON.stringify(Data[0]));
                } catch (error) {
                    return message.channel.send(
                        new MessageEmbed
                            .setColor('RED')
                            .setDescription(
                                `:x: No Application Found - ${message.author.username}!`
                            ));
                }

                let Embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setThumbnail(App.icon)
                    .setURL(App.url)
                    .setTitle(`${App.title}`)
                    .setDescription(App.summary)
                    .addField(`Price`, App.priceText, true)
                    .addField(`Developer`, App.developer, true)
                    .addField(`Score`, App.scoreText, true)
                    .setFooter(`Google Play Store - Requested By ${message.author.username}`)
                    .setTimestamp();

                return message.channel.send(Embed);
            });


        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}