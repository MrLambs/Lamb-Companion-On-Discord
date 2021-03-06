const { MessageEmbed } = require('discord.js');
const { fetchOsrsRoles, determineRoleToAdd } = require('../../util/functions/guildEventsFunctions');

module.exports = async (bot, reaction, user) => {
    if (!reaction) return;
    let message = reaction.message,
        emoji = reaction.emoji.name,
        member = message.guild.members.fetch(user.id)
    if (!message.guild.id === '688514030117453895') return;
    else {
        fetchOsrsRoles(message).then(roles => {
            determineRoleToAdd(member, message, emoji, roles)
        })
    }
}