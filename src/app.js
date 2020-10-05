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

bot.on("raw", (packet) => {
    bot.manager.updateVoiceState(packet);
    // We don't want this to run on unrelated packets
    if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t))
        return;
    // Grab the channel to check the message from
    const channel = bot.channels.cache.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.messages.fetch(packet.d.message_id).then((message) => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id
            ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
            : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction)
            reaction.users.set(packet.d.user_id, bot.users.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === "MESSAGE_REACTION_ADD") {
            bot.emit("messageReactionAdd", reaction, bot.users.get(packet.d.user_id));
        }
        if (packet.t === "MESSAGE_REACTION_REMOVE") {
            bot.emit(
                "messageReactionRemove",
                reaction,
                bot.users.get(packet.d.user_id)
            );
        }
    });
});
