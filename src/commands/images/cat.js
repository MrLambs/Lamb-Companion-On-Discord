const { MessageEmbed } = require('discord.js')
const { medium_purple } = require('../../util/jsons/colors.json');
const { default: fetch } = require('node-fetch');

module.exports = {
    config: {
        name: "cat",
        description: "Sends a picture of a cat.",
        usage: "",
        category: "images",
        accessibleby: "members"
    },
    run: async (bot, message, args) => {
        try {
            let msg = await message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(':mag: Generating cat image...'))

            fetch("http://aws.random.cat/meow")
                .then(res => res.json().then(body => {
                    if (!{ body }) return msg.edit(new MessageEmbed().setColor("RED").setDescription(":x: Sorry, something went wrong. Please try again."))
                    else {
                        return msg.edit(
                            new MessageEmbed()
                                .setColor(medium_purple)
                                .setAuthor(`${bot.user.username} Cats!`, message.guild.splashURL())
                                .setImage(body.file)
                                .setTimestamp()
                                .setFooter(bot.user.username, bot.user.displayAvatarURL({ format: 'png', dynamic: true }))
                        )
                    }
                }))
        } catch (err) {
            console.log(`[ERR] ${err.message}`)
        }
    }
}