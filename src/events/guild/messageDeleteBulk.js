const { MessageEmbed, Collection } = require('discord.js');
const { logs_color } = require('../../util/jsons/colors.json');

module.exports = async (bot, messages) => {
    let count = 0;
    let guild;
    let channel;
    messages.forEach(m => {
        guild = m.guild
        channel = m.channel
        count++
    })
    let found = guild.channels.cache.find(channel => channel.name == 'mod-logs💬')
    if (found) {
        let embed = new MessageEmbed()
            .setColor(logs_color)
            .setTitle('Bulk Messages Deleted')
            .setDescription(`Deleted messages in ${channel}`)
            .addField('Number of Messages:', (count), true)
            .setTimestamp()
        found.send(embed)
    }
};