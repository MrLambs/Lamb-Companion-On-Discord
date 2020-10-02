const { MessageEmbed, Collection } = require('discord.js');
const { logs_color } = require('../../util/jsons/colors.json');

module.exports = async (bot, message) => {
    let guild = message.guild
    let found = guild.channels.cache.find(channel => channel.name == 'mod-logs💬')
    if (message.author.bot || message.channel.type === "dm") return;
    if (message.content.startsWith('!purge')) return;
    if (found) {
        let embed = new MessageEmbed()
            .setColor(logs_color)
            .setTitle('Message Deleted')
            .setDescription(`Deleted message in ${message.channel}`)
            .addField('Message Content:', `${message.content || `Unavailable`}`)
            .addField('Message Author:', `${message.author}`)
            .setTimestamp()
        found.send(embed)
    }
};