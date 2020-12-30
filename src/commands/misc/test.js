const { orange } = require('../../util/jsons/colors.json');
const { getExampleCommand, titleCase } = require('../../util/functions/chatFunctions')
const { tarkovScrape } = require('../../util/functions/tarkovFunctions')

module.exports = {
    config: {
        name: "test",
        aliases: [""],
        usage: ``,
        description: "test command",
        accessibleby: "Members",
        category: "misc"
    },
    run: async (bot, message, args) => {
        try {
            tarkovScrape()
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};