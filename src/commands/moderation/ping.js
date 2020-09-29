const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: "ping",
        description: "PONG! Displays the api & bot latency",
        usage: ``,
        accessibleby: "Members",
        aliases: ["latency"],
        category: "moderation"
    },
    run: async (bot, message, args) => {
        try {
        message.channel.send('Pinging...')
        .then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp;
            let choices = ["**Is this really my ping?**", "**Is it okay? I can't look**", "**I hope it isn't bad**", "**Ruh roh raggy**"];
            let response = choices[Math.floor(Math.random() * choices.length)];

            let pingEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`${response}: \nBot Latency: \`${ping}ms\`, \nAPI Latency: \`${Math.round(bot.ws.ping)}ms\``)

            m.edit('', pingEmbed)
        })
    } catch (e) {
        console.log(`[ERR] ${e.message}`)
    }
    }
};