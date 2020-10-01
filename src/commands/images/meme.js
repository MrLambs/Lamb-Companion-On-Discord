const { MessageEmbed } = require('discord.js')
const { medium_purple } = require('../../util/jsons/colors.json');
const { getMeme } = require('../../util/functions/imageFunctions');

module.exports = {
    config: {
        name: "meme",
        description: "Spawns a random meme from Reddit!",
        usage: "",
        category: "images",
        accessibleby: "members"
    },
    run: async (bot, message, args) => {
        try {
                let msg = await message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(":mag: Generating meme..."));
                getMeme().then(meme => {
                    if (meme.code === 503) return msg.edit(new MessageEmbed().setColor("RED").setDescription(`Sorry, something went wrong. Please try again.`)) 
                    else {
                        return msg.edit(
                            new MessageEmbed()
                            .setColor(medium_purple)
                            .setTitle(meme.title)
                            .setURL(meme.postLink)
                            .setAuthor(`${bot.user.username} Memes!`, message.guild.iconURL())
                            .setImage(meme.url)
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