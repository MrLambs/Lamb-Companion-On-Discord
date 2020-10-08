const { Client, Collection } = require("discord.js");
const { token, mongoURI, nodes } = require("./util/jsons/config.json");
const { light_salmon } = require('./util/jsons/colors.json');
const { Manager } = require("erela.js");
const { GiveawaysManager } = require('discord-giveaways');
const mongoose = require("mongoose");
const bot = new Client();

["commands", "aliases"].forEach((x) => (bot[x] = new Collection()));
["command", "event"].forEach((x) => require(`./handlers/${x}`)(bot));

mongoose
    .connect(mongoURI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
    })
    .then(() => console.log("[LOGS] MongoDB successfully connected!"))
    .catch((err) => console.log(`[ERR] ${err.message}`));

bot.manager = new Manager({
    nodes: nodes,
    autoPlay: true,
    send(id, payload) {
        const guild = bot.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
});

const manager = new GiveawaysManager(bot, {
    storage: './src/util/jsons/giveaways.json',
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
        embedColor: light_salmon,
        embedColorEnd: light_salmon,
        reaction: "🎉"
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
bot.giveawaysManager = manager;

bot.login(token);