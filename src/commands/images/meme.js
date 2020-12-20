const { MessageEmbed } = require('discord.js')
const { medium_purple } = require('../../util/jsons/colors.json');
const Random = require('srod-v2');

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
            message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(":mag: Generating meme..."))
                .then(async msg => {
                    let Meme = await Random.GetMeme();
                    return msg.edit(
                        new MessageEmbed()
                            .setColor(medium_purple)
                            .setTitle(Meme.embed.title)
                            .setURL(Meme.embed.url)
                            .setAuthor(`${bot.user.username} Memes!`, message.guild.iconURL())
                            .setImage(Meme.embed.image.url)
                            .setFooter(`${Meme.embed.footer.text} - ${bot.user.username}`)
                    )
                })
        } catch (err) {
            console.log(`[ERR] ${err.message}`)
        }
    }
}