const { MessageEmbed } = require('discord.js')
const { dark_purple } = require('../../util/jsons/colors.json')
const { stripIndents } = require('common-tags');
const { addCommas } = require('../../util/functions/chatFunctions')
const moment = require('moment')
const FleaData = require('../../util/models/fleaData')

module.exports = {
    config: {
        name: "flea",
        description: "Search the Tarkov market",
        usage: "[item name]",
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

            let search = args.join(' ');
            let searchParam = { $regex: `${search}`, $options: "i" }
            FleaData.find({ name: searchParam })
                .then(found => {
                    if (found.length === 0) return message.channel.send(
                        new MessageEmbed()
                            .setColor("RED")
                            .setDescription(":x: No results found")
                    )
                    else {
                        if (found.length > 5) found.length = 5;
                        let resEmbed = new MessageEmbed()
                            .setColor(dark_purple)
                            .setTitle(`Top Results For: "${search}"`)
                            .setThumbnail(found[0].image)

                        if (found.length === 1) {
                            resEmbed
                                .setDescription(stripIndents`
                        **[${found[0].name}](${found[0].link})**
                        24hr Price Avg: **${addCommas(Number(found[0].avg24hPrice)) + " ₽"}**
                        Slots: **${found[0].slots}**
                        Price Per Slot: **${addCommas(Number(found[0].pricePerSlot)) + " ₽"}**
                        -----
                        Trader: ${found[0].traderName}
                        Highest Buy Back From Trader: ${addCommas(Number(found[0].traderPrice))} ${found[0].traderPriceCur}
                        -----
                        Last updated ${moment(`${found[0].updated}`, 'YYYYMMDD').subtract(4.6, 'hours').fromNow()}
                        
                        [View source](${found[0].link})
                        `)
                        } else {
                            found.forEach(i => {
                                resEmbed
                                    .addField(`\u200b`, stripIndents`
                        **[${i.name}](${i.link})**
                        24hr Price Avg: **${addCommas(Number(i.avg24hPrice)) + " ₽"}**
                        Slots: **${i.slots}**
                        Price Per Slot: **${addCommas(Number(i.pricePerSlot)) + " ₽"}**
                        Last updated ${moment(`${found[0].updated}`, 'YYYYMMDD').subtract(4.6, 'hours').fromNow()}
                        `)
                            })
                        }

                        return message.channel.send(resEmbed)
                    }
                })
        } catch (err) {
            console.log(`[ERR] ${err.message}`)
        }
    }
}