const { MessageEmbed } = require('discord.js')

module.exports = {
    config: {
        name: "uptime",
        description: "Displays the bots current uptime!",
        usage: ``,
        accessableby: "Members",
        aliases: ["ut"],
        category: "developer_tools"
    },
    run: async (bot, message, args) => {
        try {
            const duration = ms => {
                const sec = Math.floor((ms / 1000) % 60).toString();
                const min = Math.floor((ms / (1000 * 60)) % 60).toString();
                const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
                return `\`\`${hrs.padStart(2, '0')}\`\` **hours**, \`\`${min.padStart(2, '0')}\`\` **minutes**, \`\`${sec.padStart(2, '0')}\`\` **seconds**.`
            };

            return message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(`I have been online for: ${duration(bot.uptime)}`));
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};