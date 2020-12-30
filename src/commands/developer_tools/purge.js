const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "purge",
        description: "Purge between 2-100 messages!",
        usage: `[2-100]`,
        accessibleby: "Members",
        aliases: ["latency"],
        category: "developer_tools"
    },
    run: async (bot, message, args) => {
        try {
            if (!args[0] || isNaN(args[0]) || args[0] < 2 || args[0] > 100) return message.channel.send(`Please provide a **number** from \`2-100\``);
            const deleted = await message.channel.messages.fetch({ limit: args[0] });
            message.delete();
            message.channel.bulkDelete(deleted);
            let embed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`:white_check_mark: Deleted: \`${deleted.size}/${args[0]}\` messages.`)
            return message.channel.send(embed)
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};