const { MessageEmbed } = require('discord.js')
const { medium_purple } = require('../../util/jsons/colors.json');
const { getShibeImage } = require('../../util/functions/imageFunctions');

module.exports = {
    config: {
        name: "shibe",
        description: "Sends a picture of a shibe.",
        usage: "",
        category: "images",
        accessibleby: "members"
    },
    run: async (bot, message, args) => {
        try {
            let msg = await message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(':mag: Generating shibe image...'))
            getShibeImage().then(body => {
                if (!{ body }) return msg.edit(new MessageEmbed().setColor("RED").setDescription(":x: Sorry, something went wrong. Please try again."))
                else {
                    let image = body[0]
                    return msg.edit(
                        new MessageEmbed()
                            .setColor(medium_purple)
                            .setAuthor(`${bot.user.username} Shibes!`, message.guild.iconURL())
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