const { orange } = require('../../util/jsons/colors.json');
const { getExampleCommand, titleCase } = require('../../util/functions/chatFunctions')
const Quiz  = require('../../util/games/quiz')

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
            new Quiz(message)
                .setTitle('My quiz')
                .setColor(orange)
                .setTime(20000) // Set time
                .on('start', game => console.log(game.item.answers)) // Start event also exists
                .run()
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};