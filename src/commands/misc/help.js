const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs")
const { stripIndents } = require("common-tags")
const { orange } = require('../../util/jsons/colors.json');
const { prefix } = require("../../util/jsons/config.json");
const { capitalize} = require('../../util/functions/chatFunctions');

module.exports = {
    config: {
        name: "help",
        aliases: ["h", "halp", "commands"],
        usage: "(command)",
        category: "misc",
        description: "Displays all commands that the bot has.",
        accessibleby: "Members"
    },
    run: async (bot, message, args) => {
        try {
            const embed = new MessageEmbed()
                .setColor(orange)
                .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL)
                .setThumbnail(bot.user.displayAvatarURL)

            if (!args[0]) {
                const categories = readdirSync("./src/commands/")

                embed.setDescription(stripIndents`
                The bot prefix is: **${prefix}**
                --
                📣 Try ***${prefix}help (command name)*** to learn more! 📣
                
                **__These are the avaliable commands for ${message.guild.me.displayName}__**
                `)
                embed.setFooter(`© ${message.guild.me.displayName} | Total Commands: ${bot.commands.size}`, bot.user.displayAvatarURL);

                categories.forEach(category => {
                    const dir = bot.commands.filter(c => c.config.category === category)
                    try {
                        embed.addField(`▶️ ${capitalize(category)} [${dir.size}]:`, dir.map(c => `\`${c.config.name}\``).join(" "))
                    } catch (e) {
                        console.log(e)
                    }
                })

                return message.channel.send(embed)
            } else {
                let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
                if (!command) return message.channel.send(embed.setTitle("Invalid Command.").setDescription(`Do \`${prefix}help\` for the list of the commands.`))
                command = command.config

                embed.setDescription(stripIndents `The bot's prefix is: \`${prefix}\`\n
            **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}
            **Description:** ${command.description || "No Description provided."}
            **Usage:** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "No Usage"}
            **Accessible by:** ${command.accessableby || "Members"}
            **Aliases:** ${command.aliases ? command.aliases.join(", ") : "None."}`)

                return message.channel.send(embed)
            }
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
}