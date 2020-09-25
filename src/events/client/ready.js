const { prefix } = require('../../util/jsons/config.json')

module.exports = async (bot) => {
    console.log(`${bot.user.username} is online!`)

    let statuses = [
        `${prefix}help`
    ]

    setInterval(function () {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status, {
            type: "WATCHING"
        });
    }, 5000)
}