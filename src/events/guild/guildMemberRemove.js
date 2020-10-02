const { MessageEmbed, Collection } = require('discord.js');
const { red } = require('../../util/jsons/colors.json')

module.exports = async (bot, member) => {
    const newUsers = []

    let messageToSend = [`**${member.user.username}** has just left the server.`, `We will miss you, **${member.user.username}.**`, `You will be remember as the person you were, **${member.user.username}**.`, `**${member.user.username}**, see you on the other side.`, `Hasta la vista, **${member.user.username}**.`, `**${member.user.username}** has left the building.`, `**${member.user.username}** is gone, but never forgotten.`];

    let addEmbed = new MessageEmbed()
    .setDescription(messageToSend[Math.floor(Math.random() * messageToSend.length)])
    .setColor(red);

    const guild = member.guild;
    if (!newUsers[guild.id]) newUsers[guild.id] = new Collection();
    newUsers[guild.id].set(member.id, member.user);

    if (newUsers[guild.id].size > 0) {
        guild.channels.cache.find(channel => channel.name == '🚪join_leave' || channel.name == '💠welcome💠').send(addEmbed);
    }
};