const { Items } = require('oldschooljs');
const { MessageEmbed } = require('discord.js');
const { getItemInfo } = require('../../util/functions/osrsFunctions');
const {
    getExampleCommand
} = require('../../util/functions/chatFunctions');

async () => {
    await Items.fetchAll();
}

module.exports = {
    config: {
        name: "rsprice",
        aliases: ["ge", "price", "rsp"],
        usage: `[item to price check]`,
        description: "Check the stats of a player on RuneScape",
        accessibleby: "Members",
        category: "osrs"
    },
    run: async (bot, message, args) => {
        if (!args) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`You need to enter an item for me to search! ${getExampleCommand(bot, 'rsprice')}`))
        else {
            let msg = await message.channel.send(new MessageEmbed().setColor("GREEN").setDescription(`:mag: Fetching current GE data...`))
            const itemToSearch = Items.get(args.join(' '));
            const resultsArr = [];
            if (itemToSearch) resultsArr.push(itemToSearch);
            if (resultsArr.length > 0) {
                getItemInfo(resultsArr[0].id, msg)
            } else {
                return msg.edit(new MessageEmbed().setColor("RED").setDescription(":x: Could not find an item by that name. Item may be too new or misspelled. Please try again."))
            }
        }
    }
}