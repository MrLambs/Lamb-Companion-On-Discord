const { MessageEmbed } = require('discord.js')
const { medium_purple } = require('../../util/jsons/colors.json');
const { getFoxImage } = require('../../util/functions/imageFunctions');

module.exports = {
    config: {
        name: "fox",
        description: "Sends a picture of a fox.",
        usage: "",
        category: "images",
        accessibleby: "members"
    },
    run: async (bot, message, args) => {
        try {
            let msg = await message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(':mag: Generating fox image...'))
            getFoxImage().then(body => {
                if (!{ body }) return msg.edit(new MessageEmbed().setColor("RED").setDescription(":x: Sorry, something went wrong. Please try again."))
                else {
                    let image = body.image
                    return msg.edit(
                        new MessageEmbed()
                            .setColor(medium_purple)
                            .setAuthor(`${bot.user.username} Foxes!`, message.guild.iconURL())
                            .setImage(image)
                            .setTimestamp()
                            .setFooter(bot.user.username, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                    )
                }
            })
        } catch (err) {
            console.log(`[ERR] ${err.message}`)
        }
    }
}