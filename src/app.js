const { Client, Collection } = require('discord.js');
const { token, mongoURI } = require('./util/jsons/config.json');
const mongoose = require('mongoose');
const bot = new Client();

["commands", "aliases"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handlers/${x}`)(bot));

mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
.then(() => console.log("[LOGS] MongoDB successfully connected!"))
.catch(err => console.log(`[ERR] ${err.message}`))

bot.login(token)