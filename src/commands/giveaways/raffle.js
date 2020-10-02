const ms = require("ms"); // npm install ms

module.exports = {
    config: {
        name: "raffle",
        aliases: ["giveaway"],
        usage: `(time, for example: 60s or 2d) (number of winners) (prize)`,
        description: "Start a giveaway with a custom prize and end date!",
        accessableby: "members",
        category: "giveaways"
    },
    run: async (bot, message, args) => {
        // !giveaway 2d 1 Awesome prize!
        // will create a giveaway with a duration of two days, with one winner and the prize will be "Awesome prize!"
        try {
            await message.delete()
            bot.giveawaysManager.start(message.channel, {
                time: ms(args[0]),
                prize: args.slice(2).join(" "),
                winnerCount: parseInt(args[1]),
                messages: {
                    giveaway: `🎉🎉 **Giveaway** hosted by: ${message.author.username} 🎉🎉`,
                    giveawayEnded: `🎉🎉 **Giveaway** hosted by: ${message.author.username} **has __ended__** 🎉🎉`,
                    timeRemaining: "Time remaining: **{duration}**!",
                    inviteToParticipate: "React with 🎉 to participate!",
                    winMessage: `Congratulations, {winners}! You have just won **{prize}**\n\nPlease reach out to ${message.author.username} to claim your giveaway.`,
                    embedFooter: "Giveaways",
                    noWinner: "Giveaway cancelled, no valid participations.",
                    hostedBy: `Hosted by: ${message.author.username}`,
                    winners: "winner(s)",
                    endedAt: "Ended at",
                    units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                        pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
                    }
                }
            });
        } catch (e) {
            console.log(`[ERR] ${e.message}`)
        }
    }
};