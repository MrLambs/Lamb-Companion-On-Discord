const { MessageEmbed } = require('discord.js')
const { dark_purple } = require('../../util/jsons/colors.json')
const { stripIndents } = require('common-tags');
const { addCommas } = require('../../util/functions/chatFunctions')
const GunData = require('../../util/models/gunData')
const FleaData = require('../../util/models/fleaData')

module.exports = {
    config: {
        name: "guninfo",
        description: "Search the Tarkov database for information on guns",
        usage: "[gun name]",
        category: "escape_from_tarkov",
        accessibleby: "members"
    },
    run: async (bot, message, args) => {
        try {
            if (!args) return message.channel.send(
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription(':x: Please enter a search term.')
            )
            let search = args.join(' ')
            let searchParam = { $regex: `${search}`, $options: "i" }

            GunData.find({ name: searchParam })
                .then(found => {
                    if (found.length === 0) return message.channel.send(
                        new MessageEmbed()
                            .setColor("RED")
                            .setDescription(":x: No results found")
                    )
                    else {
                        found.length = 1;
                        FleaData.findOne({ name: found[0].name })
                            .then(fleaInfo => {
                                let resEmbed = new MessageEmbed()
                                    .setColor(dark_purple)
                                    .setTitle(`Top Result For: "${search}"`)
                                    .setThumbnail(found[0].image)
                                    .setDescription(stripIndents`
                        **[${found[0].name}](${fleaInfo.link})**

                        ${found[0].description}
                        `)
                                    .addField("**Sold By:**", found[0].soldBy, true)
                                    .addField("**24hr Price Avg:**", addCommas(Number(fleaInfo.avg24hPrice)) + " ₽", true)
                                    .addField("Wiki:", `[Click Here!](${fleaInfo.wikiLink})`, true)
                                    .addField("**Weight:**", found[0].weight, true)
                                    .addField("**Caliber:**", found[0].caliber, true)
                                    .addField("**Rate of Fire:**", found[0].rateOfFire + ' RPM', true)
                                return message.channel.send(resEmbed);

                            })
                    }
                })
        } catch (err) {
            console.log(`[ERR] ${err.message}`)
        }
    }
}