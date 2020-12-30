const { MessageEmbed } = require('discord.js')
const { medium_purple } = require('../../util/jsons/colors.json');
const { getGiphy } = require('../../util/functions/imageFunctions');
const { getExampleCommand } = require('../../util/functions/chatFunctions');

module.exports = {
    config: {
        name: "gif",
        description: "Searches for a giphy!",
        usage: "[search term]",
        category: "images",
        accessibleby: "members"
    },
    run: async (bot, message, args) => {
        try {
            let search = args.join(' ').toLowerCase();
            if (!search) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`Please enter a search term. ${getExampleCommand(bot, 'gif')}`))
            else {
                let msg = await message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(":mag: Generating gif..."));
                getGiphy(search).then(res => {
                    if (!res) return msg.edit(new MessageEmbed().setColor("RED").setDescription(`:x: Sorry, something went wrong. Please try again. ${getExampleCommand(bot, 'gif')}`)) 
                    else {
                        let gif = res.data[0];
                        if (!gif) return msg.edit(new MessageEmbed().setColor("RED").setDescription(`:x: Sorry, could not locate a gif by that search query. ${getExampleCommand(bot, 'gif')}`))
                        else return msg.edit(
                            new MessageEmbed()
                            .setColor(medium_purple)
                            .setTitle(gif.title)
                            .setURL(gif.url)
                            .setAuthor(`${bot.user.username} GIFs!`, message.guild.iconURL())
                            .setImage(gif.images.original.url)
                            .setTimestamp()
                            .setFooter(bot.user.username, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                        )
                    }
                })
            }
        } catch (err) {
            console.log(`[ERR] ${err.message}`)
        }
    }
}