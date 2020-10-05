const resetTripSpecificChannel = (bot) => {
    let TDN = bot.guilds.cache.get("688514030117453895")

    setInterval(async function () {
        let category = TDN.channels.cache.find(c => c.name === '💬 Text Channels 💬' && c.type === 'category')
        let found = TDN.channels.cache.find(c => c.name === 'trip-specific-stuff👁' && c.type === 'text')
        if (found) {
            await found.delete()
            await TDN.createChannel('trip-specific-stuff👁', {
                type: "text"
            })
            found = TDN.channels.cache.find(c => c.name === 'trip-specific-stuff👁' && c.type === 'text')
            if (category && found) found.setParent(category.id)
        }
    }, 24 * 3600000)

}


export {
    resetTripSpecificChannel
}