const { MessageEmbed } = require('discord.js');
const { orange } = require('../../util/jsons/colors.json');
const { titleCase } = require('../../util/functions/chatFunctions')
const { sdwFetch } = require('../../util/functions/miscFunctions.js');

module.exports = {
    config: {
        name: "sdw",
        aliases: ["stardewwiki", "sdwiki"],
        usage: `(search query)`,
        description: "The bot returns info from Stardew Valley Wiki",
        accessibleby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        try {
            let newArgs = []
            if (args[0]) {
                for (i = 0; i < args.length; i++) {
                    newArgs.push(titleCase(args[i]))
                }
            }
            sdwFetch(newArgs.join('_'))
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};