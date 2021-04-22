const { MessageEmbed, version: djsversion } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');
const moment = require('moment');
const { trimArray } = require('../../util/functions/miscFunctions')

const filterLevels = {
    DISABLED: 'Off',
    MEMBERS_WITHOUT_ROLES: 'No Role',
    ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const regions = {
    brazil: ':flag_br: Brazil',
    europe: ':flag_eu: Europe',
    hongkong: ':flag_hk: Hong Kong',
    india: ':flag_in: India',
    japan: ':flag_jp: Japan',
    russia: ':flag_ru: Russia',
    singapore: ':flag_sg: Singapore',
    southafrica: ':flag_za: South Africa',
    sydeny: 'Sydeny',
    'us-central': ':flag_us: US Central',
    'us-east': ':flag_us: US East',
    'us-west': ':flag_us: US West',
    'us-south': ':flag_us: US South'
};

module.exports = {
    config: {
        name: "serverinfo",
        aliases: ["si", 'guildinfo', 'gi'],
        usage: ``,
        description: "List information about the server!",
        accessibleby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        try {

            const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            const members = message.guild.members.cache;
            const channels = message.guild.channels.cache;
            const emojis = message.guild.emojis.cache;

            const embed = new MessageEmbed()
                .setDescription(`**Server information for __${message.guild.name}__**`)
                .setColor(orange)
                .addField('General', [
                    `**▶️ Name:** ${message.guild.name}`,
                    `**▶️ ID:** ${message.guild.id}`,
                    `**▶️ Owner:** ${message.guild.owner.user}`,
                    `**▶️ Region:** ${regions[message.guild.region]}`,
                    `**▶️ Boost Tier:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
                    `**▶️ Explicit Filter:** ${filterLevels[message.guild.explicitContentFilter]}`,
                    `**▶️ Verification Level:** ${verificationLevels[message.guild.verificationLevel]}`,
                    `**▶️ Time Created:** ${moment(message.guild.createdTimestamp).format('LL')} [${moment(message.guild.createdTimestamp).fromNow()}]`,
                    '\u200b'
                ])
                .addField('Statistics', [
                    `**▶️ Role Count:** ${roles.length}`,
                    `**▶️ Emoji Count:** ${emojis.size}`,
                    `**▶️ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
                    `**▶️ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
                    `**▶️ Member Count:** ${message.guild.memberCount}`,
                    `**▶️ Humans:** ${members.filter(member => !member.user.bot).size}`,
                    `**▶️ Bots:** ${members.filter(member => member.user.bot).size}`,
                    `**▶️ Text Channels:** ${channels.filter(channel => channel.type === 'text').size}`,
                    `**▶️ Voice Channels:** ${channels.filter(channel => channel.type === 'voice').size}`,
                    `**▶️ Boost Count:** ${message.guild.premiumSubscriptionCount || '0'}`,
                    '\u200b'
                ])
                .addField('Presence', [
                    `**▶️ Online:** ${members.filter(member => member.presence.status === 'online').size}`,
                    `**▶️ Idle:** ${members.filter(member => member.presence.status === 'idle').size}`,
                    `**▶️ Do Not Disturb:** ${members.filter(member => member.presence.status === 'dnd').size}`,
                    `**▶️ Offline:** ${members.filter(member => member.presence.status === 'offline').size}`,
                    '\u200b'
                ])
                .addField(`Roles [${roles.length - 1}]`, roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles) : 'None')
                .setFooter(`© ${message.guild.me.displayName}`, bot.user.displayAvatarURL())

            message.channel.send(embed);
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};