const { orange } = require('../../util/jsons/colors.json');
const { getExampleCommand, titleCase } = require('../../util/functions/chatFunctions')
const ConnectFour = require('../../util/games/connect4')

module.exports = {
    config: {
        name: "connect4",
        aliases: ["c4", 'connectfour', 'cfour'],
        usage: ``,
        description: "Play Connect Four with another person",
        accessibleby: "Members",
        category: "economy"
    },
    run: async (bot, message, args) => {
        try {
            new ConnectFour(message)
                .setTitle(`${message.author.username} has started Connect Four!`)
                .setColor(orange)
                .on('start', game => console.log(game)) // Start event also exists
                .on('end', game => console.log(game))
                .run()
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};