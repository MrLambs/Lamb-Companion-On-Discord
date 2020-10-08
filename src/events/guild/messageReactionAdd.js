const { MessageEmbed } = require('discord.js');
const { logs_color } = require('../../util/jsons/colors.json');
const { fetchOsrsRoles, determineRoleToAdd } = require('../../util/functions/guildEventsFunctions');

module.exports = async (bot, reaction, user) => {
    let message = reaction.message,
        emoji = reaction.emoji.name,
        member = message.guild.members.fetch(user.id)
    if (message.guild.id === '688514030117453895') {
        fetchOsrsRoles(message).then(roles => {
            console.log(roles)
            determineRoleToAdd(member, message, emoji, roles)
        })
    } else return;
}