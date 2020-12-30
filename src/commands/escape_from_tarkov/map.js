const { MessageEmbed } = require('discord.js');
const { dark_purple } = require('../../util/jsons/colors.json');
const MapData = require('../../util/models/mapData');
const { stripIndents } = require('common-tags')


module.exports = {
    config: {
        name: "map",
        aliases: [],
        usage: `[map name]`,
        description: "Returns info about the desired map, including a photo to use in-game",
        accessableby: "Members",
        category: "escape_from_tarkov"
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

            MapData.find({ name: searchParam })
                .then(maps => {
                    if (maps.length === 0) return message.channel.send(
                        new MessageEmbed()
                            .setColor("RED")
                            .setDescription(":x: No results found")
                    )
                    else if (maps.length > 1) maps.length = 1;
                    return message.channel.send(
                        new MessageEmbed()
                            .setColor(dark_purple)
                            .setTitle(`Search Results For: "${search}"`)
                            .setDescription(stripIndents`
                    **[${maps[0].name}](https://escapefromtarkov.gamepedia.com/${maps[0].name})**

                    ${maps[0].description}

                    **Features**
                    ${maps[0].features}

                    There are **${maps[0].keys.length} keys** that work for ${maps[0].name}
                    `)
                            .setImage(maps[0].image)
                    )
                })
        }
        catch (err) {
            console.log(`[ERR] ${err.message}`)
        }
    }
};