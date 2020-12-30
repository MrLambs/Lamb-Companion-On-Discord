const { MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags')
const { my_discord_id } = require('../../util/jsons/config.json');


module.exports = {
    config: {
        name: "restart",
        aliases: ["poweroff", "gotosleep", "shutdown"],
        usage: ``,
        description: "Shuts the bot down",
        accessibleby: "owner",
        category: "developer_tools"
    },
    run: async (bot, message, args) => {
        console.log(`[LOGS] Client restart triggered.`);
        if (message.author.id !== my_discord_id) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: You do not have permission to do that`));
        else {
            try {

                let msg = await message.channel.send(
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(stripIndents`
        :white_check_mark: **Restarting ${bot.user.username}...**
        `)
                );

                await msg.react('👋')
                return process.exit()
            } catch (err) {
                console.log(`[ERR] ${err.message}`)
            }
        }
    }
};