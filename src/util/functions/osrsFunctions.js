const { MessageEmbed } = require('discord.js');
const { Util } = require('oldschooljs')
const { getEmoji, titleCase } = require('./chatFunctions');
const { medium_dark_purple } = require('../jsons/colors.json');
const alchemy = require('osrs-alchemy').default;
const axios = require('axios');

const getOsrsStatsEmojis = async (bot) => {
    let attEmoji = await getEmoji(bot, '710777906846105681'),
    strEmoji = await getEmoji(bot, '710780379044249640'),
    defEmoji = await getEmoji(bot, '710770680412504085'),
    hpEmoji = await getEmoji(bot, '710761509776654336'),
    rangeEmoji = await getEmoji(bot, '710767975874953296'),
    magicEmoji = await getEmoji(bot, '710759336301035581'),
    prayEmoji = await getEmoji(bot, '710766245917622272'),
    cookEmoji = await getEmoji(bot, '710714751142985829'),
    wcEmoji = await getEmoji(bot, '710722331303215126'),
    fletchEmoji = await getEmoji(bot, '710736916324155443'),
    fishEmoji = await getEmoji(bot, '710709534510809108'),
    fmEmoji = await getEmoji(bot, '710719766184198165'),
    craftEmoji = await getEmoji(bot, '710734860301369344'),
    smithEmoji = await getEmoji(bot, '710727022451621939'),
    miningEmoji = await getEmoji(bot, '710732470412378143'),
    herbEmoji = await getEmoji(bot, '710740470661251104'),
    agilEmoji = await getEmoji(bot, '710711286325051412'),
    slayEmoji = await getEmoji(bot, '710778182243975241'),
    farmEmoji = await getEmoji(bot, '710724590904541245'),
    rcEmoji = await getEmoji(bot, '710729638942474260'),
    huntEmoji = await getEmoji(bot, '710741825488551967'),
    consEmoji = await getEmoji(bot, '710744724356464660'),
    thievingEmoji = await getEmoji(bot, '710706385880481823'),
    totalEmoji = await getEmoji(bot, '711068967682179074'),
    minigameEmoji = await getEmoji(bot, '711071289590415364'),
    csEmoji = await getEmoji(bot, '711066301463789619'),
    osrsStatsEmojis = {
        attEmoji,
        strEmoji,
        defEmoji,
        hpEmoji,
        rangeEmoji,
        magicEmoji,
        prayEmoji,
        cookEmoji,
        wcEmoji,
        fletchEmoji,
        fishEmoji,
        fmEmoji,
        craftEmoji,
        smithEmoji,
        miningEmoji,
        herbEmoji,
        agilEmoji,
        slayEmoji,
        farmEmoji,
        rcEmoji,
        huntEmoji,
        consEmoji,
        thievingEmoji,
        totalEmoji,
        minigameEmoji,
        csEmoji,
    };
    return osrsStatsEmojis;
};

const profitPerAlch = (res, item, nat) => {
    if (isNaN(res.data.item.current.price)) {
        return item.alchemy.highAlch - nat.data.item.current.price - Util.fromKMB(res.data.item.current.price)
    } else {
        return item.alchemy.highAlch - nat.data.item.current.price - res.data.item.current.price
    }
};

const getItemInfo = (rsid, msg) => {
    try {
        axios.get(`http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=561`)
            .then(nat => {
                axios
                    .get(`http://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=${rsid}`)
                    .then(res => {
                        alchemy.getItem(rsid).then(item => {
                            
                            let prEmbed = new MessageEmbed()
                                .setTitle(res.data.item.name)
                                .setThumbnail(res.data.item.icon_large)
                                .setColor(medium_dark_purple)
                                .setDescription(res.data.item.description)
                                .addField('Price:', res.data.item.current.price, true)
                                .addField('30-Day Change:', res.data.item.day30.change, true)
                                .addField('90-Day Change:', res.data.item.day90.change, true)
                                .addField('Current Trend:', titleCase(res.data.item.today.trend), true)
                                .addField('30-Day Trend:', titleCase(res.data.item.day30.trend), true)
                                .addField('90-Day Trend:', titleCase(res.data.item.day90.trend), true)
                                .addField('High Alch:', Util.toKMB(item.alchemy.highAlch), true)
                                .addField('Profit Per Alch (w/ Nature Rune):', Util.toKMB(profitPerAlch(res, item, nat)), true)
                                .addField('Buy Limit:', item.buyLimit, true)
                            msg.edit(prEmbed)
                        })
                    })
            })
    }
    catch (err) {
        console.log(`[ERR] ${err.message}`)
    };
}

export {
    getOsrsStatsEmojis,
    getItemInfo
}