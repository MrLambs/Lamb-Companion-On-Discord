const { MessageEmbed } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');
// const MTG = require('mtg-wizard-core');
const { stripIndents } = require('common-tags');
const moment = require('moment')

module.exports = {
    config: {
        name: "mtg",
        aliases: ["magic"],
        usage: `(card query)`,
        description: "Look up information on a Magic The Gathering card.",
        accessibleby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        // if (!args[0]) return message.channel.send(
        //     new MessageEmbed()
        //     .setColor('RED')
        //     .setDescription(":x: Please include a search query for me to use!")
        // ) 
        // else {
        //     try {
        //         let searchMsgArray = ['Accessing Magic the Gathering Database...', 'Powering search using genetically enhanced hamsters...', `Deciding whether or not ${message.author} is worthy...`]
        //         let msg = await message.channel.send(
        //             new MessageEmbed()
        //             .setColor('GREEN')
        //                 .setDescription(`:mag: ${searchMsgArray[Math.floor(Math.random() * searchMsgArray.length)]}`)
        //         )
        //         MTG.searchCards(args.join(' ').toLowerCase())
        //             .then(cards => {
        //                 let card = cards[0].data
        //                 return msg.edit(
        //                     new MessageEmbed()
        //                         .setColor(orange)
        //                         .setTitle(card.name)
        //                         .setURL(card.scryfall_uri)
        //                         .setDescription(stripIndents`
        //                     ${card.type_line}
        //                     **Mana Cost:** ${card.mana_cost}

        //                     ${card.oracle_text}

        //                     *This card is contained in the set [${card.set_name}](${card.scryfall_set_uri}), which is valued at **$${card.prices.usd}** and was released ${moment(card.released_at).format('ll')}*
        //                     `)
        //                         .setImage(card.image_uris.large)
        //                         .setFooter(`Powered by: ${bot.user.username}`, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
        //                 )
        //             })
        //             .catch(err => {
        //                 msg.edit(
        //                     new MessageEmbed()
        //                         .setColor("RED")
        //                         .setDescription(":x: Could not find a card with that name. Please try again.")
        //                 )
        //             })
        //     } catch (e) {
        //         console.log(`[ERR] ${e.message}`)
        //     }
        // }
    }
};