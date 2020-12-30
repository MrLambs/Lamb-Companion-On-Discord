const { orange } = require('../../util/jsons/colors.json');
const { getExampleCommand, titleCase } = require('../../util/functions/chatFunctions')
const Quiz = require('../../util/games/quiz')

module.exports = {
    config: {
        name: "trivia",
        aliases: ["quiz"],
        usage: ``,
        description: "Spawn some trivia, receive xp for getting the correct answer",
        accessibleby: "Members",
        category: "economy"
    },
    run: async (bot, message, args) => {
        try {
            new Quiz(message)
                .setTitle(`${message.author.username} has started trivia!`)
                .setColor(orange)
                .setTime(30000) // Set time
                .on('start', game => console.log(game.item.answers)) // Start event also exists
                .run()
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};