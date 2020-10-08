const { MessageEmbed } = require('discord.js');
const { fetchOsrsRoles, determineRoleToRemove } = require('../../util/functions/guildEventsFunctions');

module.exports = async (bot, reaction, user) => {
    if (!reaction) return;
    let message = reaction.message,
        emoji = reaction.emoji.name,
        member = message.guild.members.fetch(user.id)
    if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: I do not have permission to add roles.")).then(m => m.delete({ timeout: 5000 }))
    else if (!message.guild.id === '688514030117453895') return;
    else {
        fetchOsrsRoles(message).then(roles => {
            determineRoleToRemove(member, message, emoji, roles)
        })
    }
}