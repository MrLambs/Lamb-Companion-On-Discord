const { MessageEmbed, version: djsversion } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');
const { version } = require('../../../package.json');
const { utc } = require('moment');
const { formatBytes } = require('../../util/functions/miscFunctions');
const os = require('os');
const ms = require('ms');

module.exports = {
    config: {
        name: "botinfo",
        aliases: ["bi"],
        usage: ``,
        description: "List information about the bot!",
        accessibleby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        try {
            const core = os.cpus()[0];
            const embed = new MessageEmbed()
                .setColor(orange)
                .addField('General', [
                    `**▶️ Client:** ${bot.user.tag}`,
                    `**▶️ ID:** ${bot.user.id}`,
                    `**▶️ Commands:** ${bot.commands.size}`,
                    `**▶️ Servers:** ${bot.guilds.cache.size.toLocaleString()} `,
                    `**▶️ Users:** ${bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
                    `**▶️ Channels:** ${bot.channels.cache.size.toLocaleString()}`,
                    `**▶️ Creation Date:** ${utc(bot.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
                    `**▶️ Version:** v${version}`,
                    `**▶️ Node.js:** ${process.version}`,
                    `**▶️ Discord.js:** v${djsversion}`,
                    '\u200b'
                ])
                .addField('System', [
                    `**▶️ Platform:** ${process.platform}`,
                    `**▶️ Uptime:** ${ms(os.uptime() * 1000, { long: true })}`,
                    `**▶️ CPU:**`,
                    `\u3000 Cores: ${os.cpus().length}`,
                    `\u3000 Model: ${core.model}`,
                    `\u3000 Speed: ${core.speed}MHz`,
                    `**▶️ Memory:**`,
                    `\u3000 Total: ${formatBytes(process.memoryUsage().heapTotal)}`,
                    `\u3000 Used: ${formatBytes(process.memoryUsage().heapUsed)}`
                ])
                .setTimestamp();

            message.channel.send(embed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};