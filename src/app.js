const { Client, Collection } = require('discord.js');
const { token, mongoURI, nodes } = require('./util/jsons/config.json');
const { Manager } = require('erela.js')
const mongoose = require('mongoose');
const bot = new Client();

["commands", "aliases"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handlers/${x}`)(bot));

mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log("[LOGS] MongoDB successfully connected!"))
    .catch(err => console.log(`[ERR] ${err.message}`))

bot.manager = new Manager({
    nodes: nodes,
    autoPlay: true,
    send(id, payload) {
        const guild = bot.guilds.cache.get(id);
        if (guild) guild.shard.send(payload)
    }
})

bot.login(token)

bot.on("raw", (packet) => bot.manager.updateVoiceState(packet));