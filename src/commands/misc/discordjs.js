const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    config: {
        name: "discordjs",
        aliases: ["djs", 'djsdocs', 'discordjsdocs'],
        usage: ``,
        description: "test command",
        accessibleby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        try {
            if (!args) return message.channel.send(
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription(':x: Please provide a query for me to search!')
            )
            let query = args.join(' ')

            let res = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`);
            let json = await res.json();

            if (!json) throw new Error(`No Result Found!`);
            else {
                let djsEmbed = new MessageEmbed()
                    .setColor(json.color)
                    .setAuthor(`${json.author.name}`, json.author.icon_url)
                    .setDescription(json.description)

                if (json.title) djsEmbed.setTitle(`${json.title}`)
                if (json.url) djsEmbed.setURL(json.url)
                else djsEmbed.setURL(json.author.url)
                if (json.fields) json.fields.forEach(f => djsEmbed.addField(`${f.name}`, `${f.value}`))

                return message.channel.send(djsEmbed)
            }

        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};