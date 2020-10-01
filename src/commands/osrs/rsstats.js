const { MessageEmbed } = require('discord.js');
const { Hiscores } = require('oldschooljs');
const { medium_dark_purple } = require('../../util/jsons/colors.json');
const { getOsrsStatsEmojis } = require('../../util/functions/osrsFunctions');
const { stripIndents } = require('common-tags')
const {
    titleCase,
    addCommas,
    getExampleCommand
} = require('../../util/functions/chatFunctions');

module.exports = {
    config: {
        name: "rsstats",
        aliases: ["stats", "hiscores", "rshiscores", "rsh"],
        usage: `[RuneScape username]`,
        description: "Check the stats of a player on RuneScape",
        accessibleby: "Members",
        category: "osrs"
    },
    run: async (bot, message, args) => {
        let userToSearch = args[0]
        if (!userToSearch) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`:x: Please tell me who to search for. ${getExampleCommand(bot, 'rsstats')}`))
        else {
            userToSearch = userToSearch.toLowerCase()
            let msg = await message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(`:mag: Fetching Old School RuneScape hiscores...`))
            let foundPlayer = await Hiscores.fetch(userToSearch).catch(err => console.log(`[ERR] ${err.message}`));
            if (!foundPlayer) return msg.edit(new MessageEmbed().setColor("RED").setDescription(`:x: Could not find OSRS player by that username. Please check spelling and try again.`))
            else {
                let skills = foundPlayer.skills;
                getOsrsStatsEmojis(bot)
                    .then(emojis => {
                        msg.edit(
                            new MessageEmbed()
                                .setColor(medium_dark_purple)
                                .setTitle(titleCase(foundPlayer.username))
                                .addField('\u200b', stripIndents`
            ${emojis.attEmoji} ${skills.attack.level}
            ${emojis.strEmoji} ${skills.strength.level}
            ${emojis.defEmoji} ${skills.defence.level}
            ${emojis.rangeEmoji} ${skills.ranged.level}
            ${emojis.prayEmoji} ${skills.prayer.level}
            ${emojis.magicEmoji} ${skills.magic.level}
            ${emojis.rcEmoji} ${skills.runecraft.level}
            ${emojis.consEmoji} ${skills.construction.level}
            `, true)
                                .addField('\u200b', stripIndents`
            ${emojis.hpEmoji} ${skills.hitpoints.level}
            ${emojis.agilEmoji} ${skills.agility.level}
            ${emojis.herbEmoji} ${skills.herblore.level}
            ${emojis.thievingEmoji} ${skills.thieving.level}
            ${emojis.craftEmoji} ${skills.crafting.level}
            ${emojis.fletchEmoji} ${skills.fletching.level}
            ${emojis.slayEmoji} ${skills.slayer.level}
            ${emojis.huntEmoji} ${skills.hunter.level}
            `, true)
                                .addField('\u200b', stripIndents`
            ${emojis.miningEmoji} ${skills.mining.level}
            ${emojis.smithEmoji} ${skills.smithing.level}
            ${emojis.fishEmoji} ${skills.fishing.level}
            ${emojis.cookEmoji} ${skills.cooking.level}
            ${emojis.fmEmoji} ${skills.firemaking.level}
            ${emojis.wcEmoji} ${skills.woodcutting.level}
            ${emojis.farmEmoji} ${skills.farming.level}
            ${emojis.totalEmoji} ${addCommas(skills.overall.level)}
            `, true)
                                .addField(`${emojis.totalEmoji} Overall`, stripIndents`
            Rank: ${addCommas(skills.overall.rank)}
            Level: ${addCommas(skills.overall.level)}
            XP: ${addCommas(skills.overall.xp)}
            `, true)
                                .addField(`${emojis.minigameEmoji} Minigame Scores`, stripIndents`
            Bounty Hunter: ${foundPlayer.minigames.bountyHunter.score}
            BH-Rogue: ${foundPlayer.minigames.bountyHunterRogue.score}
            LMS: ${foundPlayer.minigames.LMS.score}
            `, true)
                                .addField(`${emojis.csEmoji} Clue Scores`, stripIndents`
            Beginner: ${foundPlayer.clues.beginner.score}
            Easy: ${foundPlayer.clues.easy.score}
            Medium: ${foundPlayer.clues.medium.score}
            Hard: ${foundPlayer.clues.hard.score}
            Elite: ${foundPlayer.clues.elite.score}
            Master: ${foundPlayer.clues.master.score}
            `, true)
                                .setThumbnail('https://oldschool.runescape.wiki/images/4/41/Old_School_RuneScape_logo.png?1d864')
                                .setFooter(`Total Lvl: ${skills.overall.level} | Total XP: ${addCommas(skills.overall.xp)}`)
                        )

                    })
            }
        }
    }
}